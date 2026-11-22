<script setup lang="ts">
import { themes, libraryText as t, roundSummary } from '~/content/bibliotheek'

// Alleen in het Nederlands, tot er Engelse rondes zijn (dan /en/library).
defineI18nRoute({ locales: ['nl'] })

const config = useRuntimeConfig()
const site = config.public.siteUrl
const url = `${site}/bibliotheek`

useSeoMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  ogTitle: t.metaTitle,
  ogDescription: t.metaDescription,
  ogUrl: url,
  ogType: 'website',
  ogSiteName: 'QuizNote',
  ogImage: `${site}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image'
})

const rounds = themes.flatMap((th) => th.rounds.map((r) => ({ theme: th, round: r })))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t.title,
        description: t.metaDescription,
        url,
        inLanguage: 'nl-NL',
        isPartOf: { '@id': `${site}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: rounds.length,
          itemListElement: rounds.map(({ theme, round }, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: round.title,
            url: `${site}/bibliotheek/${theme.slug}/${round.slug}`
          }))
        }
      })
    }
  ]
})
</script>

<template>
  <div class="library wrap">
    <header class="intro">
      <p class="eyebrow">{{ t.eyebrow }}</p>
      <h1>{{ t.title }}</h1>
      <p class="lead">{{ t.lead }}</p>
    </header>

    <ul class="themes">
      <li v-for="theme in themes" :id="theme.slug" :key="theme.slug" class="theme">
        <h2>{{ theme.name }}</h2>
        <p class="theme-text">{{ theme.description }}</p>
        <ul class="rounds">
          <li v-for="round in theme.rounds" :key="round.slug">
            <NuxtLink :to="`/bibliotheek/${theme.slug}/${round.slug}`" class="round">
              <span class="round-title">{{ round.title }}</span>
              <span class="round-meta">{{ roundSummary(round) }}</span>
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>

    <section class="how">
      <h2>{{ t.howTitle }}</h2>
      <ol>
        <li v-for="step in t.how" :key="step">{{ step }}</li>
      </ol>
      <p class="needs">
        {{ t.needsApp }}
        <NuxtLink to="/#download">{{ t.getApp }}</NuxtLink>
      </p>
    </section>
  </div>
</template>

<style scoped>
.library {
  padding-block: 64px 24px;
}

.intro {
  max-width: 44rem;
  margin-bottom: 48px;
}

.intro h1 {
  margin: 10px 0 18px;
}

.themes,
.rounds,
.how ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

.themes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 16px;
}

.theme {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--surface-1);
}

.theme h2 {
  font-size: 1.45rem;
  letter-spacing: -0.02em;
}

.theme-text {
  color: var(--muted);
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.rounds {
  display: grid;
  gap: 8px;
  margin-top: auto;
}

.round {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: var(--radius);
  background: var(--surface-2);
  text-decoration: none;
  transition: background 0.15s ease;
}

.round:hover {
  background: var(--surface-3);
}

.round-title {
  font-weight: 650;
}

.round-meta {
  color: var(--muted);
  font-size: 0.88rem;
}

.how {
  max-width: 44rem;
  margin-top: 64px;
}

.how h2 {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  margin-bottom: 18px;
}

.how ol {
  counter-reset: step;
  display: grid;
  gap: 12px;
}

.how li {
  counter-increment: step;
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 12px;
  color: var(--muted);
}

.how li::before {
  content: counter(step);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 700;
  font-size: 0.9rem;
}

.needs {
  margin-top: 24px;
  color: var(--muted);
  font-size: 0.95rem;
}

.needs a {
  color: var(--accent);
}
</style>
