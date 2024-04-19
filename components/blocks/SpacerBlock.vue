<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<template>
  <div class="spacer">
    <div
      class="spacer__inner"
      :class="'spacer--' + blockData.field_height"
    ></div>
  </div>
</template>

<style lang="postcss" scoped>
.spacer {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;

  &--small {
    height: 1.875rem;
  }

  &--medium {
    height: 3.125rem;
  }

  &--large {
    height: 4.375rem;
  }
}
</style>
