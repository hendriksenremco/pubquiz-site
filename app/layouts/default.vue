<script setup lang="ts">
const c = useSiteContent()

// Taal van de pagina en de verwijzingen naar de andere taal (hreflang, canonical) voor zoekmachines.
const i18nHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang },
  link: [...(i18nHead.value.link ?? [])],
  meta: [...(i18nHead.value.meta ?? [])]
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
