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
    <!-- Openingsbeeld: een amber vlak met de laptop en de beamer -->
    <section class="hero">
      <div class="wrap hero-text">
        <h1>{{ c.hero.title }}</h1>
        <p class="lead">{{ c.hero.lead }}</p>
        <a class="button dark" href="#download">{{ c.cta.download }}</a>
        <p class="facts">{{ c.hero.facts.join(' · ') }}</p>
      </div>
      <div class="wrap devices">
        <div class="laptop">
          <div class="screen">
            <img
              :src="c.hero.laptop.src"
              :srcset="`${c.hero.laptop.src.replace('.webp', '-sm.webp')} 800w, ${c.hero.laptop.src} 1600w`"
              sizes="(max-width: 900px) 90vw, 760px"
              :alt="c.hero.laptop.alt"
              width="1600"
              height="1000"
              fetchpriority="high"
            />
          </div>
          <div class="base" />
        </div>
        <div class="tv">
          <div class="screen">
            <img
              :src="c.hero.beamer.src"
              :srcset="`${c.hero.beamer.src.replace('.webp', '-sm.webp')} 600w, ${c.hero.beamer.src} 1200w`"
              sizes="(max-width: 900px) 40vw, 380px"
              :alt="c.hero.beamer.alt"
              width="1200"
              height="635"
            />
          </div>
          <div class="foot" />
        </div>
      </div>
    </section>

    <!-- Drie stappen -->
    <section id="steps" class="wrap steps" aria-labelledby="steps-title">
      <h2 id="steps-title">{{ c.steps.title }}</h2>
      <ol class="step-grid">
        <li v-for="(step, i) in c.steps.items" :key="step.title" class="step">
          <span class="n">{{ i + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <!-- Rondes: wat de zaal ziet -->
    <section id="rounds" class="wrap rounds" aria-labelledby="rounds-title">
      <h2 id="rounds-title">{{ c.rounds.title }}</h2>
      <p class="lead section-lead">{{ c.rounds.lead }}</p>
      <div class="bento">
        <figure
          v-for="(round, i) in c.rounds.items"
          :key="round.title"
          class="tile"
          :class="`t${i}`"
        >
          <img
            :src="(round.beamer ?? round.shot).src"
            :alt="(round.beamer ?? round.shot).alt"
            width="1200"
            height="635"
            loading="lazy"
          />
          <figcaption>{{ round.title }}</figcaption>
        </figure>
        <figure id="print" class="tile t4 print">
          <img
            :src="c.print.shot.src"
            :alt="c.print.shot.alt"
            width="1600"
            height="1000"
            loading="lazy"
          />
          <figcaption>{{ c.print.title }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Met je AI -->
    <section id="ai" class="wrap" aria-labelledby="ai-title">
      <div class="band">
        <div class="band-text">
          <h2 id="ai-title">{{ c.ai.title }}</h2>
          <p class="prompt">{{ c.ai.prompt }}</p>
        </div>
        <AppShot :src="c.ai.shot.src" :alt="c.ai.shot.alt" />
      </div>
    </section>

    <!-- Download -->
    <section id="download" class="wrap download" aria-labelledby="download-title">
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
        {{ c.download.install[c.download.install.length - 1] }}
      </p>
    </section>
  </div>
</template>

<style scoped>
section {
  padding-top: clamp(80px, 11vw, 140px);
}

h2 {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.035em;
}

/* Openingsbeeld */
.hero {
  padding-top: clamp(56px, 8vw, 96px);
  background: var(--accent);
  color: var(--accent-ink);
  /* Het onderste deel van de apparaten valt over de rand, op de nachtblauwe pagina. */
  background-image: linear-gradient(var(--accent) 78%, var(--night) 78%);
}

.hero-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 18px;
}

.hero h1 {
  max-width: 14ch;
  font-size: clamp(3rem, 8.5vw, 6.2rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.hero .lead {
  color: var(--accent-ink);
  opacity: 0.8;
}

.button.dark {
  background: var(--accent-ink);
  color: var(--accent);
}

.facts {
  margin: 0;
  font-size: 0.92rem;
  opacity: 0.7;
}

.devices {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(14px, 3vw, 32px);
  margin-top: clamp(40px, 6vw, 64px);
}

.laptop {
  width: min(66%, 760px);
}

.laptop .screen {
  border: clamp(5px, 0.9vw, 10px) solid #232b3e;
  border-bottom-width: clamp(7px, 1vw, 12px);
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: #000;
}

.laptop .base {
  height: clamp(8px, 1.3vw, 16px);
  margin: 0 -5%;
  border-radius: 0 0 14px 14px;
  background: #2c3550;
}

.tv {
  width: min(32%, 380px);
}

.tv .screen {
  border: clamp(4px, 0.6vw, 7px) solid #05070c;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}

.tv .foot {
  width: 22%;
  height: clamp(12px, 2vw, 26px);
  margin: 0 auto;
  background: #2c3550;
  clip-path: polygon(35% 0, 65% 0, 100% 100%, 0 100%);
}

.devices img {
  display: block;
  width: 100%;
  height: auto;
}

/* Drie stappen */
.section-lead {
  max-width: 36rem;
  margin: 14px auto 0;
  text-align: center;
  color: var(--muted);
}

.steps h2,
.rounds h2,
.download h2 {
  text-align: center;
}

.step-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 40px 0 0;
  padding: 0;
  list-style: none;
}

.step {
  padding: 28px;
  border-radius: var(--radius-xl);
  background: var(--surface-2);
}

.step .n {
  font-family: var(--display);
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1;
  color: var(--accent);
}

.step h3 {
  margin-top: 12px;
  font-size: 1.4rem;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.step p {
  margin-top: 4px;
  color: var(--muted);
}

/* Rondes: tegels met wat de zaal ziet */
.bento {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-auto-rows: clamp(150px, 20vw, 250px);
  gap: 16px;
  margin-top: 40px;
}

.tile {
  position: relative;
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: #000;
}

.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tile figcaption {
  position: absolute;
  left: 18px;
  bottom: 14px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--night);
  font-family: var(--display);
  font-size: 1.1rem;
  font-weight: 750;
}

.t2 {
  grid-column: 1;
  grid-row: 1 / span 2;
}

.t0 {
  grid-column: 2 / span 2;
}

.t1 {
  grid-column: 2;
}

.t3 {
  grid-column: 3;
}

.t4 {
  grid-column: 1 / span 3;
  grid-row: span 2;
}

.print img {
  object-position: top;
}

/* Met je AI */
.band {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(28px, 4vw, 48px);
  align-items: center;
  padding: clamp(28px, 4.5vw, 56px);
  border-radius: 28px;
  background: var(--surface-3);
}

.band h2 {
  font-size: clamp(2rem, 4.2vw, 3.2rem);
}

.prompt {
  display: inline-block;
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: 20px 20px 20px 6px;
  background: var(--accent);
  color: var(--accent-ink);
  font-family: var(--display);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.35;
}

/* Download */
.download {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-bottom: clamp(80px, 11vw, 140px);
  text-align: center;
}

.terms {
  color: var(--muted);
  font-size: 0.92rem;
}

.terms a {
  color: var(--text);
}

.pending {
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--accent-soft);
}

@media (max-width: 760px) {
  .step-grid,
  .band {
    grid-template-columns: minmax(0, 1fr);
  }

  .bento {
    grid-template-columns: 1fr 1fr;
  }

  .t0,
  .t1,
  .t2,
  .t3 {
    grid-column: auto;
    grid-row: auto;
  }

  .t4 {
    grid-column: 1 / span 2;
  }
}
</style>
