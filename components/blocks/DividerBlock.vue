<template>
  <div class="divider"></div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<style lang="postcss" scoped>
.divider {
  margin: 28px 0;
  border-top: 1px solid var(--color-base-divider);
  opacity: 0.3;
}
</style>
