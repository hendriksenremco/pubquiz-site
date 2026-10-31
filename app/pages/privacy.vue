<script setup lang="ts">
import { privacy, type PrivacyContent } from '~/content/privacy'
import type { Locale } from '~/content/site'

const { locale } = useI18n()
const p = computed<PrivacyContent>(() => privacy[locale.value as Locale])

useSeoMeta({
  title: () => `${p.value.title} · QuizNote`,
  description: () => p.value.description
})
</script>

<template>
  <article class="privacy wrap">
    <h1>{{ p.title }}</h1>
    <p class="updated">{{ p.updated }}</p>
    <section v-for="s in p.sections" :key="s.title">
      <h2>{{ s.title }}</h2>
      <p v-for="(para, i) in s.paragraphs" :key="i">{{ para }}</p>
    </section>
  </article>
</template>

<style scoped>
.privacy {
  max-width: 720px;
  padding-block: 64px 24px;
}

h1 {
  font-size: clamp(2rem, 5vw, 2.8rem);
  margin-bottom: 8px;
}

.updated {
  color: var(--muted);
  margin-bottom: 40px;
}

section + section {
  margin-top: 32px;
}

h2 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

p + p {
  margin-top: 10px;
}

section p {
  line-height: 1.6;
}
</style>
