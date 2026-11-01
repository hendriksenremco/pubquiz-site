<script setup lang="ts">
import { voorwaarden } from '~/content/voorwaarden'
import type { Locale } from '~/content/site'

const { locale } = useI18n()
const content = computed(() => voorwaarden[locale.value as Locale])
</script>

<template>
  <LegalPage :content="content" />
</template>
