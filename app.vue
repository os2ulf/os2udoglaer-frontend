<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsData } from '~/composables/useSettingsData'

const settings = useSettingsData()

await settings.getSettingsData(import.meta.server ? { force: true } : {})

function getImageUrl(value: any): string | null {
  if (!value) return null
  if (typeof value === 'string') return value

  return (
    value.src ??
    value.url ??
    value.uri ??
    value.href ??
    value.img_element?.uri ??
    null
  )
}

function getFaviconType(href: string) {
  const path = href.split('?')[0].toLowerCase()

  if (path.endsWith('.svg')) return 'image/svg+xml'
  if (path.endsWith('.png')) return 'image/png'
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.ico')) return 'image/x-icon'

  return undefined
}

const faviconHref = computed(() => {
  const data = settings.settingsData.value
  return getImageUrl(data?.favicon) ?? '/favicon.ico'
})

useHead(() => ({
  link: [
    {
      key: 'icon',
      rel: 'icon',
      href: faviconHref.value,
      type: getFaviconType(faviconHref.value),
    },
    {
      key: 'shortcut-icon',
      rel: 'shortcut icon',
      href: faviconHref.value,
      type: getFaviconType(faviconHref.value),
    },
  ],
}))
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
