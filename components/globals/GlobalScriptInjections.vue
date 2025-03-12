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
  // Match multiple <script> tags in the input
  const scriptTagRegex = /<script\s+([^>]*)>([\s\S]*?)<\/script>/gi;
  const attrRegex = /(\w+[-\w]*)=["']([^"']+)["']/g;
  let match;

  while ((match = scriptTagRegex.exec(scriptString)) !== null) {
    const attributesString = match[1];
    const inlineCode = match[2].trim();

    // Parse attributes
    const scriptAttributes: Record<string, string> = {};
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
      scriptAttributes[attrMatch[1]] = attrMatch[2];
    }

    // Handle external script
    if (scriptAttributes.src) {
      const headScript: any = {
        src: scriptAttributes.src,
        type: scriptAttributes.type || 'text/javascript',
        async: scriptType === 'cookie' || scriptAttributes.async !== undefined,
        defer:
          scriptType === 'tracking' || scriptAttributes.defer !== undefined,
      };
      if (scriptAttributes.id) headScript.id = scriptAttributes.id;

      console.log('injecting headScript', headScript);

      useHead({
        script: [headScript],
      });
    }
    // Handle inline script
    else if (inlineCode) {
      const scriptEl = document.createElement('script');
      scriptEl.type = scriptAttributes.type || 'text/javascript';

      if (scriptType === 'cookie' || scriptAttributes.async !== undefined) {
        scriptEl.async = true;
      }
      if (scriptType === 'tracking' || scriptAttributes.defer !== undefined) {
        scriptEl.defer = true;
      }
      if (scriptAttributes.id) {
        scriptEl.id = scriptAttributes.id;
      }

      scriptEl.textContent = inlineCode;
      document.head.appendChild(scriptEl);
      console.log('injecting scriptEl', scriptEl);
    }
  }

  // Mark cookie script as loaded if applicable
  if (scriptType === 'cookie') {
    isCookieScriptLoaded.value = true;
  }
};

// When the cookie script loads, if the site tracking script is available, inject it.
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
