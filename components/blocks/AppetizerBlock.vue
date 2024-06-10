<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<template>
  <div
    class="appetizer"
    :class="[
      blockData.field_appetizer_text_alignment
        ? 'appetizer--content-' + blockData.field_appetizer_text_alignment
        : '',
      blockData.field_appetizer_orientation
        ? 'appetizer--image-' + blockData.field_appetizer_orientation
        : '',
    ]"
  >
    <NuxtLink
      class="appetizer__image"
      :to="blockData?.field_appetizer_cta?.url"
    >
      <img
        :src="blockData?.field_appetizer_image?.src"
        :alt="blockData?.field_appetizer_image?.alt"
      />
      <!-- <BaseImage
        v-if="blockData?.field_appetizer_image?.bundle === 'image'"
        :image="blockData.field_appetizer_image"
        :is-overlay="blockData.field_appetizer_image?.field_overlay"
        :component-type-class="blockData.bundle"
      /> -->
    </NuxtLink>

    <div class="appetizer__content">
      <div class="appetizer__content-container">
        <div class="appetizer__title">
          {{ blockData.field_appetizer_headline }}
        </div>
        <div
          v-if="blockData.field_appetizer_text !== null"
          class="appetizer__text"
          v-html="blockData.field_appetizer_text"
        ></div>

        <div class="appetizer__cta">
          <BaseButton
            class="button--primary"
            v-if="blockData.field_appetizer_cta?.title"
            :button-data="blockData.field_appetizer_cta"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.appetizer {
  display: flex;
  flex-direction: column;
  background-color: transparent;

  .col-md-4 & {
    flex-direction: column @(--sm) row @(--md) column;
  }

  .col-md-6 & {
    flex-direction: column @(--sm) row @(--md) column;
  }

  .col-md-8 & {
    flex-direction: column @(--sm) row @(--md) row;
  }

  @media (--viewport-sm-min) {
    flex-direction: row;
  }

  &__title {
    font-weight: 700;
    font-size: var(--font-size-h3);
  }

  &__text {
    padding-top: 16px;
    line-height: 32px;

    :deep(p) {
      font-size: 16px @(--sm) 22px;
      font-weight: 400;
    }
  }

  &__cta {
    padding-top: 8px @(--sm) 16px;

    @media (--viewport-sm-max) {
      a {
        width: 100%;
      }
    }
  }

  &__content {
    width: 100%;
    color: var(--color-text);

    .col-md-4 & {
      width: 100% @(--sm) 50% @(--md) 100%;
    }

    .col-md-8 & {
      width: 100% @(--sm) 50% @(--md) 50%;
    }
  }

  &__content-container {
    padding: 10px 0 @(--sm) 162px 168px;
  }

  &__image {
    width: 100%;

    .col-md-4 & {
      width: 100% @(--sm) 50% @(--md) 100%;
    }

    .col-md-8 & {
      width: 100% @(--sm) 50% @(--md) 50%;
    }

    :deep(picture),
    :deep(img) {
      height: -webkit-fill-available;
      object-fit: cover;

      img {
        height: -webkit-fill-available;
        object-fit: cover;
      }
    }
  }

  &--content-center {
    text-align: center;
  }

  &--content-right {
    text-align: right;
  }

  &--image-left {
    display: flex;

    .appetizer__image {
      overflow: hidden;
    }
  }

  &--image-right {
    display: flex;
    flex-direction: column @(--sm) row-reverse;

    & .appetizer__image {
      overflow: hidden;
    }
  }
}
</style>
