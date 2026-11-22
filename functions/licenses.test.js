import assert from 'node:assert/strict'
import { test } from 'node:test'
import { handle, licenseStatus, makeKey, MAX_MACS, parseKey } from './licenses.js'

const SECRET = 'test-geheim'
const PRODUCT = 'prod_PRO'

/** Een nep-Stripe met één abonnement; onthoudt de metadata zoals Stripe dat doet. */
function fakeStripe(sub = {}) {
  const subscription = {
    id: 'sub_1AbC2dEf',
    status: 'active',
    cancel_at: null,
    metadata: {},
    items: { data: [{ price: { product: PRODUCT } }] },
    ...sub
  }
  const created = []
  return {
    subscription,
    created,
    subscriptions: {
      retrieve: async (id) => {
        if (id !== subscription.id) throw Object.assign(new Error('missing'), { statusCode: 404 })
        return structuredClone(subscription)
      },
      update: async (id, { metadata }) => Object.assign(subscription.metadata, metadata)
    },
    prices: {
      list: async () => ({
        data: [
          { id: 'price_month', recurring: { interval: 'month' } },
          { id: 'price_year', recurring: { interval: 'year' } }
        ]
      })
    },
    checkout: {
      sessions: {
        create: async (params) => (created.push(params), { url: 'https://checkout.stripe.test/s' }),
        retrieve: async (id) =>
          id === 'cs_klaar'
            ? { status: 'complete', subscription: subscription.id }
            : { status: 'open', subscription: null }
      }
    }
  }
}

const deps = (stripe) => ({
  stripe,
  secret: SECRET,
  productId: PRODUCT,
  site: 'https://quiznote.app',
  now: () => 1
})
const post = (path, body, stripe) => handle({ method: 'POST', path, query: {}, body }, deps(stripe))
const get = (path, query, stripe) => handle({ method: 'GET', path, query, body: {} }, deps(stripe))

test('een code hoort bij één abonnement en is niet te verzinnen', () => {
  const key = makeKey('sub_1AbC2dEf', SECRET)
  assert.match(key, /^QNP-1AbC2dEf-[A-Z0-9]{8,12}$/)
  assert.equal(parseKey(key, SECRET), 'sub_1AbC2dEf')
  assert.equal(parseKey(` ${key} `, SECRET), 'sub_1AbC2dEf')
  assert.equal(parseKey(key, 'ander-geheim'), null)
  assert.equal(parseKey(key.replace('1AbC', '1XbC'), SECRET), null)
  assert.equal(parseKey('onzin', SECRET), null)
})

test('de status volgt het abonnement', () => {
  const item = { items: { data: [{ price: { product: { id: PRODUCT } } }] } }
  assert.deepEqual(licenseStatus({ ...item, status: 'active', cancel_at: null }, PRODUCT), {
    status: 'active',
    expiresAt: null
  })
  assert.deepEqual(licenseStatus({ ...item, status: 'active', cancel_at: 100 }, PRODUCT), {
    status: 'active',
    expiresAt: 100_000
  })
  assert.equal(licenseStatus({ ...item, status: 'past_due' }, PRODUCT).status, 'active')
  assert.equal(
    licenseStatus({ ...item, status: 'canceled', ended_at: 5 }, PRODUCT).status,
    'expired'
  )
  assert.equal(licenseStatus({ ...item, status: 'active' }, 'prod_ANDER').status, 'disabled')
})

test('kopen: de juiste prijs, met Managed Payments, en daarna de code op de bedankpagina', async () => {
  const stripe = fakeStripe()
  const year = await get('/api/checkout', { plan: 'year' }, stripe)
  assert.equal(year.status, 303)
  assert.equal(year.redirect, 'https://checkout.stripe.test/s')
  assert.equal(stripe.created[0].line_items[0].price, 'price_year')
  assert.deepEqual(stripe.created[0].managed_payments, { enabled: true })
  assert.equal(stripe.created[0].mode, 'subscription')
  await get('/api/checkout', {}, stripe)
  assert.equal(stripe.created[1].line_items[0].price, 'price_month')

  assert.deepEqual(await get('/api/key', { session_id: 'cs_klaar' }, stripe), {
    status: 200,
    json: { key: makeKey('sub_1AbC2dEf', SECRET) }
  })
  assert.equal((await get('/api/key', { session_id: 'cs_open' }, stripe)).status, 409)
  assert.equal((await get('/api/key', { session_id: '../x' }, stripe)).status, 400)
})

test('aanzetten, controleren en weghalen, met een maximum aantal Macs', async () => {
  const stripe = fakeStripe()
  const key = makeKey('sub_1AbC2dEf', SECRET)

  const first = await post('/licenses/activate', { key, name: 'MacBook' }, stripe)
  assert.equal(first.status, 200)
  assert.equal(first.json.status, 'active')
  const instanceId = first.json.instanceId
  assert.deepEqual((await post('/licenses/validate', { key, instanceId }, stripe)).json, {
    status: 'active',
    expiresAt: null
  })

  for (let i = 1; i < MAX_MACS; i++) await post('/licenses/activate', { key }, stripe)
  assert.deepEqual(await post('/licenses/activate', { key }, stripe), {
    status: 409,
    json: { error: 'limit' }
  })

  assert.deepEqual((await post('/licenses/deactivate', { key, instanceId }, stripe)).json, {
    deactivated: true
  })
  assert.equal(
    (await post('/licenses/validate', { key, instanceId }, stripe)).json.status,
    'disabled'
  )
  assert.equal((await post('/licenses/activate', { key }, stripe)).status, 200)
})

test('een verzonnen, onbekende of verlopen code werkt niet', async () => {
  const stripe = fakeStripe({ status: 'canceled', ended_at: 9 })
  assert.deepEqual(await post('/licenses/activate', { key: 'QNP-nep-ABCDEFGH' }, stripe), {
    status: 404,
    json: { error: 'invalid' }
  })
  const other = makeKey('sub_Onbekend', SECRET)
  assert.equal((await post('/licenses/activate', { key: other }, stripe)).status, 404)
  const key = makeKey('sub_1AbC2dEf', SECRET)
  assert.deepEqual(await post('/licenses/activate', { key }, stripe), {
    status: 403,
    json: { error: 'expired' }
  })
})

test('een storing bij Stripe wordt 502, een onbekend pad 404', async () => {
  const stripe = fakeStripe()
  stripe.subscriptions.retrieve = async () => {
    throw new Error('stuk')
  }
  const key = makeKey('sub_1AbC2dEf', SECRET)
  assert.equal((await post('/licenses/validate', { key }, stripe)).status, 502)
  assert.equal((await get('/api/iets', {}, stripe)).status, 404)
})
