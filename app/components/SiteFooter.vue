<script setup lang="ts">
const c = useSiteContent()
</script>

<template>
  <footer class="site-footer">
    <div class="wrap row">
      <img
        src="/brand/quizmeister-lockup-donker.svg"
        alt="Quizmeister"
        width="1377"
        height="324"
        loading="lazy"
      />
      <p>{{ c.footer.madeBy }}</p>
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
