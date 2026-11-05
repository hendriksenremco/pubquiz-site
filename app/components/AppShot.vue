<script setup lang="ts">
// Een screenshot van de app, of het beeld op de beamer, in een rustig kader.
// Naast elk beeld in public/screens staat een kleinere versie (`-sm.webp`, half zo breed),
// zodat telefoons niet het grote bestand hoeven te laden.
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    kind?: 'window' | 'beamer'
    label?: string
    eager?: boolean
    // Het belangrijkste beeld bovenaan de pagina: eerst laden.
    priority?: boolean
    sizes?: string
  }>(),
  { kind: 'window', label: undefined, eager: false, priority: false, sizes: undefined }
)

const width = computed(() => (props.kind === 'beamer' ? 1200 : 1600))
const height = computed(() => (props.kind === 'beamer' ? 635 : 1000))

const srcset = computed(() => {
  if (!props.src.endsWith('.webp')) return undefined
  const small = props.src.replace(/\.webp$/, '-sm.webp')
  return `${small} ${width.value / 2}w, ${props.src} ${width.value}w`
})

// Standaard: een beeld in een kolom naast de tekst (7 van de 12 delen van de pagina),
// of een beamerbeeld dat half over het laptopbeeld valt.
const sizesAttr = computed(
  () =>
    props.sizes ??
    (props.kind === 'beamer'
      ? '(max-width: 900px) 48vw, 460px'
      : '(max-width: 900px) calc(100vw - 40px), 680px')
)
</script>

<template>
  <figure class="shot" :class="kind">
    <img
      :src="src"
      :srcset="srcset"
      :sizes="srcset ? sizesAttr : undefined"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager || priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
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
