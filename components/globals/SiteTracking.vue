<script setup lang="ts">
import { useSettingsDataStore } from '~/stores/settingsData';
const settingsDataStore = useSettingsDataStore();

const { useRegion } = useRegionApi();

const { data } = await useAsyncData('settings', () =>
  useRegion('settings').catch((err) => {
    console.error('Failed to fetch settings', err);
  }),
);

if (settingsDataStore.settingsData === null) {
  settingsDataStore.setSettingsData(data.value.settings);
}

const scriptSrcFull = ref(data.value?.settings.site_tracking_script.trim());

const extractScriptSrc = (scriptString: string) => {
  const srcMatch = scriptString.match(/src=['"]?([^'"> ]+)['"]?/i);
  return srcMatch ? srcMatch[1] : '';
};

let scriptSrc = extractScriptSrc(scriptSrcFull.value);

useHead({
  script: [
    {
      src: scriptSrc,
      async: true,
    },
  ],
});
</script>

<template></template>
