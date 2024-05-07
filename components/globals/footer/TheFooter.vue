<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const footerData = props.data;

const handleUpdateCookieConsent = () => {
  const cookiebot = ((window as any) && (window as any).Cookiebot) || {};

  cookiebot.show();
};
</script>

<template>
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="footer__socials col-sm-12 col-md-3">
          <button class="button" @click="handleUpdateCookieConsent">
            Cookies
          </button>
        </div>

        <div class="col-sm-12 col-md-3">
          <div class="footer__navigation-items-wrapper" v-if="footerData">
            <TheFooterContainer :footer-menu-data="footerData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.footer {
  background-color: var(--color-primary);
  padding: 80px 0 60px @(--sm) 90px 0 90px;
}
</style>
