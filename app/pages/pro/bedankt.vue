<script setup lang="ts">
// Na het betalen stuurt Stripe de koper hierheen, met het id van de Checkout-sessie. De pagina
// haalt bij de licentieserver de code op en laat hem zien. Niet in Google.
defineI18nRoute({ locales: ['nl'] })
useSeoMeta({ title: 'Bedankt · QuizNote Pro', robots: 'noindex' })

const key = ref<string | null>(null)
const problem = ref<string | null>(null)
const copied = ref(false)

onMounted(async () => {
  const sessionId = new URLSearchParams(location.search).get('session_id')
  if (!sessionId) {
    problem.value = 'Er ging iets mis: deze pagina weet niet bij welke betaling hij hoort.'
    return
  }
  // De betaling kan net een paar tellen nodig hebben; probeer het dus een paar keer.
  for (let attempt = 0; attempt < 5 && !key.value; attempt++) {
    const response = await fetch(`/api/key?session_id=${encodeURIComponent(sessionId)}`).catch(
      () => null
    )
    if (response?.ok) key.value = ((await response.json()) as { key: string }).key
    else await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  if (!key.value) {
    problem.value =
      'Je code is nog niet klaar. Laad deze pagina over een minuut opnieuw, of mail remco@quiznote.app.'
  }
})

async function copy() {
  if (!key.value) return
  await navigator.clipboard.writeText(key.value)
  copied.value = true
}
</script>

<template>
  <div class="thanks wrap">
    <p class="eyebrow">QuizNote Pro</p>
    <h1>Bedankt</h1>
    <p class="lead">
      Dit is je licentiecode. Bewaar hem goed, bijvoorbeeld in je wachtwoordbeheerder.
    </p>

    <div v-if="key" class="key">
      <code>{{ key }}</code>
      <button class="button primary" type="button" @click="copy">
        {{ copied ? 'Gekopieerd' : 'Kopieer code' }}
      </button>
    </div>
    <p v-else-if="problem" class="problem">{{ problem }}</p>
    <p v-else class="muted">Je code wordt opgehaald…</p>

    <ol class="steps">
      <li>Open QuizNote en kies Instellingen (⌘,).</li>
      <li>Plak de code bij QuizNote Pro en klik op Zet Pro aan.</li>
      <li>Klaar. Je kunt de code op drie Macs gebruiken.</li>
    </ol>
  </div>
</template>

<style scoped>
.thanks {
  max-width: 720px;
  padding-block: 64px 24px;
}

h1 {
  margin: 10px 0 18px;
}

.key {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 28px 0;
  padding: 18px 20px;
  border-radius: var(--radius-lg);
  background: var(--surface-2);
}

code {
  flex: 1 1 260px;
  font-size: 1.05rem;
  overflow-wrap: anywhere;
}

.problem {
  margin: 28px 0;
  color: var(--accent);
}

.muted {
  margin: 28px 0;
  color: var(--muted);
}

.steps {
  display: grid;
  gap: 8px;
  padding-left: 20px;
  color: var(--muted);
}
</style>
