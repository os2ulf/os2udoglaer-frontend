<script setup lang="ts">
import { useHead } from '#imports';
import { useSettingsData } from '~/composables/useSettingsData'
import { computed } from 'vue'

const settings = useSettingsData();

await settings.getSettingsData();

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

function getScriptConfigs(
  scripts: ReturnType<typeof parseScripts>,
  defaults: { async?: boolean; defer?: boolean } = {},
  keyPrefix = 'settings-script'
) {
  return scripts.map((parsed, index) => {
    const scriptConfig: Record<string, any> = {
      key: parsed.attrs.id || parsed.attrs.src || `${keyPrefix}-${index}`,
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

    return scriptConfig;
  });
}

const headScripts = computed(() => [
  ...getScriptConfigs(
    parseScripts(settings.cookieScript.value),
    { async: true },
    'cookie-script'
  ),
  ...getScriptConfigs(
    parseScripts(settings.trackingScript.value),
    { defer: true },
    'tracking-script'
  ),
]);

useHead(() => ({
  script: headScripts.value,
}));
</script>

<template>
  <!-- injected via useHead -->
</template>
