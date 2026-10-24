<script setup lang="ts">
const c = useSiteContent()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => c.value.meta.title,
  description: () => c.value.meta.description,
  ogTitle: () => c.value.meta.title,
  ogDescription: () => c.value.meta.description,
  ogType: 'website',
  ogImage: `${config.public.siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image'
})

// Eenvoudige lijn-iconen voor "Eén laptop, de hele zaal": scherm, speaker, laptop.
const roomIcons = [
  'M4 5h16v11H4zM9 20h6M12 16v4',
  'M7 3h10v18H7zM12 7h.01M12 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'M5 6h14v9H5zM3 18h18'
]
</script>

<template>
  <div>
    <!-- Openingsbeeld -->
    <section class="hero wrap">
      <div class="hero-text">
        <p class="eyebrow">{{ c.hero.eyebrow }}</p>
        <h1>{{ c.hero.title }}</h1>
        <p class="lead">{{ c.hero.lead }}</p>
        <div class="hero-actions">
          <a class="button primary" href="#download">{{ c.cta.download }}</a>
          <a class="button" href="#how">{{ c.cta.how }}</a>
        </div>
        <ul class="facts">
          <li v-for="f in c.hero.facts" :key="f" class="chip">{{ f }}</li>
        </ul>
      </div>
      <div class="hero-shots">
        <AppShot :src="c.hero.laptop.src" :alt="c.hero.laptop.alt" eager />
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

    <!-- Eén laptop, de hele zaal -->
    <section class="room wrap" aria-labelledby="room-title">
      <h2 id="room-title">{{ c.room.title }}</h2>
      <div class="room-grid">
        <article v-for="(item, i) in c.room.items" :key="item.title" class="card">
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path :d="roomIcons[i]" />
          </svg>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <!-- Zo werkt het: drie stappen, in deze volgorde -->
    <section id="how" class="how wrap" aria-labelledby="how-title">
      <p class="eyebrow">{{ c.how.eyebrow }}</p>
      <h2 id="how-title">{{ c.how.title }}</h2>
      <ol class="steps">
        <li v-for="step in c.how.items" :key="step.title">
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <!-- Rondes -->
    <section id="rounds" class="rounds wrap" aria-labelledby="rounds-title">
      <div class="section-head">
        <p class="eyebrow">{{ c.rounds.eyebrow }}</p>
        <h2 id="rounds-title">{{ c.rounds.title }}</h2>
        <p class="lead">{{ c.rounds.lead }}</p>
      </div>
      <article v-for="(round, i) in c.rounds.items" :key="round.title" class="feature" :class="{ flip: i % 2 === 1 }">
        <div class="feature-text">
          <h3>{{ round.title }}</h3>
          <p>{{ round.text }}</p>
        </div>
        <div class="feature-shots">
          <AppShot :src="round.shot.src" :alt="round.shot.alt" />
          <AppShot
            v-if="round.beamer"
            class="feature-beamer"
            kind="beamer"
            :src="round.beamer.src"
            :alt="round.beamer.alt"
            :label="c.hero.beamerLabel"
          />
        </div>
      </article>
    </section>

    <!-- Tijdens de show -->
    <section id="show" class="show" aria-labelledby="show-title">
      <div class="wrap show-inner">
        <div class="show-text">
          <p class="eyebrow">{{ c.show.eyebrow }}</p>
          <h2 id="show-title">{{ c.show.title }}</h2>
          <p class="lead">{{ c.show.lead }}</p>
          <p class="show-extra">{{ c.show.extra }}</p>
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

    <!-- Voorbereiden -->
    <section class="prepare wrap" aria-labelledby="prepare-title">
      <p class="eyebrow">{{ c.prepare.eyebrow }}</p>
      <h2 id="prepare-title">{{ c.prepare.title }}</h2>
      <div class="prepare-grid">
        <article v-for="item in c.prepare.items" :key="item.title" class="card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <!-- Afdrukken -->
    <section class="print wrap" aria-labelledby="print-title">
      <div class="feature">
        <div class="feature-text">
          <p class="eyebrow">{{ c.print.eyebrow }}</p>
          <h2 id="print-title">{{ c.print.title }}</h2>
          <p class="lead">{{ c.print.lead }}</p>
          <dl class="forms">
            <div v-for="item in c.print.items" :key="item.title">
              <dt>{{ item.title }}</dt>
              <dd>{{ item.text }}</dd>
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
          <img
            class="download-icon"
            src="/brand/quizmeister-icoon-vlak.svg"
            alt=""
            width="96"
            height="96"
            loading="lazy"
          />
          <p class="eyebrow">{{ c.download.eyebrow }}</p>
          <h2 id="download-title">{{ c.download.title }}</h2>
          <p class="lead">{{ c.download.lead }}</p>
          <a v-if="config.public.downloadUrl" class="button primary" :href="config.public.downloadUrl">
            {{ c.download.button }}
          </a>
          <p v-else class="pending">{{ c.download.pending }}</p>
        </div>
        <div class="install">
          <h3>{{ c.download.installTitle }}</h3>
          <ol>
            <li v-for="line in c.download.install" :key="line">{{ line }}</li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Vragen: open in beeld, niet achter uitklapknoppen -->
    <section class="faq wrap" aria-labelledby="faq-title">
      <h2 id="faq-title">{{ c.faq.title }}</h2>
      <dl class="faq-grid">
        <div v-for="item in c.faq.items" :key="item.q">
          <dt>{{ item.q }}</dt>
          <dd>{{ item.a }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>

<style scoped>
section {
  padding-block: clamp(56px, 9vw, 112px) 0;
}

.section-head,
.how,
.prepare {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  gap: 12px;
  margin-top: 6px;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.hero-shots {
  position: relative;
  padding-bottom: clamp(40px, 8vw, 90px);
}

.hero-shots::before {
  /* Het licht van de zaal achter het beeld, zoals de gloed achter beelden in de app. */
  content: '';
  position: absolute;
  inset: 10% 5% 0;
  background: radial-gradient(closest-side, rgba(255, 165, 61, 0.16), transparent);
  filter: blur(40px);
  z-index: -1;
}

.hero-beamer {
  position: absolute;
  right: clamp(-8px, -1vw, 0px);
  bottom: 0;
  width: clamp(180px, 38%, 460px);
}

/* Eén laptop, de hele zaal */
.room {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.room-grid,
.prepare-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.prepare-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 26px;
  border-radius: var(--radius-xl);
  background: var(--surface-1);
}

.card p {
  color: var(--muted);
}

.icon {
  width: 34px;
  height: 34px;
  color: var(--accent);
  margin-bottom: 6px;
}

/* Zo werkt het */
.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.steps li {
  counter-increment: step;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 26px;
  border-radius: var(--radius-xl);
  background: var(--surface-1);
}

.steps li::before {
  content: counter(step);
  font-family: var(--display);
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1;
  color: var(--accent);
}

.steps p {
  color: var(--muted);
}

/* Rondes en afdrukken: tekst naast een screenshot */
.rounds {
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 7vw, 96px);
}

.feature {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}

.feature.flip .feature-text {
  order: 2;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-text > p {
  color: var(--muted);
  font-size: 1.08rem;
}

.feature-text h3 {
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
}

.feature-shots {
  position: relative;
}

.feature-shots:has(.feature-beamer) {
  padding-bottom: clamp(32px, 6vw, 64px);
}

/* Het beamerbeeld staat aan de kant van de tekst, zodat het niet over de rand van de pagina valt. */
.feature-beamer {
  position: absolute;
  left: clamp(-24px, -2vw, 0px);
  bottom: 0;
  width: 42%;
}

.flip .feature-beamer {
  left: auto;
  right: clamp(-24px, -2vw, 0px);
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

.show-extra {
  color: var(--text);
  padding-left: 16px;
  border-left: 3px solid var(--accent);
  max-width: 34rem;
}

.keys {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

.key-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background: var(--surface-2);
}

.key-row dt {
  display: flex;
  gap: 6px;
  flex: none;
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
.forms {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 8px 0 0;
}

.forms dt {
  font-weight: 700;
}

.forms dd {
  margin: 2px 0 0;
  color: var(--muted);
}

/* Download */
.download-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(28px, 5vw, 64px);
  padding: clamp(28px, 5vw, 56px);
  border-radius: 28px;
  background: var(--surface-2);
}

.download-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.download-icon {
  width: 88px;
  height: 88px;
  margin-bottom: 6px;
}

.pending {
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--accent-soft);
  color: var(--text);
  max-width: 30rem;
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

/* Vragen */
.faq {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: clamp(56px, 8vw, 96px);
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 40px;
  margin: 0;
}

.faq-grid dt {
  font-family: var(--display);
  font-size: 1.2rem;
  font-weight: 750;
}

.faq-grid dd {
  margin: 6px 0 0;
  color: var(--muted);
}

@media (max-width: 900px) {
  .room-grid,
  .steps,
  .show-inner,
  .download-panel {
    grid-template-columns: minmax(0, 1fr);
  }

  .feature {
    grid-template-columns: minmax(0, 1fr);
  }

  .feature.flip .feature-text {
    order: 0;
  }
}

@media (max-width: 640px) {
  .prepare-grid,
  .keys,
  .faq-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-beamer {
    width: 48%;
  }
}
</style>
