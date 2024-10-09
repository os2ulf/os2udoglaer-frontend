<script setup lang="ts">
import { useSettingsDataStore } from '~/stores/settingsData';
const settingsDataStore = useSettingsDataStore();
const settingsData = ref(settingsDataStore.settingsData);

if (settingsData.value === null) {
  settingsDataStore.getSettingsData().then(() => {
    settingsData.value = settingsDataStore.settingsData;
  });
}

const data = ref(settingsData.value);
const cookieScript = ref(data.value?.site_cookie_script);
const isCookieScriptLoaded = ref(false);
const siteTrackingScript = ref(data.value?.site_tracking_script);

const injectScript = (scriptString: string, scriptType: string) => {
  const scriptTagRegex = /<script\s+([^>]*)>(.*?)<\/script>/i;
  const attrRegex = /(\w+[-\w]*)=["']([^"']+)["']/g;

  const matches = scriptString.match(scriptTagRegex);
  if (!matches) {
    console.error('GlobalInjections.vue: Invalid script string');
    return;
  }

  const attributesString = matches[1];
  const scriptAttributes = {};

  let match;
  while ((match = attrRegex.exec(attributesString)) !== null) {
    scriptAttributes[match[1]] = match[2];
  }

  const headScript = {
    src: scriptAttributes.src,
    async: scriptAttributes.async === 'true',
    ...(scriptAttributes.id && { id: scriptAttributes.id }),
    ...(scriptAttributes.type && { type: scriptAttributes.type }),
    ...(scriptAttributes['data-*'] && { 'data-*': scriptAttributes['data-*'] }),
  };

  // Inject the script using useHead
  useHead({
    script: [headScript],
  });

  if (scriptType === 'cookie') {
    // Once cookie script is loaded, mark it as loaded
    isCookieScriptLoaded.value = true;
  }
};

watch(isCookieScriptLoaded, () => {
  if (isCookieScriptLoaded.value && siteTrackingScript.value) {
    injectScript(siteTrackingScript.value, 'tracking');
  }
});

onMounted(() => {
  if (cookieScript.value) {
    injectScript(cookieScript.value, 'cookie');
  }
});
</script>

<template></template>
