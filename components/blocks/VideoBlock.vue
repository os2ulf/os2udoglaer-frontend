<script setup lang="ts">
import useCookieReply from '~/composables/useCookieReply';

const { hasMarketingConsent } = useCookieReply();

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

const handleUpdateConsent = () => {
  const cookiebot = ((window as any) && (window as any).Cookiebot) || {};

  cookiebot.show();
};

const seeVideo = ref(false);
const showVideo = () => {
  seeVideo.value = true;
};
</script>

<template>
  <ClientOnly>
    <div
      class="video"
      :class="{
        'video--with-consent':
          !hasMarketingConsent || blockData?.field_require_cookie_consent,
      }"
    >
      <template
        v-if="hasMarketingConsent || !blockData?.field_require_cookie_consent"
      >
        <div class="video__wrapper">
          <img
            v-show="!seeVideo"
            class="video__thumbnail"
            :src="
              blockData?.field_video_media?.field_media_oembed_video
                ?.thumbnail || blockData?.field_media_oembed_video?.thumbnail
            "
            :alt="
              blockData?.field_video_media?.field_media_oembed_video?.title ||
              blockData?.field_media_oembed_video?.title
            "
            @click="showVideo"
          />
          <NuxtIcon
            v-show="!seeVideo"
            class="video__play-icon"
            name="play"
            @click="showVideo"
          />
          <div
            v-show="!seeVideo"
            class="video__content"
            :class="`video__content--${blockData?.field_video_text_color}`"
          >
            <h2 v-show="blockData?.field_video_headline !== null">
              {{ blockData?.field_video_headline }}
            </h2>
            <div
              v-show="blockData?.field_video_subline !== null"
              class="video__subtext"
            >
              {{ blockData?.field_video_subline }}
            </div>
          </div>
          <Transition name="fade-in">
            <BaseVideo
              v-if="seeVideo"
              :video="blockData?.field_video_media || blockData"
            />
          </Transition>
        </div>
        <div
          v-if="
            blockData.field_video_media?.field_copyright ||
            blockData?.field_copyright
          "
          class="video__copyright-text"
        >
          (Video:
          {{
            blockData.field_video_media?.field_copyright ||
            blockData?.field_copyright
          }})
        </div>
      </template>
      <template v-else>
        <div class="consent-box">
          Please Accept Cookie Consent to view this content.
          <br /><br />
          <button class="button" @click="handleUpdateConsent">
            Change Consent
          </button>
        </div>
      </template>
    </div>
  </ClientOnly>
</template>

<style lang="postcss" scoped>
.video {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;

  :deep(svg) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &--with-consent {
    background-color: var(--color-gray-16);
  }

  &__wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
  }

  &-base {
    position: relative;
  }

  &__play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px @(--sm) 100px;
    height: 80px @(--sm) 100px;
    color: var(--color-white);
    font-size: 25px @(--sm) 40px;
    border: 2px solid var(--color-white);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  &__thumbnail {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }

  &__content {
    position: absolute;
    right: 30px;
    bottom: 15px;
    z-index: 1;

    @media (--viewport-sm-max) {
      padding: 10px;
    }

    &--light {
      color: var(--color-white);
    }

    &--dark {
      color: var(--color-text);
    }
  }

  &__subtext {
    font-size: 18px;
  }

  &__copyright-text {
    margin-top: 1rem;
    color: var(--color-gray-62);
    font-size: 14px;
  }
}

.container--full {
  .video {
    &__copyright-text {
      padding: 0 var(--grid-gutter);
    }
  }
}

.consent-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90% @(--ms) 320px @(--sm) 450px;
  margin: auto;
  padding: 10px @(--ms) 20px 30px;
  text-align: center;
  background-color: var(--color-white);
  border: 2px solid var(--color-gray-62);
  transform: translate(-50%, -50%);

  @media (--viewport-xs-max) {
    font-size: var(--font-size-paragraph-xs);

    :deep(.button) {
      font-size: var(--font-size-paragraph-xs);
    }
  }

  @media (--ms-max) {
    :deep(.button) {
      letter-spacing: 0.14em;
    }
  }
}
</style>
