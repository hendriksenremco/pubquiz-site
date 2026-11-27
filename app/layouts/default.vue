<script setup lang="ts">
// De letter van de koppen (Latijn) meteen laden, niet pas als de CSS gelezen is: de h1 staat zo eerder in zijn eigen letter.
import headingFontUrl from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url'
// Op de server is dit een pad, in de browser een volledige URL; met hetzelfde pad maakt unhead er geen tweede tag van.
const headingFont = new URL(headingFontUrl, 'https://quiznote.app').pathname

const c = useSiteContent()

// Taal van de pagina en de verwijzingen naar de andere taal (hreflang, canonical) voor zoekmachines.
const i18nHead = useLocaleHead()
// og:locale moet taal_LAND zijn; het Engels heet in i18n alleen 'en' (zo blijft hreflang voor alle Engelstaligen).
const ogLocale = (value: string | number) => (value === 'en' ? 'en_GB' : value)
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang },
  link: [
    { key: 'heading-font', rel: 'preload', as: 'font', type: 'font/woff2', href: headingFont, crossorigin: '' },
    ...(i18nHead.value.link ?? [])
  ],
  meta: (i18nHead.value.meta ?? []).map((m) =>
    String(m.property ?? '').startsWith('og:locale') ? { ...m, content: ogLocale(m.content) } : m
  )
}))
</script>

<template>
  <a class="skip button primary" href="#inhoud">{{ c.skip }}</a>
  <SiteHeader />
  <main id="inhoud">
    <slot />
  </main>
  <SiteFooter />
</template>
