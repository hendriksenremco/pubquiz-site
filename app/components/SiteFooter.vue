<script setup lang="ts">
const c = useSiteContent()
const localePath = useLocalePath()
</script>

<template>
  <footer class="site-footer">
    <div class="wrap row">
      <img
        src="/brand/quiznote-lockup-donker.svg"
        alt="QuizNote"
        width="1175"
        height="324"
        loading="lazy"
      />
      <p>{{ c.footer.madeBy }}</p>
      <nav class="links">
        <a href="mailto:remco@quiznote.app">{{ c.footer.contact }}</a>
        <NuxtLink :to="localePath('/voorwaarden')">{{ c.footer.terms }}</NuxtLink>
        <NuxtLink :to="localePath('/privacy')">{{ c.footer.privacy }}</NuxtLink>
      </nav>
      <LangSwitch />
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 40px;
  padding-block: 40px 56px;
  background: var(--surface-1);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 28px;
}

.links {
  display: flex;
  gap: 20px;
}

.links a {
  color: var(--muted);
  font-size: 0.95rem;
}

.links a:hover {
  color: var(--text);
}

img {
  height: 28px;
  width: auto;
}

p {
  flex: 1 1 260px;
  color: var(--muted);
  font-size: 0.95rem;
}
</style>
