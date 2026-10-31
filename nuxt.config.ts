// De site wordt statisch gebouwd (`pnpm generate`), zodat hij op elke host kan; die keuze komt later.
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://quiznote.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n'],
  css: ['@fontsource-variable/bricolage-grotesque', '~/assets/css/main.css'],

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#0f1420' },
        { name: 'color-scheme', content: 'dark' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      siteUrl,
      // Waar de download komt te staan is nog niet besloten. Leeg = de site toont een melding in plaats van de knop.
      downloadUrl: '',
      // PostHog (EU). De sleutel is niet geheim: hij komt toch in de JavaScript van de site.
      // Leeg (NUXT_PUBLIC_POSTHOG_KEY='') = geen analytics.
      posthogKey: 'phc_rGB9TQNdexJ5szAgvnfGbFJkH5CDxNWHA8H3JLoUrYfL',
      posthogHost: 'https://eu.i.posthog.com'
    }
  },

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'nl',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'nl', language: 'nl-NL', name: 'Nederlands' },
      { code: 'en', language: 'en', name: 'English' }
    ]
  },

  nitro: {
    prerender: { routes: ['/', '/en'], crawlLinks: true }
  }
})
