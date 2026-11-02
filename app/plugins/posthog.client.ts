// Analytics met PostHog (EU), zonder cookies: alles blijft in het geheugen van de pagina,
// dus er is geen cookiebanner nodig. Zonder NUXT_PUBLIC_POSTHOG_KEY doet de site niets.
import type { PostHog } from 'posthog-js'

export default defineNuxtPlugin(() => {
  const { posthogKey, posthogHost } = useRuntimeConfig().public
  let client: PostHog | null = null

  // Pas laden na het opstarten van de pagina, zodat het de site niet vertraagt.
  if (posthogKey) {
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        persistence: 'memory',
        person_profiles: 'identified_only',
        capture_pageview: 'history_change',
        disable_session_recording: true
      })
      client = posthog
    })
  }

  // Een eigen event, zoals een klik op de downloadknop. Met sendBeacon komt hij ook aan
  // als de browser meteen naar een andere pagina gaat.
  function track(event: string, properties: Record<string, unknown> = {}) {
    client?.capture(event, properties, { transport: 'sendBeacon', send_instantly: true })
  }

  return { provide: { track } }
})
