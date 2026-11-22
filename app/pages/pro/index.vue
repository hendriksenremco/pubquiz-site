<script setup lang="ts">
// QuizNote Pro (issue #384 in de app-repo): de prijzen en de koopknoppen. De knoppen gaan naar de
// licentieserver (functions/), die een Checkout-sessie van Stripe maakt. Alleen Nederlands, net
// als de bibliotheek; Engels komt later.
defineI18nRoute({ locales: ['nl'] })

const config = useRuntimeConfig()
const site = config.public.siteUrl

const title = 'QuizNote Pro · meer schermen, plug-ins en je AI'
const description =
  'QuizNote is gratis. Met Pro speel je op meer schermen en speakers tegelijk, bedien je de show met je telefoon, houd je de tussenstand bij en maak je quizzen met je AI.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: `${site}/pro`,
  ogType: 'website',
  ogSiteName: 'QuizNote',
  ogImage: `${site}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image'
})

const free = [
  'Rondes en slides, muziek en fragmenten',
  'De show op één beamer of tv',
  'Al het geluid op één set speakers',
  'Sneltoetsen, aftellen en afdrukken',
  'Gratis rondes uit de bibliotheek'
]
const pro = [
  'Alles van Gratis',
  'Meer schermen en speakers tegelijk',
  'De show bedienen met je telefoon',
  'Tussenstand op de beamer',
  'Een quiz maken met je AI',
  'Licht per ronde (MagicHome)'
]
</script>

<template>
  <div class="pro wrap">
    <header class="intro">
      <p class="eyebrow">QuizNote Pro</p>
      <h1>Gratis beginnen, Pro als je meer wilt</h1>
      <p class="lead">
        QuizNote is gratis voor een gewone pubquiz. Pro is voor wie elke week een quiz draait, met
        meer schermen, je telefoon als afstandsbediening en je AI.
      </p>
    </header>

    <div class="plans">
      <section class="plan">
        <h2>Gratis</h2>
        <p class="price">€0</p>
        <ul>
          <li v-for="item in free" :key="item">{{ item }}</li>
        </ul>
        <NuxtLink class="button" to="/#download">Download voor Mac</NuxtLink>
      </section>

      <section class="plan featured">
        <h2>Pro</h2>
        <p class="price">€6,99 <span>per maand</span></p>
        <p class="alt">of €59 per jaar (bijna twee maanden gratis)</p>
        <ul>
          <li v-for="item in pro" :key="item">{{ item }}</li>
        </ul>
        <div class="buttons">
          <a class="button primary" href="/api/checkout?plan=month" rel="nofollow"
            >Koop Pro per maand</a
          >
          <a class="button" href="/api/checkout?plan=year" rel="nofollow">Koop Pro per jaar</a>
        </div>
      </section>
    </div>

    <section class="notes">
      <h2>Goed om te weten</h2>
      <ul>
        <li>Je krijgt na het betalen een licentiecode. Die zet je in QuizNote bij Instellingen.</li>
        <li>Eén code werkt op drie Macs. Haal je hem van een Mac af, dan kan hij op een andere.</li>
        <li>Na het aanzetten werkt Pro ook zonder internet, tot 30 dagen.</li>
        <li>Opzeggen kan altijd; Pro loopt dan door tot het einde van je periode.</li>
        <li>De betaling loopt via Stripe. Die regelt ook de btw.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.pro {
  padding-block: 64px 24px;
}

.intro {
  max-width: 44rem;
  margin-bottom: 40px;
}

.intro h1 {
  margin: 10px 0 18px;
}

.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 16px;
  max-width: 820px;
}

.plan {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  border-radius: var(--radius-lg);
  background: var(--surface-1);
}

.plan.featured {
  background: var(--surface-2);
}

.plan h2 {
  font-size: 1.5rem;
}

.price {
  font-family: var(--display);
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}

.price span {
  font-family: var(--font);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0;
  color: var(--muted);
}

.alt {
  color: var(--muted);
  font-size: 0.95rem;
}

.plan ul,
.notes ul {
  display: grid;
  gap: 8px;
  margin: 8px 0 12px;
  padding-left: 20px;
  color: var(--muted);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
}

.plan > .button {
  align-self: flex-start;
  margin-top: auto;
}

.notes {
  max-width: 44rem;
  margin-top: 56px;
}

.notes h2 {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}
</style>
