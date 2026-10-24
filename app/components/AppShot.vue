<script setup lang="ts">
// Een screenshot van de app, of het beeld op de beamer, in een rustig kader.
withDefaults(
  defineProps<{
    src: string
    alt: string
    kind?: 'window' | 'beamer'
    label?: string
    eager?: boolean
  }>(),
  { kind: 'window', label: undefined, eager: false }
)
</script>

<template>
  <figure class="shot" :class="kind">
    <img
      :src="src"
      :alt="alt"
      :width="kind === 'beamer' ? 1200 : 1600"
      :height="kind === 'beamer' ? 635 : 1000"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
    />
    <figcaption v-if="label">{{ label }}</figcaption>
  </figure>
</template>

<style scoped>
.shot {
  position: relative;
  margin: 0;
}

.shot img {
  width: 100%;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-strong);
  background: var(--surface-1);
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.7);
}

.beamer img {
  border-radius: var(--radius);
  border: 6px solid #05070c;
  background: #000;
}

figcaption {
  position: absolute;
  left: 14px;
  top: -14px;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.8rem;
  font-weight: 700;
}
</style>
