<script setup lang="ts">
import { useSettingsData } from '~/composables/useSettingsData'

const settings = useSettingsData()

await settings.getSettingsData(import.meta.server ? { force: true } : {})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
