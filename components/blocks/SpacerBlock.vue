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
    height: 15px;

    @media (min-width: 768px) {
      height: 30px;
    }
  }

  &--medium {
    height: 25px;

    @media (min-width: 768px) {
      height: 50px;
    }
  }

  &--large {
    height: 48px;

    @media (min-width: 768px) {
      height: 96px;
    }
  }
}
</style>
