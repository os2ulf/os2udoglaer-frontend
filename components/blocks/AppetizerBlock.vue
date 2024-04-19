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
      <BaseImage
        v-if="blockData?.field_appetizer_image?.bundle === 'image'"
        :image="blockData.field_appetizer_image"
        :is-overlay="blockData.field_appetizer_image?.field_overlay"
        :component-type-class="blockData.bundle"
      />
    </NuxtLink>

    <div class="appetizer__content">
      <div class="appetizer__title">
        {{ blockData.field_appetizer_headline }}
      </div>
      <div
        v-if="blockData.field_appetizer_text !== null"
        class="appetizer__text"
        v-html="blockData.field_appetizer_text"
      ></div>

      <BaseButton
        v-if="blockData.field_appetizer_cta?.title"
        :button-data="blockData.field_appetizer_cta"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<style lang="postcss" scoped>
.appetizer {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);

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
    font-size: var(--font-size-h2);
  }

  &__content {
    width: 100%;
    padding: 20px;

    .col-md-4 & {
      width: 100% @(--sm) 50% @(--md) 100%;
    }

    .col-md-8 & {
      width: 100% @(--sm) 50% @(--md) 50%;
    }
  }

  &__image {
    width: 100%;

    .col-md-4 & {
      width: 100% @(--sm) 50% @(--md) 100%;
    }

    .col-md-8 & {
      width: 100% @(--sm) 50% @(--md) 50%;
    }

    :deep(picture) {
      height: 100%;

      img {
        height: 100%;
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
    flex-direction: row-reverse;

    & .appetizer__image {
      overflow: hidden;
    }
  }
}
</style>
