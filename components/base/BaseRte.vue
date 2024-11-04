<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

let alteredData = props.content;

if (alteredData !== null) {
  const eternalStrings = ['www.'];

  // find all links
  const linkRegex =
    /<a\s+(.*?)href=["'](?:[^"'>]*href=["']|(?!http:\/\/))(.*?)["'](.*?)>/g;
  const links = alteredData?.match(linkRegex);

  if (links) {
    links.forEach((link) => {
      const hrefMatch = link?.match(/href="([^"]*)"/);
      if (hrefMatch) {
        const href = hrefMatch[1];
        if (
          !href.startsWith('https://') &&
          eternalStrings.some((external) => href.includes(external))
        ) {
          // the first character of the href is a /, so we need to remove that and add https:// to the href string
          alteredData = alteredData?.replace(
            link,
            link?.replace(href, `https://${href}`),
          );
        }
      }
    });
  }

  // Correcting links, adding open in new tab, using title as link text
  alteredData = alteredData?.replace(
    /<a[^>]*href="([^"]*)"[^>]*title="([^"]*)"[^>]*>(.*?)<\/a>/g,
    (_, href, title, linkText) => {
      const shouldOpenInNewTab = /target="_blank"/i.test(_);
      return `<a href="${href}" title="${title}"${
        shouldOpenInNewTab ? ' target="_blank"' : ''
      }>${title || linkText}</a>`;
    },
  );
}
</script>

<template>
  <div class="base-rte" v-if="alteredData !== null" v-html="alteredData"></div>
</template>

<style lang="postcss" scoped>
.base-rte {
  color: var(--theme-color);
  word-wrap: break-word;
  hyphens: auto;

  :deep(a) {
    color: var(--theme-color);
    text-decoration: none;
  }

  :deep(.text-align-right) {
    text-align: right;
  }

  :deep(.text-align-left) {
    text-align: left;
  }

  :deep(.text-align-center) {
    text-align: center;
  }

  :deep(.text-align-justify) {
    text-align: justify;
  }

  :deep(blockquote) {
    margin-right: 0;
    margin-left: 0;
    padding-left: 16px;
    border-left: 4px solid var(--color-gray-62);
  }

  :deep(.base-rte) {
    overflow: hidden;
  }
}
</style>
