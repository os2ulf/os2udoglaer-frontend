<script setup lang="ts">
import { useSettingsDataStore } from '~/stores/settingsData';
const settingsDataStore = useSettingsDataStore();

if (settingsDataStore.settingsData === null) {
  settingsDataStore.getSettingsData();
}

const fontFamily = computed(() => settingsDataStore.settingsData?.font);
const primaryBgColor = computed(() => settingsDataStore.settingsData?.primary_background_color);
const primaryBgTextColor = computed(() => settingsDataStore.settingsData?.primary_background_text_color);
const secondaryBgColor = computed(() => settingsDataStore.settingsData?.secondary_background_color);
const secondaryBgTextColor = computed(() => settingsDataStore.settingsData?.secondary_background_text_color);

let primaryColor = '#297F78';
let primaryTextColor = '#fff';
let secondaryColor = '#FBD800';
let secondaryTextColor = '#000';

if (fontFamily.value) {
  const fontValue = fontFamily.value;
  const fontUrl = '../assets/css/_font-' + fontValue.toLowerCase().replace(' ', '-') + '.css';

  const cssId = fontValue.replace(' ', '+') + 'Font';  // you could encode the css path itself to generate id..
  if (!document.getElementById(cssId)) {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = fontUrl;
    link.media = 'all';
    head.appendChild(link);
  }

  if (fontValue === 'Roboto') {
    document.documentElement.style.setProperty("--body-font-family", "'Roboto Slab', sans-serif");
    document.documentElement.style.setProperty("--heading-font-family", "'Roboto', sans-serif");
  } else {
    document.documentElement.style.setProperty("--body-font-family", "'" + fontValue + "', sans-serif");
    document.documentElement.style.setProperty("--heading-font-family", "'" + fontValue + "', sans-serif");
  }
}

onMounted(() => {
  if (primaryBgColor.value) {
    primaryColor = primaryBgColor.value;
  }

  if (primaryBgTextColor.value) {
    primaryTextColor = primaryBgTextColor.value;
  }

  if (secondaryBgColor.value) {
    secondaryColor = secondaryBgColor.value;
  }

  if (secondaryBgTextColor.value) {
    secondaryTextColor = secondaryBgTextColor.value;
  }

  document.documentElement.style.setProperty("--color-primary", primaryColor);
  document.documentElement.style.setProperty("--color-primary-text", primaryTextColor);
  document.documentElement.style.setProperty("--color-secondary", secondaryColor);
  document.documentElement.style.setProperty("--color-secondary-text", secondaryTextColor);
});

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Page transition when routing */
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
