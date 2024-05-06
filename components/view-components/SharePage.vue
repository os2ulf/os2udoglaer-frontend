<script setup lang="ts">
const isSiteUrlCopied = ref(false);
const copySiteUrl = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  isSiteUrlCopied.value = true;
};

const handleShareOnSome = (value: string) => {
  if (value === 'facebook') {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href,
    );
  } else if (value === 'linkedIn') {
    window.open(
      'https://www.linkedin.com/shareArticle?mini=true&url=' +
        window.location.href,
    );
  }
};
</script>

<template>
  <div class="share-page">
    <span class="share-page__title">Del denne side</span>
    <BaseDivider class="share-page__divider" />
    <div class="share-page__links-wrapper">
      <button
        class="share-page__link-item"
        @click="copySiteUrl()"
        :class="isSiteUrlCopied ? 'share-page__link-item--link-copied' : ''"
        aria-label="Kopier link"
        title="Kopier page link"
      >
        <NuxtIcon name="link" filled class="button__icon" />
      </button>
      <button
        class="share-page__link-item"
        @click="handleShareOnSome('linkedIn')"
        aria-label="Share on linkedIn"
        title="Share on LinkedIn"
      >
        <NuxtIcon name="linkedin" filled />
      </button>
      <button
        class="share-page__link-item"
        @click="handleShareOnSome('facebook')"
        aria-label="Share on FaceBook"
        title="Share on Facebook"
      >
        <NuxtIcon name="facebook" filled />
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.share-page {
  display: flex;
  justify-content: space-evenly;
  padding: 9px 15px;
  align-items: center;
  margin-bottom: 24px;

  &__title {
    font-size: 14px;
    font-weight: 400;
    /* TODO: add var */
    color: #87807b;
  }

  &__divider {
    /* TODO: add var */
    color: #d1cfcd;
    width: 56px;
    margin: 0 16px;
  }

  &__links-wrapper {
    display: flex;
  }

  &__link-item {
    /* TODO: add var if needed */
    border: 1px solid #a3c8c5;
    border-radius: 50%;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    cursor: pointer;
    background-color: transparent;

    &--link-copied {
      /* TODO: add var if needed */
      background-color: #a3c8c5;
    }

    &:hover {
      /* TODO: add var if needed */
      background-color: #a3c8c5;
    }

    &:active {
      transform: scale(0.95);
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
