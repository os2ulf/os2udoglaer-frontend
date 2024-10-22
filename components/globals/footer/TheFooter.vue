<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const handleUpdateCookieConsent = () => {
  const cookiebot = ((window as any) && (window as any).Cookiebot) || {};

  cookiebot.show();
};

// There can be multiple footer bundles / components coming from the CMS so we do some mental gymnastics below to check
const allPossibleFooterData = ref(props.data);

// Filter out footer bundles based on the bundle type and just use the 1st one,
// because its editors job to be competent and not have multiple footers in the first place
const filterFooterData = Object.keys(allPossibleFooterData.value)
  .filter((bundle) => allPossibleFooterData.value[bundle].bundle === 'footer')
  .map((bundle) => allPossibleFooterData.value[bundle]);

const footerData = ref(filterFooterData[0]);
</script>

<template>
  <div
    class="footer"
    :class="footerData?.field_theme ? footerData?.field_theme : ''"
  >
    <div
      class="footer__watermark"
      v-if="footerData?.field_background_image?.src"
    >
      <img
        class="footer__watermark-image"
        :src="footerData?.field_background_image?.src"
        :alt="
          footerData?.field_background_image?.alt
            ? footerData?.field_background_image?.alt
            : 'Watermark image'
        "
      />
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-3 footer__section">
          <h3 class="footer__title">Kontakt</h3>
          <div class="footer__contact" v-if="footerData">
            <div
              v-if="footerData?.field_contact_info"
              class="footer__contact-info"
            >
              <BaseRte :content="footerData?.field_contact_info" />
            </div>

            <div
              class="footer__contact-info-button"
              v-if="footerData.field_contact_page_url"
            >
              <NuxtLink
                class="button button--link button--link--white footer__contact-button"
                :to="footerData?.field_contact_page_url.url"
                :aria-label="footerData?.field_contact_page_url?.title"
                >{{ footerData?.field_contact_page_url?.title }}
                <NuxtIcon
                  class="footer__button-icon"
                  filled
                  name="arrow-right"
                />
              </NuxtLink>
            </div>

            <div
              class="footer__contact-social-media"
              v-if="
                footerData?.field_facebook_url ||
                footerData?.field_instagram_url ||
                footerData?.field_linkedin_url
              "
            >
              <NuxtLink
                class="footer__contact-social-media-icon"
                v-if="footerData.field_facebook_url"
                :to="footerData?.field_facebook_url?.url"
                aria-label="link to facebook"
              >
                <NuxtIcon filled name="footer-facebook" />
              </NuxtLink>
              <NuxtLink
                class="footer__contact-social-media-icon"
                v-if="footerData.field_instagram_url"
                :to="footerData?.field_instagram_url?.url"
                aria-label="link to instagram"
              >
                <NuxtIcon filled name="footer-instagram" />
              </NuxtLink>
              <NuxtLink
                class="footer__contact-social-media-icon"
                v-if="footerData.field_linkedin_url"
                :to="footerData?.field_linkedin_url?.url"
                aria-label="link to linkedin"
              >
                <NuxtIcon filled name="footer-linkedin" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-3 footer__section">
          <div
            class="footer__shortcuts"
            v-if="footerData?.field_shortcuts?.length > 0"
          >
            <h3 class="footer__title">Genveje</h3>

            <div class="footer__shortcuts-container">
              <NuxtLink
                class="footer__shortcuts-item"
                v-for="item in footerData.field_shortcuts"
                :key="item.id"
                :to="item?.url"
                :aria-label="item?.label"
              >
                {{ item?.label }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 footer__section">
          <div class="footer__big-icons-container">
            <NuxtLink
              class="footer__big-icon-item"
              v-for="item in footerData?.field_logos_and_links"
              :key="item.id"
              :to="item?.field_link?.url"
              aria-label="link to logo"
            >
              <img
                :src="item?.field_image?.src"
                :alt="item?.field_image?.alt ? item?.field_image?.alt : 'logo'"
              />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 footer__section">
          <div class="footer__privacy">
            <div
              class="footer__privacy-buttons"
              v-if="footerData?.field_privacy_terms?.length > 0"
            >
              <NuxtLink
                class="footer__privacy-button-item"
                v-for="item in footerData?.field_privacy_terms"
                :key="item?.id"
                :to="item?.url"
                :aria-label="item?.title"
              >
                {{ item?.title }}
              </NuxtLink>
            </div>

            <div class="footer__privacy-terms">
              <NuxtLink
                class="button button--link button--link--white footer__contact-button"
                to="https://www.os2.eu/os2udoglaer"
                target="_blank"
                aria-label="link to os2udoglaer"
              >
                Bliv en del af OS2udoglær
                <NuxtIcon class="footer__button-icon" filled name="ext-link" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.footer {
  background-color: var(--theme-background-color);
  color: var(--theme-color);
  padding: 72px 0 @(--sm) 96px 0;
  transition: background-color 0.3s ease-in-out;
  position: relative;

  &__section {
    z-index: 1;
  }

  &__title {
    margin-bottom: 0;
    padding: 0;
    font-size: 28px;
    color: var(--theme-footer-text-color);
  }

  &__contact-info {
    padding-top: 20px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--theme-footer-text-color);

    :deep(p):last-child {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }

  &__contact-info-button {
    padding-top: 20px;
  }

  &__contact-button {
    color: var(--theme-footer-text-color);
    border-bottom: 2px solid var(--theme-footer-text-color);

    &:hover {
      border-bottom: 2px solid var(--theme-button-ghost-text-color-hover);

      :deep(path) {
        stroke: var(--theme-button-ghost-text-color-hover);
      }
    }
  }

  &__button-icon {
    padding-left: 12px;
    font-size: 24px;

    :deep(path) {
      transition: stroke 0.3s ease-in-out;
      stroke: var(--theme-footer-text-color);
    }
  }

  &__contact-social-media {
    padding-top: 48px @(--sm) 36px;
    font-size: 32px;
    display: flex;
    gap: 24px;
  }

  &__contact-social-media-icon {
    text-decoration: none;
    cursor: pointer;

    :deep(path) {
      fill: var(--theme-footer-text-color);
    }

    :deep(rect) {
      stroke: var(--theme-footer-text-color);
    }

    :deep(path),
    :deep(rect) {
      transition: all 0.3s ease-in-out;
    }

    &:hover {
      :deep(path) {
        fill: var(--theme-button-ghost-text-color-hover);
      }
      :deep(rect) {
        stroke: var(--theme-button-ghost-text-color-hover);
      }
    }
  }

  &__shortcuts {
    padding-top: 48px @(--sm) 0;
    margin-bottom: 0 @(--md) 20px;
    display: grid;
  }

  &__shortcuts-container {
    padding-top: 20px;
    display: grid;
  }

  &__shortcuts-item {
    margin-bottom: 8px;
    text-decoration: none;
    color: var(--theme-footer-text-color);
    cursor: pointer;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    width: fit-content;
    transition: color 0.3s ease-in-out;

    &:last-child,
    &:not(:first-child) {
      padding-bottom: 0;
    }

    &:hover {
      color: var(--theme-button-ghost-text-color-hover);
    }
  }

  &__watermark {
    position: absolute;
    top: 56px @(--md) 61px;
    right: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;

    @media (--viewport-sm-max) {
      left: 45px;
    }
  }

  &__big-icons-container {
    display: flex;
    align-items: flex-end;
    flex-flow: wrap;
    padding-top: 48px @(--md) 0;
    justify-content: left @(--md) flex-end;
    gap: 16px @(--sm) 36px;
    height: 100%;
    width: 100%;

    /* this is to 'fix' the scrolling issue if there are more than 3 big logos,
    however in the ACs it states it should only be up to 3 icons, so this is just in case. */
    /* overflow: scroll @(--md) visible; */
  }

  &__big-icon-item {
    img {
      opacity: 1;
      transition: all 0.3s ease-in-out;
    }

    &:hover {
      img {
        opacity: 0.8;
      }
    }

    @media (--viewport-ms-max) {
      text-align: center;
    }
  }

  &__privacy {
    padding-top: 48px @(--md) 96px;
    display: grid @(--md) flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &__privacy-buttons {
    display: grid @(--md) flex;
    gap: 24px @(--md) 40px;
    flex-wrap: wrap;
  }

  &__privacy-button-item {
    padding: 0;
    text-decoration: none;
    background: none;
    border: none;
    color: var(--theme-footer-text-color);
    cursor: pointer;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: left;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: var(--theme-button-ghost-text-color-hover);
    }
  }

  &__privacy-terms {
    padding-top: 40px @(--md) 0;
  }
}
</style>
