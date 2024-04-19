<template>
  <div class="hero" :class="{ 'hero--dark': isDarkBg }">
    <BaseMedia
      class="hero__media"
      :block-data="blockData"
      :component-type-class="blockData.field_hero?.bundle"
    />
    <div
      class="hero__content"
      :class="[
        blockData.field_hero?.field_text_position,
        { 'hero__content--dark': isDarkText },
      ]"
    >
      <div
        v-if="blockData.field_hero?.field_text !== null"
        class="hero__text"
        v-html="blockData.field_hero?.field_text"
      ></div>
      <BaseButton
        v-if="blockData.field_hero?.field_cta !== null"
        :button-data="blockData.field_hero?.field_cta"
        :link="
          blockData.field_hero?.field_cta?.class &&
          blockData.field_hero?.field_cta?.class != 'button--normal'
        "
        :color="
          blockData.field_hero?.field_cta?.class == 'button--normal'
            ? ''
            : 'white'
        "
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});

// Checking if overlay is turned on without image
const isDarkText = computed(() => {
  return (
    !props.blockData?.field_hero?.field_overlay &&
    props.blockData?.field_hero?.field_background === null
  );
});

const isDarkBg = computed(() => {
  return (
    props.blockData?.field_hero?.field_overlay &&
    props.blockData?.field_hero?.field_background === null
  );
});
</script>

<style lang="postcss" scoped>
.hero {
  position: relative;
  margin-bottom: var(--grid-gutter);
  padding: 80px var(--grid-gutter);
  overflow: hidden;

  @media (--viewport-md-min) {
    margin-bottom: 0;
  }

  &--dark {
    background: var(--color-black);

    .hero__text {
      :deep(strong) {
        color: var(--color-black);
        background: var(--color-gray-16);
      }
    }
  }

  &--left {
    text-align: left;
  }

  &--center {
    text-align: center;
  }

  &--right {
    text-align: right;
  }

  &__media {
    :deep(picture) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    color: var(--color-white);

    &--dark {
      color: var(--color-black);
    }
  }

  &__text {
    margin-bottom: 1rem;

    :deep(h1, h2) {
      font-size: var(--font-size-display);
    }

    :deep(strong) {
      padding: 4px 14px;
      color: var(--color-white);
      font-weight: 200;
      font-size: 14px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      background: var(--color-black);
    }

    :deep(p:last-child) {
      margin-bottom: 0;
    }
  }
}
</style>
