<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    default: null,
  },
});

const inspirationalItems = ref(props.blockData.field_content);
console.log(inspirationalItems);
</script>

<template>
  <div class="inspiration">
    <div class="row">
      <div
        class="col-xs-12 col-sm-12 col-md-12 col-lg-6 inspiration__card"
        v-for="item in inspirationalItems"
        :key="item"
      >
        <div class="inspiration__card-item">
          <BaseCard :data="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.inspiration {
  &__card {
    margin-bottom: 24px;

    @media (--viewport-lg-min) {
      &:nth-child(odd) {
        padding-right: calc(var(--grid-gutter) / 4);
      }

      &:nth-child(even) {
        padding-left: calc(var(--grid-gutter) / 4);
      }
    }

    &-item {
      height: 100%;

      :deep(figure),
      :deep(picture),
      :deep(img) {
        height: 100%;
      }
    }
  }
}
</style>
