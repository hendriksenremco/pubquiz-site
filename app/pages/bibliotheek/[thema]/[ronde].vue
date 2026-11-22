<script setup lang="ts">
import {
  themes,
  findRound,
  libraryText as t,
  roundSummary,
  roundFileUrl,
  roundAppLink
} from '~/content/bibliotheek'

// Alleen in het Nederlands, tot er Engelse rondes zijn (dan /en/library).
defineI18nRoute({ locales: ['nl'] })

const route = useRoute()
const found = findRound(String(route.params.thema), String(route.params.ronde))
if (!found)
  throw createError({ statusCode: 404, statusMessage: 'Ronde niet gevonden', fatal: true })
const { theme, round } = found

const config = useRuntimeConfig()
const site = config.public.siteUrl
const url = `${site}/bibliotheek/${theme.slug}/${round.slug}`
const file = roundFileUrl(site, theme.slug, round.slug)
const appLink = roundAppLink(site, theme.slug, round.slug)
// De downloadknop wijst naar hetzelfde bestand, maar relatief: zo werkt hij ook lokaal.
const download = `/bibliotheek/${theme.slug}/${round.slug}.quiznoteronde`

// Bijvoorbeeld "Pubquizronde Hoofdsteden van Europa: 10 vragen, makkelijk".
const title = `Pubquizronde ${round.title}: ${roundSummary(round)}`

useSeoMeta({
  title: `${title} · QuizNote`,
  description: round.description,
  ogTitle: title,
  ogDescription: round.description,
  ogUrl: url,
  ogType: 'website',
  ogSiteName: 'QuizNote',
  ogImage: `${site}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CreativeWork',
            name: round.title,
            description: round.description,
            url,
            inLanguage: 'nl-NL',
            genre: 'Pubquiz',
            about: theme.name,
            isAccessibleForFree: true,
            encoding: {
              '@type': 'MediaObject',
              contentUrl: file,
              encodingFormat: 'application/zip'
            },
            isPartOf: { '@type': 'CollectionPage', name: t.title, url: `${site}/bibliotheek` },
            publisher: { '@type': 'Organization', name: 'QuizNote', url: `${site}/` }
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: t.eyebrow, item: `${site}/bibliotheek` },
              {
                '@type': 'ListItem',
                position: 2,
                name: theme.name,
                item: `${site}/bibliotheek#${theme.slug}`
              },
              { '@type': 'ListItem', position: 3, name: round.title, item: url }
            ]
          }
        ]
      })
    }
  ]
})

// Eerst de andere rondes in dit thema, dan een paar uit andere thema's.
const sameTheme = theme.rounds.filter((r) => r.slug !== round.slug)
const others = themes
  .filter((th) => th.slug !== theme.slug)
  .flatMap((th) => th.rounds.slice(0, 1).map((r) => ({ theme: th, round: r })))
  .slice(0, 6)
</script>

<template>
  <article class="round-page wrap">
    <nav class="crumbs" aria-label="Kruimelpad">
      <NuxtLink to="/bibliotheek">{{ t.eyebrow }}</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="`/bibliotheek#${theme.slug}`">{{ theme.name }}</NuxtLink>
    </nav>

    <h1>{{ round.title }}</h1>
    <ul class="facts">
      <li class="chip">{{ theme.name }}</li>
      <li class="chip">{{ t.questions(round.questionCount) }}</li>
      <li class="chip">{{ round.difficulty }}</li>
    </ul>
    <p class="lead">{{ round.description }}</p>

    <div class="actions">
      <a class="button primary" :href="appLink">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3M11 4h5v5M16 4l-7 7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ t.open }}
      </a>
      <a class="button" :href="download" download>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M10 3v9M6 8.5l4 4 4-4M4 16h12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ t.download }}
      </a>
    </div>
    <p class="needs">
      {{ t.needsApp }}
      <NuxtLink to="/#download">{{ t.getApp }}</NuxtLink>
    </p>

    <section v-if="sameTheme.length" class="more">
      <h2>{{ t.more(theme.name) }}</h2>
      <ul>
        <li v-for="r in sameTheme" :key="r.slug">
          <NuxtLink :to="`/bibliotheek/${theme.slug}/${r.slug}`" class="round">
            <span class="round-title">{{ r.title }}</span>
            <span class="round-meta">{{ roundSummary(r) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-if="others.length" class="more">
      <h2>{{ t.other }}</h2>
      <ul>
        <li v-for="o in others" :key="`${o.theme.slug}/${o.round.slug}`">
          <NuxtLink :to="`/bibliotheek/${o.theme.slug}/${o.round.slug}`" class="round">
            <span class="round-title">{{ o.round.title }}</span>
            <span class="round-meta">{{ o.theme.name }} · {{ roundSummary(o.round) }}</span>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink to="/bibliotheek" class="all">{{ t.back }}</NuxtLink>
    </section>
  </article>
</template>

<style scoped>
.round-page {
  max-width: 820px;
  padding-block: 48px 24px;
}

.crumbs {
  display: flex;
  gap: 8px;
  color: var(--faint);
  font-size: 0.92rem;
  margin-bottom: 18px;
}

.crumbs a {
  color: var(--muted);
  text-decoration: none;
}

.crumbs a:hover {
  color: var(--text);
}

h1 {
  font-size: clamp(2.3rem, 5.5vw, 3.6rem);
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 20px 0;
  padding: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.needs {
  margin-top: 16px;
  color: var(--muted);
  font-size: 0.95rem;
}

.needs a,
.all {
  color: var(--accent);
}

.more {
  margin-top: 56px;
}

.more h2 {
  font-size: 1.4rem;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
}

.more ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.round {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 16px;
  border-radius: var(--radius);
  background: var(--surface-1);
  text-decoration: none;
  transition: background 0.15s ease;
}

.round:hover {
  background: var(--surface-2);
}

.round-title {
  font-weight: 650;
}

.round-meta {
  color: var(--muted);
  font-size: 0.88rem;
}

.all {
  display: inline-block;
  margin-top: 16px;
}
</style>
