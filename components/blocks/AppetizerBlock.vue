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
    <div class="row">
      <div class="col-xs-12" :class="[
        blockData.appetizer_size === 'default' ? 'col-md-6 col-lg-6' : 'col-md-12',
        blockData.field_appetizer_orientation === 'right' && blockData.appetizer_size === 'default' ? 'col-lg-offset-1' : ''
      ]">
        <NuxtLink
          class="appetizer__image"
          :to="blockData?.field_appetizer_cta?.url"
        >
          <BaseImage
            v-if="blockData?.field_appetizer_image"
            :image="blockData.field_appetizer_image"
          />
        </NuxtLink>
      </div>
      <div class="col-xs-12" :class="[
        blockData.appetizer_size === 'default' ? 'col-md-6 col-lg-5' : 'col-md-12',
        blockData.field_appetizer_orientation === 'left' && blockData.appetizer_size === 'default' ? 'col-lg-offset-1' : ''
      ]">
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
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.appetizer {
  display: flex;
  flex-direction: column;
  background-color: transparent;

  &__title {
    margin-bottom: 16px;
    font-weight: 700;
    font-size: var(--font-size-h3);
  }

  &__text {
    margin-bottom: 16px;
    line-height: 32px;

    :deep(p) {
      font-size: 16px @(--sm) 22px;
      font-weight: 400;
    }
  }

  &__cta {
    @media (--viewport-sm-max) {
      a {
        width: 100%;
      }
    }
  }

  &__content {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    color: var(--color-text);
  }

  &__content-container {
    padding: 20px 0;
  }

  &__image {
    width: 100%;
  }

  &--content-center {
    text-align: center;
  }

  &--content-right {
    text-align: right;
  }

  &--image-left {
    .appetizer__image {
      overflow: hidden;
    }
  }

  &--image-right {
    @media (--viewport-md-min) {
      .row {
        flex-direction: row-reverse;
      }
    }

    & .appetizer__image {
      overflow: hidden;
    }
  }
}
</style>
