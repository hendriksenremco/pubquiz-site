<script setup lang="ts">
import type { PrivacyContent } from '~/content/privacy'

// Een tekstpagina zoals de privacyverklaring en de voorwaarden.
const props = defineProps<{ content: PrivacyContent }>()
const config = useRuntimeConfig()

// Ook hier Open Graph, zodat een gedeelde link een titel en de deelafbeelding krijgt.
useSeoMeta({
  title: () => `${props.content.title} · QuizNote`,
  description: () => props.content.description,
  ogTitle: () => `${props.content.title} · QuizNote`,
  ogDescription: () => props.content.description,
  ogType: 'website',
  ogSiteName: 'QuizNote',
  ogImage: `${config.public.siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <article class="legal wrap">
    <h1>{{ content.title }}</h1>
    <p class="updated">{{ content.updated }}</p>
    <section v-for="s in content.sections" :key="s.title">
      <h2>{{ s.title }}</h2>
      <p v-for="(para, i) in s.paragraphs" :key="i">{{ para }}</p>
    </section>
  </article>
</template>

<style scoped>
.legal {
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
