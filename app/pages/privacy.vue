<script setup lang="ts">
import { privacy } from '~/content/privacy'
import type { Locale } from '~/content/site'

const { locale } = useI18n()
const content = computed(() => privacy[locale.value as Locale])
</script>

<template>
  <LegalPage :content="content" />
</template>
