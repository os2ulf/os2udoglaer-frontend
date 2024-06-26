<script setup>
const props = defineProps({
  blockData: Object,
  sectionWidth: String,
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
      props.sectionWidth == 'section--width-full'
        ? 'appetizer--width-full'
        : '',
    ]"
  >
    <div
      :class="props.sectionWidth == 'section--width-full' ? 'container' : ''"
    >
      <div v-if="blockData?.field_appetizer_image" class="appetizer__image">
        <BaseImage :image="blockData.field_appetizer_image" />
      </div>
      <div class="row">
        <div
          class="col-xs-12 col-md-6 col-lg-5"
          :class="[
            blockData.field_appetizer_orientation === 'left'
              ? 'col-md-offset-6 col-lg-offset-7'
              : '',
          ]"
        >
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
  </div>
</template>

<style lang="postcss" scoped>
.appetizer {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: transparent;

  &__title {
    margin-bottom: 16px;
    font-weight: 700;
    font-size: var(--font-size-h3);
    color: var(--theme-color);
    word-break: break-all;
  }

  &__text {
    margin-bottom: 16px;
    line-height: 32px;
    color: var(--theme-color);

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
    padding-top: 32px @(--sm) 64px @(--md) 162px;
    padding-bottom: 32px @(--sm) 64px @(--md) 162px;
    align-items: center;
    color: var(--theme-color);
  }

  &__image {
    position: relative;
    margin-right: calc(var(--grid-gutter-half) * -1);
    overflow: hidden;

    :deep(figure),
    :deep(picture),
    :deep(img) {
      height: 100%;
    }

    @media (--viewport-md-min) {
      position: absolute;
      top: 0;
      bottom: 0;
      margin-left: 0;
      margin-right: 0;

      .appetizer--image-left & {
        right: 50%;
        left: calc(var(--grid-gutter-half) * -1);
      }

      .appetizer--image-left.appetizer--width-full & {
        left: 0;
      }

      .appetizer--image-right & {
        left: 50%;
        right: calc(var(--grid-gutter-half) * -1);
      }

      .appetizer--image-right.appetizer--width-full & {
        right: 0;
      }
    }
  }

  &--content-center {
    text-align: center;
  }

  &--content-right {
    text-align: right;
  }
}
</style>
