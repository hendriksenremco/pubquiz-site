<script setup lang="ts">
import release from '~/content/release.json'
const c = useSiteContent()
const config = useRuntimeConfig()
const localePath = useLocalePath()
const { locale } = useI18n()

useSeoMeta({
  title: () => c.value.meta.title,
  description: () => c.value.meta.description,
  ogTitle: () => c.value.meta.title,
  ogDescription: () => c.value.meta.description,
  ogType: 'website',
  ogSiteName: 'QuizNote',
  ogImage: `${config.public.siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image'
})

// Gestructureerde gegevens voor Google: wat QuizNote is, en de naam van de site (WebSite),
// zodat Google "QuizNote" als sitenaam toont. Geen prijs: die is nog niet besloten.
useHead(() => {
  const site = config.public.siteUrl
  const pageUrl = locale.value === 'en' ? `${site}/en` : `${site}/`
  const inLanguage = locale.value === 'en' ? 'en' : 'nl-NL'
  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${site}/#website`,
              name: 'QuizNote',
              alternateName: 'quiznote.app',
              url: `${site}/`,
              inLanguage: ['nl-NL', 'en']
            },
            {
              '@type': 'SoftwareApplication',
              '@id': `${site}/#app`,
              name: 'QuizNote',
              applicationCategory: 'EntertainmentApplication',
              operatingSystem: 'macOS',
              softwareVersion: release.version,
              description: c.value.meta.description,
              url: pageUrl,
              inLanguage,
              image: `${site}/og-image.png`,
              ...(config.public.downloadUrl ? { downloadUrl: config.public.downloadUrl } : {}),
              author: { '@type': 'Person', name: 'Remco Hendriksen' }
            }
          ]
        })
      }
    ]
  }
})
</script>

<template>
  <div>
    <!-- Openingsbeeld -->
    <section class="hero wrap">
      <div class="hero-text">
        <h1>{{ c.hero.title }}</h1>
        <p class="lead">{{ c.hero.lead }}</p>
        <div class="hero-actions">
          <a class="button primary" href="#download">{{ c.cta.download }}</a>
          <p class="facts">{{ c.hero.facts.join(' · ') }}</p>
        </div>
      </div>
      <div class="hero-shots">
        <AppShot
          :src="c.hero.laptop.src"
          :alt="c.hero.laptop.alt"
          priority
          sizes="(max-width: 1200px) calc(100vw - 40px), 1160px"
        />
        <AppShot
          class="hero-beamer"
          kind="beamer"
          :src="c.hero.beamer.src"
          :alt="c.hero.beamer.alt"
          :label="c.hero.beamerLabel"
          eager
        />
      </div>
    </section>

    <!-- Met je AI -->
    <section id="ai" class="ai wrap" aria-labelledby="ai-title">
      <div class="feature">
        <div class="feature-text">
          <h2 id="ai-title">{{ c.ai.title }}</h2>
          <p class="prompt">{{ c.ai.prompt }}</p>
        </div>
        <div class="feature-shots">
          <AppShot :src="c.ai.shot.src" :alt="c.ai.shot.alt" />
        </div>
      </div>
    </section>

    <!-- Rondes -->
    <section id="rounds" class="rounds wrap" aria-labelledby="rounds-title">
      <h2 id="rounds-title">{{ c.rounds.title }}</h2>
      <div class="round-grid">
        <figure v-for="round in c.rounds.items" :key="round.title" class="round">
          <AppShot
            :src="round.shot.src"
            :alt="round.shot.alt"
            sizes="(max-width: 900px) calc(100vw - 40px), 570px"
          />
          <figcaption>
            <h3>{{ round.title }}</h3>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Tijdens de show -->
    <section id="show" class="show" aria-labelledby="show-title">
      <div class="wrap show-inner">
        <div class="show-text">
          <h2 id="show-title">{{ c.show.title }}</h2>
          <p class="lead">{{ c.show.lead }}</p>
        </div>
        <dl class="keys">
          <div v-for="k in c.show.keys" :key="k.label" class="key-row">
            <dt>
              <kbd v-for="key in k.keys" :key="key" class="key">{{ key }}</kbd>
            </dt>
            <dd>{{ k.label }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Afdrukken -->
    <section id="print" class="print wrap" aria-labelledby="print-title">
      <div class="feature">
        <div class="feature-text">
          <h2 id="print-title">{{ c.print.title }}</h2>
          <dl class="forms">
            <div v-for="item in c.print.items" :key="item.title">
              <dt>{{ item.title }}</dt>
            </div>
          </dl>
        </div>
        <div class="feature-shots">
          <AppShot :src="c.print.shot.src" :alt="c.print.shot.alt" />
        </div>
      </div>
    </section>

    <!-- Download -->
    <section id="download" class="download wrap" aria-labelledby="download-title">
      <div class="download-panel">
        <div class="download-main">
          <h2 id="download-title">{{ c.download.title }}</h2>
          <p class="lead">{{ c.download.lead }}</p>
          <a
            v-if="config.public.downloadUrl"
            class="button primary"
            :href="config.public.downloadUrl"
            @click="$track('download_clicked', { locale })"
          >
            {{ c.download.button }}
          </a>
          <p v-else class="pending">{{ c.download.pending }}</p>
          <p class="terms">
            {{ c.download.terms }}
            <NuxtLink :to="localePath('/voorwaarden')">{{ c.download.termsLink }}</NuxtLink>.
          </p>
        </div>
        <div class="install">
          <h3>{{ c.download.installTitle }}</h3>
          <ol>
            <li v-for="line in c.download.install" :key="line">{{ line }}</li>
          </ol>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
section {
  padding-block: clamp(56px, 9vw, 112px) 0;
}

/* Openingsbeeld */
.hero {
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 6vw, 72px);
  padding-top: clamp(48px, 8vw, 96px);
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 50rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 6px;
}

.facts {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.hero-shots {
  position: relative;
  padding-bottom: clamp(40px, 8vw, 90px);
}

.hero-beamer {
  position: absolute;
  right: clamp(-8px, -1vw, 0px);
  bottom: 0;
  width: clamp(180px, 38%, 460px);
}

/* Met je AI: de vraag aan de AI als tekstballon */
.feature-text > .prompt {
  align-self: flex-start;
  color: var(--text);
  margin: 6px 0;
  padding: 16px 20px;
  border-radius: 20px 20px 20px 6px;
  background: var(--surface-3);
  font-family: var(--display);
  font-size: 1.2rem;
  font-weight: 650;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

/* Rondes en afdrukken: tekst naast een screenshot */
.rounds {
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4vw, 44px);
}

.round-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(36px, 5vw, 56px) clamp(20px, 3vw, 32px);
}

.round {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
}

.round figcaption {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.round h3 {
  font-size: 1.25rem;
  font-weight: 750;
  letter-spacing: -0.015em;
}

.round p {
  color: var(--muted);
}

.feature {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-text > p:not(.prompt) {
  color: var(--muted);
  font-size: 1.15rem;
}

.feature-text h3 {
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
}

.feature-shots {
  position: relative;
}

/* Tijdens de show */
.show {
  margin-top: clamp(56px, 9vw, 112px);
  padding-block: clamp(56px, 8vw, 96px);
  background: var(--surface-1);
}

.show-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
}

.show-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.keys {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 32px;
  margin: 0;
}

.key-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.key-row dt {
  display: flex;
  gap: 6px;
  flex: none;
  min-width: 5.5rem;
}

.key-row dd {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.2em;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--surface-4);
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.35);
  color: var(--text);
  font-weight: 650;
  font-size: 0.92rem;
  white-space: nowrap;
}

/* Afdrukken */
.print {
  padding-bottom: 0;
}

.forms {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 8px 0 0;
}

.forms dt {
  font-weight: 700;
}

.forms dd {
  margin: 0;
  color: var(--muted);
}

/* Download */
.download {
  padding-bottom: clamp(56px, 8vw, 96px);
}

.download-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 64px);
}

.download-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.terms {
  margin-top: 14px;
  color: var(--muted);
  font-size: 0.95rem;
}

.terms a {
  color: var(--text);
}

.pending {
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--accent-soft);
  color: var(--text);
}

.install {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.install ol {
  margin: 0;
  padding-left: 1.4em;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--muted);
}

.install li::marker {
  color: var(--accent);
  font-family: var(--display);
  font-weight: 800;
}

@media (max-width: 900px) {
  .round-grid,
  .show-inner,
  .download-panel,
  .feature {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .keys {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-beamer {
    width: 48%;
  }
}
</style>
