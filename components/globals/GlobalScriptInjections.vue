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
  // This regex captures both the attributes (group 1) and the inline code (group 2)
  const scriptTagRegex = /<script\s+([^>]*)>([\s\S]*?)<\/script>/i;
  const attrRegex = /(\w+[-\w]*)=["']([^"']+)["']/g;

  const matches = scriptString.match(scriptTagRegex);
  if (!matches) {
    console.error('GlobalInjections.vue: Invalid script string');
    console.log(scriptString);
    return;
  }

  // Group 1: attributes string; Group 2: inline code (if any)
  const attributesString = matches[1];
  const inlineCode = matches[2].trim();

  // Parse attributes into an object
  const scriptAttributes: Record<string, string> = {};
  let match;
  while ((match = attrRegex.exec(attributesString)) !== null) {
    scriptAttributes[match[1]] = match[2];
  }

  // If a src attribute is present, treat this as an external script:
  if (scriptAttributes.src) {
    const headScript: any = {
      src: scriptAttributes.src,
      type: scriptAttributes.type || 'text/javascript',

      // Force async for cookie scripts and defer for tracking scripts
      async: scriptType === 'cookie' || scriptAttributes.async !== undefined,
      defer: scriptType === 'tracking' || scriptAttributes.defer !== undefined,
    };
    if (scriptAttributes.id) headScript.id = scriptAttributes.id;

    // Inject via Nuxt useHead (which will add it to the head and load the script)
    useHead({
      script: [headScript],
    });
  } else if (inlineCode) {
    // Otherwise, create an inline script element manually:
    const scriptEl = document.createElement('script');
    scriptEl.type = scriptAttributes.type || 'text/javascript';

    // Set async/defer attributes based on script type and attributes
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
