// Analytics met PostHog (EU), zonder cookies: alles blijft in het geheugen van de pagina,
// dus er is geen cookiebanner nodig. Zonder NUXT_PUBLIC_POSTHOG_KEY doet de site niets.
export default defineNuxtPlugin(() => {
  const { posthogKey, posthogHost } = useRuntimeConfig().public
  if (!posthogKey) return

  // Pas laden na het opstarten van de pagina, zodat het de site niet vertraagt.
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      persistence: 'memory',
      person_profiles: 'identified_only',
      capture_pageview: 'history_change',
      disable_session_recording: true
    })
  })
})
