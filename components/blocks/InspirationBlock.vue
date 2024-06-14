<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    default: null,
  },
});

const inspirationalItems = ref(props.blockData.field_content);
console.log('blockData', inspirationalItems);
</script>

<template>
  <div class="inspiration">
    <div class="row">
      <div
        class="col-xs-12 col-sm-12 col-md-6"
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
  padding-top: 22px @(--sm) 44px;
  margin-bottom: 22px @(--sm) 44px;

  &__card-item {
    height: 100%;
    padding-bottom: 24px;
  }
}
</style>
