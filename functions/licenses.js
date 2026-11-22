// De licentieserver van QuizNote Pro (issue #384 in de app-repo). Zonder database:
//   - een licentiecode is het id van het Stripe-abonnement plus een handtekening (HMAC), zodat
//     niemand een code kan verzinnen;
//   - op welke Macs een code staat, bewaren we in de metadata van dat abonnement;
//   - of Pro geldt, vragen we steeds aan Stripe.
// Deze module kent Firebase niet; index.js koppelt hem aan een HTTP-functie. Stripe komt erin
// via `deps.stripe`, zodat de tests een nep-Stripe kunnen gebruiken.
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

/** Op zoveel Macs tegelijk mag één code staan. */
export const MAX_MACS = 3
const MACS_KEY = 'quiznote_macs'

function sign(id, secret) {
  return createHmac('sha256', secret)
    .update(`quiznote-pro:${id}`)
    .digest('base64url')
    .replace(/[-_]/g, '')
    .slice(0, 12)
    .toUpperCase()
}

/** De code bij een abonnement, bv. QNP-1QaBcD…-K3J9X2M4P7QZ. */
export function makeKey(subscriptionId, secret) {
  const id = subscriptionId.replace(/^sub_/, '')
  return `QNP-${id}-${sign(id, secret)}`
}

/** Het abonnement bij een code, of null als de code niet klopt. */
export function parseKey(key, secret) {
  const match = /^QNP-([A-Za-z0-9]+)-([A-Z0-9]{8,12})$/.exec(String(key ?? '').trim())
  if (!match) return null
  const expected = Buffer.from(sign(match[1], secret))
  const given = Buffer.from(match[2])
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  return `sub_${match[1]}`
}

const ms = (seconds) => (seconds ? seconds * 1000 : null)

/** Of een abonnement Pro geeft. Bij een betaalprobleem (past_due) nog even wel: Stripe probeert opnieuw. */
export function licenseStatus(subscription, productId) {
  const hasPro = subscription.items.data.some((item) => {
    const product = item.price.product
    return (typeof product === 'string' ? product : product?.id) === productId
  })
  if (!hasPro) return { status: 'disabled', expiresAt: null }
  if (['active', 'trialing', 'past_due'].includes(subscription.status)) {
    return { status: 'active', expiresAt: ms(subscription.cancel_at) }
  }
  return { status: 'expired', expiresAt: ms(subscription.ended_at ?? subscription.canceled_at) }
}

function macsOf(subscription) {
  try {
    const list = JSON.parse(subscription.metadata?.[MACS_KEY] ?? '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

const saveMacs = (deps, subscription, macs) =>
  deps.stripe.subscriptions.update(subscription.id, {
    metadata: { [MACS_KEY]: JSON.stringify(macs) }
  })

const ok = (json) => ({ status: 200, json })
const fail = (status, error) => ({ status, json: { error } })

async function subscriptionFor(key, deps) {
  const id = parseKey(key, deps.secret)
  if (!id) return null
  try {
    return await deps.stripe.subscriptions.retrieve(id)
  } catch (err) {
    if (err?.statusCode === 404 || err?.code === 'resource_missing') return null
    throw err
  }
}

/** Een koopknop: maakt een Checkout-sessie (met Managed Payments) en stuurt de koper erheen. */
async function checkout(query, deps) {
  const interval = query.plan === 'year' ? 'year' : 'month'
  const prices = await deps.stripe.prices.list({ product: deps.productId, active: true, limit: 10 })
  const price = prices.data.find((p) => p.recurring?.interval === interval)
  if (!price) return fail(500, 'no-price')
  const session = await deps.stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: price.id, quantity: 1 }],
    managed_payments: { enabled: true },
    success_url: `${deps.site}/pro/bedankt?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${deps.site}/pro`
  })
  return { status: 303, redirect: session.url }
}

/** De bedankpagina haalt hiermee de code op, met het id van de afgeronde sessie. */
async function keyForSession(query, deps) {
  const sessionId = String(query.session_id ?? '')
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return fail(400, 'invalid')
  const session = await deps.stripe.checkout.sessions.retrieve(sessionId)
  if (session.status !== 'complete' || !session.subscription) return fail(409, 'not-paid')
  const subscription =
    typeof session.subscription === 'string' ? session.subscription : session.subscription.id
  return ok({ key: makeKey(subscription, deps.secret) })
}

async function activate(body, deps) {
  const subscription = await subscriptionFor(body.key, deps)
  if (!subscription) return fail(404, 'invalid')
  const license = licenseStatus(subscription, deps.productId)
  if (license.status !== 'active') return fail(403, license.status)
  const macs = macsOf(subscription)
  if (macs.length >= MAX_MACS) return fail(409, 'limit')
  const mac = { id: randomUUID(), name: String(body.name ?? 'Mac').slice(0, 60), at: deps.now() }
  await saveMacs(deps, subscription, [...macs, mac])
  return ok({ instanceId: mac.id, ...license })
}

async function validate(body, deps) {
  const subscription = await subscriptionFor(body.key, deps)
  if (!subscription) return ok({ status: 'disabled', expiresAt: null })
  const license = licenseStatus(subscription, deps.productId)
  // Een Mac die van de code is gehaald, telt niet meer.
  if (!macsOf(subscription).some((m) => m.id === body.instanceId)) {
    return ok({ status: 'disabled', expiresAt: license.expiresAt })
  }
  return ok(license)
}

async function deactivate(body, deps) {
  const subscription = await subscriptionFor(body.key, deps)
  if (!subscription) return ok({ deactivated: false })
  const macs = macsOf(subscription)
  const left = macs.filter((m) => m.id !== body.instanceId)
  if (left.length !== macs.length) await saveMacs(deps, subscription, left)
  return ok({ deactivated: left.length !== macs.length })
}

/**
 * Eén verzoek. `path` mag met of zonder /api beginnen (de rewrite van Firebase Hosting houdt het).
 * Geeft `{ status, json }` of `{ status, redirect }`.
 */
export async function handle(request, deps) {
  const path = request.path.replace(/^\/api/, '').replace(/\/$/, '')
  const body = request.body && typeof request.body === 'object' ? request.body : {}
  try {
    if (request.method === 'GET' && path === '/checkout') return await checkout(request.query, deps)
    if (request.method === 'GET' && path === '/key') return await keyForSession(request.query, deps)
    if (request.method === 'POST' && path === '/licenses/activate')
      return await activate(body, deps)
    if (request.method === 'POST' && path === '/licenses/validate')
      return await validate(body, deps)
    if (request.method === 'POST' && path === '/licenses/deactivate')
      return await deactivate(body, deps)
    return fail(404, 'not-found')
  } catch (err) {
    console.error('licentieserver', path, err?.message ?? err)
    return fail(502, 'stripe')
  }
}
