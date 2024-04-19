<script setup lang="ts">
const props = defineProps({
  pageBlockHeaderData: {
    type: Object,
    required: false,
  },
});
</script>

<template>
  <div>
    <div
      class="section section--spacing-top-medium section--spacing-bottom-none"
      v-if="props.pageBlockHeaderData"
    >
      <div class="container page-header">
        <BaseImage
          v-if="pageBlockHeaderData?.field_background !== null"
          :image="pageBlockHeaderData?.field_background"
          :is-overlay="pageBlockHeaderData?.field_overlay"
          :component-type-class="pageBlockHeaderData?.bundle"
        />
        <div
          class="page-header__content-wrapper"
          :class="pageBlockHeaderData?.field_text_position"
        >
          <div
            v-if="pageBlockHeaderData?.field_text"
            class="page-header__content-wrapper__rte"
            v-html="pageBlockHeaderData?.field_text"
          ></div>
          <BaseButton
            v-if="pageBlockHeaderData?.field_cta?.title"
            :button-data="pageBlockHeaderData?.field_cta"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page-header {
  &__content-wrapper {
    position: relative;
    padding: 1.25rem;
    color: var(--color-white);
  }
}

.hero {
  &--center {
    text-align: center;
  }

  &--right {
    text-align: right;
  }

  &--left {
    text-align: left;
  }
}
</style>
