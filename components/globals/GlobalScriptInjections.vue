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

if (data.value?.settings.site_tracking_script !== null) {
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
}

const serviceType = ref('cookieinformation'); // or 'cookieinformation' TODO: Make a checker
const cookieToken = ref('226ecb7b-1eba-45cf-a066-6c4a0ce13318');

const loadCookieService = (cookieServiceType: string) => {
  let scriptSrc = '';
  let scriptAttributes: Record<string, string> = {};

  console.log('Loading cookie service:', cookieServiceType);

  if (cookieServiceType === 'cookiebot') {
    scriptSrc = 'https://consent.cookiebot.com/uc.js';
    scriptAttributes = {
      'data-cbid': cookieToken.value,
      'data-framework': 'IAB',
      'data-blockingmode': 'auto',
      type: 'text/javascript',
    };
  } else if (cookieServiceType === 'cookieinformation') {
    scriptSrc = 'https://policy.app.cookieinformation.com/uc.js';
    scriptAttributes = {
      id: 'CookieConsent',
      'data-culture': 'DA',
      type: 'text/javascript',
    };
  } else {
    console.error('Invalid cookie service type:', cookieServiceType);
    return;
  }

  // If exists, do nothing
  if (document.querySelector(`script[src="${scriptSrc}"]`)) {
    console.log(`${cookieServiceType} script is already loaded`);
    return;
  }

  useHead({
    script: [
      {
        src: scriptSrc,
        async: true,
        ...scriptAttributes,
      },
    ],
  });

  console.log(
    `Loaded ${cookieServiceType} script`,
    scriptAttributes,
    scriptSrc,
  );
};

onMounted(() => {
  loadCookieService(serviceType.value);
});
</script>

<template></template>
