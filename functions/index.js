// Firebase Functions voor quiznote.app. Firebase Hosting stuurt /api/** hierheen (firebase.json).
// De logica staat in licenses.js; hier alleen de koppeling met HTTP, Stripe en de geheimen.
import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret, defineString } from 'firebase-functions/params'
import Stripe from 'stripe'
import { handle } from './licenses.js'

const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY')
const LICENSE_SECRET = defineSecret('LICENSE_SECRET')
const PRO_PRODUCT_ID = defineString('PRO_PRODUCT_ID')
const SITE_URL = defineString('SITE_URL', { default: 'https://quiznote.app' })

let stripe = null

export const api = onRequest(
  { region: 'europe-west1', secrets: [STRIPE_SECRET_KEY, LICENSE_SECRET], maxInstances: 5 },
  async (req, res) => {
    stripe ??= new Stripe(STRIPE_SECRET_KEY.value())
    const out = await handle(
      { method: req.method, path: req.path, query: req.query, body: req.body },
      {
        stripe,
        secret: LICENSE_SECRET.value(),
        productId: PRO_PRODUCT_ID.value(),
        site: SITE_URL.value(),
        now: () => Date.now()
      }
    )
    res.set('Cache-Control', 'no-store')
    if (out.redirect) res.redirect(out.status, out.redirect)
    else res.status(out.status).json(out.json)
  }
)
