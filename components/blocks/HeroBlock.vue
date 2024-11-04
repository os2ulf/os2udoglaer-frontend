<script setup>
const props = defineProps({
  blockData: Object,
});

const heroData = ref(props.blockData);
</script>

<template>
  <div class="hero">
    <div class="hero__image-wrapper" :class="heroData?.field_image_overlay ? 'hero__image-wrapper--overlay' : ''">
      <BaseImage
        v-if="heroData?.field_image_media"
        :image="heroData?.field_image_media"
      />
      <div class="hero__content">
        <div
          v-if="heroData?.field_hero_subtitle"
          class="hero__text--under-title"
        >
          {{ heroData?.field_hero_subtitle }}
        </div>
        <div v-if="heroData?.field_hero_title" class="hero__text">
          <h1>
            {{ heroData?.field_hero_title }}
          </h1>
        </div>

        <div
          class="hero__button-wrapper"
          v-if="heroData?.field_paragraph_links?.length > 0"
        >
          <div v-for="link in heroData?.field_paragraph_links" :key="link">
            <NuxtLink v-if="link.field_internal_link !== null && link.field_link_text !== null" :to="link.field_internal_link.url" aria-label="Læs mere" class="button hero__button-ghost">
              {{ link.field_link_text }}
            </NuxtLink>
            <a v-else-if="link.field_external_link !== null && link.field_link_text !== null" :href="link.field_external_link.url" target="_blank" aria-label="Læs mere" class="button hero__button-ghost">
              {{ link.field_link_text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.hero {
  position: relative;
  overflow: hidden;

  @media (--viewport-md-min) {
    margin-bottom: 0;
  }

  &__image-wrapper {
    display: flex;
    position: relative;
    background: #000;
    overflow: hidden;

    &--overlay {
      :deep(img) {
        object-fit: cover;
        opacity: 0.8;
      }
    }
  }

  &__content {
    position: absolute;
    width: 90%;
    max-width: 1000px;
    margin: 0 auto;
    color: var(--color-white);
    line-height: 38px @(--sm) 56px;

    /* align center of its container */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__text {
    margin-bottom: 16px @(--sm) 32px;
    text-align: center;
    word-wrap: break-word;

    &--under-title {
      font-size: 16px @(--sm) 20px;
      font-weight: 500;
      margin-bottom: 16px @(--sm) 32px;
      line-height: 24px @(--sm) 32px;
    }
  }

  &__button-wrapper {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__button-ghost {
    color: var(--color-white);
    background-color: transparent;
    border: 1px solid var(--color-white);

    &:hover {
      background-color: var(--color-white);
      color: var(--color-text);
    }
  }
}
</style>
