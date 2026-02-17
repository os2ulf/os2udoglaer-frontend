<script setup lang="ts">
import { useSettingsDataStore } from '~/stores/settingsData';

const settingsDataStore = useSettingsDataStore();
await settingsDataStore.getSettingsData();

// Grab scripts (non-reactive)
const cookieScript = settingsDataStore.getCookieScript();
const trackingScript = settingsDataStore.getTrackingScript();

const headScripts: Array<Record<string, any>> = [];

/**
 * Parse a <script> string from CMS and extract:
 * - attrs (like src, id, type)
 * - inlineCode
 */
function parseScript(script: string | null) {
  if (!script) return null;

  const match = script.match(/<script\b([^>]*)>([\s\S]*?)<\/script>/i);
  if (!match) return null;

  const attrString = match[1];
  const inlineCode = match[2].trim();

  const attrs: Record<string, string> = {};
  attrString.replace(/(\w+(?:-\w+)*)=["']([^"']*)["']/g, (_, key, val) => {
    attrs[key] = val;
    return '';
  });

  return { attrs, inlineCode };
}

// ----- Cookie Script -----
const cookieParsed = parseScript(cookieScript);
if (cookieParsed) {
  if (cookieParsed.attrs.src) {
    headScripts.push({
      src: cookieParsed.attrs.src,
      async: true,
      id: cookieParsed.attrs.id,
      type: cookieParsed.attrs.type || 'text/javascript',
    });
  } else if (cookieParsed.inlineCode) {
    headScripts.push({
      children: cookieParsed.inlineCode,
      type: cookieParsed.attrs.type || 'text/javascript',
      async: true,
      id: cookieParsed.attrs.id,
    });
  }
}

// ----- Tracking Script -----
const trackingParsed = parseScript(trackingScript);
if (trackingParsed) {
  if (trackingParsed.attrs.src) {
    headScripts.push({
      src: trackingParsed.attrs.src,
      defer: true,
      id: trackingParsed.attrs.id,
      type: trackingParsed.attrs.type || 'text/javascript',
    });
  } else if (trackingParsed.inlineCode) {
    headScripts.push({
      children: trackingParsed.inlineCode,
      type: trackingParsed.attrs.type || 'text/javascript',
      defer: true,
      id: trackingParsed.attrs.id,
    });
  }
}

// Inject into <head> SSR-safe
useHead({
  script: headScripts,
});
</script>

<template>
  <!-- No template needed; all scripts handled via useHead -->
</template>