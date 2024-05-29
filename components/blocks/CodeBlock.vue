<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

// Must be executed on the client side only
if (process.client) {
  const loadScript = (url: any) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const instagramEmbed = ref(false);
  const instagramUrls: any = [];
  const codeData = props.blockData.field_code_content;

  if (codeData !== null) {
    const findUrls = codeData.match(
      /\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/gi,
    );

    // Finds JS script urls and injects them into the page
    if (findUrls !== null) {
      for (let j = 0; j < findUrls.length; j++) {
        const url = findUrls[j];
        if (url.includes('instagram.com') && !url.includes('/embed.js')) {
          loadScript('//www.instagram.com/embed.js')
            .then(() => {
              instagramEmbed.value = true;
              const urlParse = new URL(url);
              const instagramUrl = urlParse.origin + urlParse.pathname;
              if (!instagramUrls.includes(instagramUrl)) {
                instagramUrls.push(instagramUrl);
              }
            })
            .catch((error) => {
              console.error('Error loading Instagram script:', error);
            });
        } else if (url) {
          loadScript(url).catch((error) => {
            // console.error('Error loading script:', error);
          });
        }
      }
    }
  }
}
</script>

<template>
  <ClientOnly>
    <div v-if="props.blockData" class="code-block">
      <div class="code">
        <div v-html="props.blockData.field_code_content"></div>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="postcss" scoped>
.code-block {
  :deep(iframe) {
    max-width: 100%;
  }
}
</style>
