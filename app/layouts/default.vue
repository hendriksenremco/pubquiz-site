<script setup lang="ts">
const c = useSiteContent()

// Taal van de pagina en de verwijzingen naar de andere taal (hreflang, canonical) voor zoekmachines.
const i18nHead = useLocaleHead()
// og:locale moet taal_LAND zijn; het Engels heet in i18n alleen 'en' (zo blijft hreflang voor alle Engelstaligen).
const ogLocale = (value: string | number) => (value === 'en' ? 'en_GB' : value)
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang },
  link: [...(i18nHead.value.link ?? [])],
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
