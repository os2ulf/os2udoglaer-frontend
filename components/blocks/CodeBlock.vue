<script setup lang="ts">
import Tweet from 'vue-tweet';

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

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

const twitterEmbed = ref(false);
const twitterIds: any = [];
const instagramEmbed = ref(false);
const instagramUrls: any = [];
const codeData = props.blockData.field_code_content;

if (codeData !== null) {
  const findUrls = codeData.match(
    /\b((https?|ftp|file):\/\/|(www|ftp)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/gi,
  );

  if (findUrls !== null) {
    for (let j = 0; j < findUrls.length; j++) {
      const url = findUrls[j];
      if (url.includes('twitter.com') && url.includes('/status/')) {
        twitterEmbed.value = true;
        const urlParse = new URL(url);
        const twitterId = urlParse.pathname.split('/status/')[1];
        if (!twitterIds.includes(twitterId)) {
          twitterIds.push(twitterId);
        }
      } else if (url.includes('instagram.com') && !url.includes('/embed.js')) {
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
      }
    }
  }
}

const handleUpdateConsent = () => {
  const cookiebot = ((window as any) && (window as any).Cookiebot) || {};
  cookiebot.show();
};
</script>

<template>
  <ClientOnly>
    <div v-if="!blockData.field_require_cookie_consent">
      <div v-if="twitterEmbed">
        <div v-for="twitterId in twitterIds" :key="twitterId" class="code">
          <Tweet :tweet-id="twitterId" />
        </div>
      </div>
      <div v-else>
        <div class="code" v-html="props.blockData.field_code_content"></div>
      </div>
    </div>
    <div v-else>
      <div class="consent-box">
        Please Accept Cookie Consent to view this content.
        <br /><br />
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="postcss" scoped>
.consent-box {
  :deep(iframe) {
    max-width: 100%;
  }
}
</style>
