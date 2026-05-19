<script setup lang="ts">
import { useHead } from '#imports';
import { useSettingsData } from '~/composables/useSettingsData'

const settings = useSettingsData();

await settings.getSettingsData();

// Grab scripts from composable
const cookieScript = settings.getCookieScript();
const trackingScript = settings.getTrackingScript();

const headScripts: Array<Record<string, any>> = [];

function parseScripts(html: string | null) {
  if (!html) return [];

  const matches = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ];

  return matches.map((match) => {
    const attrString = match[1];
    const inlineCode = match[2].trim();

    const attrs: Record<string, any> = {};

    attrString.replace(/(\w+(?:-\w+)*)(?:=["']([^"']*)["'])?/g, (_, key, val) => {
      attrs[key] = val ?? true;
      return '';
    });

    return {
      attrs,
      inlineCode,
    };
  });
}

function addScripts(
  scripts: ReturnType<typeof parseScripts>,
  defaults: { async?: boolean; defer?: boolean } = {}
) {
  scripts.forEach((parsed) => {
    const scriptConfig: Record<string, any> = {
      type: parsed.attrs.type || 'text/javascript',
    };

    if (parsed.attrs.id) scriptConfig.id = parsed.attrs.id;

    if (parsed.attrs.async !== undefined) {
      scriptConfig.async = parsed.attrs.async;
    } else if (defaults.async !== undefined) {
      scriptConfig.async = defaults.async;
    }

    if (parsed.attrs.defer !== undefined) {
      scriptConfig.defer = parsed.attrs.defer;
    } else if (defaults.defer !== undefined) {
      scriptConfig.defer = defaults.defer;
    }

    if (parsed.attrs.src) {
      scriptConfig.src = parsed.attrs.src;
    }

    if (parsed.inlineCode) {
      scriptConfig.children = parsed.inlineCode;
    }

    headScripts.push(scriptConfig);
  });
}

// cookie scripts
addScripts(parseScripts(cookieScript), { async: true });

// tracking scripts
addScripts(parseScripts(trackingScript), { defer: true });

useHead({
  script: headScripts,
});
</script>

<template>
  <!-- injected via useHead -->
</template>