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
      <NuxtLink class="privacy" :to="localePath('/privacy')">{{ c.footer.privacy }}</NuxtLink>
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

.privacy {
  color: var(--muted);
  font-size: 0.95rem;
}

.privacy:hover {
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
