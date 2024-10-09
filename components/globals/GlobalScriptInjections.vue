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
  const scriptSrcFull = ref(scriptString.trim());
  console.log('scriptSrcFull: ', scriptSrcFull.value);

  const extractScriptSrc = (scriptString: string) => {
    const srcMatch = scriptString.match(/src=['"]?([^'"> ]+)['"]?/i);
    return srcMatch ? srcMatch[1] : '';
  };

  let scriptSrc = extractScriptSrc(scriptSrcFull.value);
  console.log('scriptSrc: ', scriptSrc);

  useHead({
    script: [
      {
        src: scriptSrc,
        async: true,
      },
    ],
  });

  if (scriptType === 'cookie') {
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
