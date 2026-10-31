<script setup lang="ts">
const c = useSiteContent()
const localePath = useLocalePath()

// Geen menu achter een knop: op een smal scherm staat de navigatie als tweede rij onder de balk.
const links = computed(() => [
  { href: '#ai', label: c.value.nav.ai },
  { href: '#rounds', label: c.value.nav.rounds },
  { href: '#show', label: c.value.nav.show },
  { href: '#print', label: c.value.nav.print },
  { href: '#download', label: c.value.nav.download }
])
</script>

<template>
  <header class="site-header">
    <div class="wrap bar">
      <NuxtLink :to="localePath('/')" class="brand">
        <img
          src="/brand/quiznote-lockup-donker.svg"
          alt="QuizNote"
          width="1175"
          height="324"
        />
      </NuxtLink>
      <nav class="links" aria-label="QuizNote">
        <a v-for="l in links" :key="l.href" :href="localePath('/') + l.href">{{ l.label }}</a>
      </nav>
      <div class="actions">
        <LangSwitch />
        <a class="button primary" :href="localePath('/') + '#download'">
          <span class="long">{{ c.cta.download }}</span>
          <span class="short">{{ c.cta.downloadShort }}</span>
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(15, 20, 32, 0.86);
  backdrop-filter: saturate(140%) blur(14px);
  -webkit-backdrop-filter: saturate(140%) blur(14px);
  border-bottom: 1px solid var(--line);
}

.bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'brand links actions';
  align-items: center;
  gap: 12px 28px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.brand {
  grid-area: brand;
  display: block;
}

.brand img {
  height: 34px;
  width: auto;
}

.links {
  grid-area: links;
  display: flex;
  gap: 4px;
}

.links a {
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.95rem;
  white-space: nowrap;
}

.links a:hover {
  color: var(--text);
  background: var(--surface-2);
}

.actions {
  grid-area: actions;
  display: flex;
  align-items: center;
  gap: 12px;
}

.actions .button {
  padding: 9px 18px;
  font-size: 0.95rem;
  white-space: nowrap;
}

.short {
  display: none;
}

@media (max-width: 1120px) {
  .bar {
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'brand actions'
      'links links';
    padding-bottom: 8px;
  }

  .actions {
    justify-self: end;
  }

  .links {
    overflow-x: auto;
    margin: 0 -12px;
    scrollbar-width: none;
  }
}

@media (max-width: 480px) {
  .brand img {
    height: 28px;
  }

  .actions .button {
    padding: 8px 14px;
    font-size: 0.88rem;
  }

  .long {
    display: none;
  }

  .short {
    display: inline;
  }
}
</style>
