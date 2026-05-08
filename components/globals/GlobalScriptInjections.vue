<script setup lang="ts">
import { useHead } from '#imports';
import { useSettingsDataStore } from '~/stores/settingsData';

const settingsDataStore = useSettingsDataStore();

await settingsDataStore.getSettingsData();

// Grab scripts from store
const cookieScript = settingsDataStore.getCookieScript();
const trackingScript = settingsDataStore.getTrackingScript();

const headScripts: Array<Record<string, any>> = [];

/**
 * Parse ALL <script> tags from a string.
 *
 * Supports:
 * - inline scripts
 * - external src scripts
 * - boolean attrs (async, defer, etc.)
 */
function parseScripts(html: string | null) {
  if (!html) return [];

  const matches = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ];

  return matches.map((match) => {
    const attrString = match[1];
    const inlineCode = match[2].trim();

    const attrs: Record<string, any> = {};

    // Parse attributes including boolean attrs
    attrString.replace(
      /(\w+(?:-\w+)*)(?:=["']([^"']*)["'])?/g,
      (_, key, val) => {
        attrs[key] = val ?? true;
        return '';
      }
    );

    return {
      attrs,
      inlineCode,
    };
  });
}

/**
 * Push parsed scripts into useHead config
 */
function addScripts(
  scripts: ReturnType<typeof parseScripts>,
  defaults: {
    async?: boolean;
    defer?: boolean;
  } = {}
) {
  scripts.forEach((parsed) => {
    const scriptConfig: Record<string, any> = {
      type: parsed.attrs.type || 'text/javascript',
    };

    // Preserve optional attrs
    if (parsed.attrs.id) {
      scriptConfig.id = parsed.attrs.id;
    }

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

    // External script
    if (parsed.attrs.src) {
      scriptConfig.src = parsed.attrs.src;
    }

    // Inline script
    if (parsed.inlineCode) {
      scriptConfig.children = parsed.inlineCode;
    }

    headScripts.push(scriptConfig);
  });
}

// ----- Cookie Scripts -----
addScripts(parseScripts(cookieScript), {
  async: true,
});

// ----- Tracking Scripts -----
addScripts(parseScripts(trackingScript), {
  defer: true,
});

// Inject into <head>
useHead({
  script: headScripts,
});
</script>

<template>
  <!-- Scripts are injected via useHead -->
</template>