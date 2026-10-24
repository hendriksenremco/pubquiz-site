<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const c = useSiteContent()
</script>

<template>
  <nav class="lang" :aria-label="c.nav.language">
    <NuxtLink
      v-for="l in locales"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      :lang="l.language"
      :hreflang="l.language"
      :title="l.name"
      :aria-current="l.code === locale ? 'page' : undefined"
    >
      {{ l.code.toUpperCase() }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.lang {
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: var(--surface-2);
}

.lang a {
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 650;
  text-decoration: none;
  color: var(--muted);
}

.lang a:hover {
  color: var(--text);
}

.lang a[aria-current] {
  background: var(--surface-4);
  color: var(--text);
}
</style>
