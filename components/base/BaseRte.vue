<template>
  <div class="base-rte" v-html="content"></div>
</template>

<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});
</script>

<style lang="postcss" scoped>
.base-rte {
  :deep(.text-align-right) {
    text-align: right;
  }

  :deep(.text-align-left) {
    text-align: left;
  }

  :deep(.text-align-center) {
    text-align: center;
  }

  :deep(.text-align-justify) {
    text-align: justify;
  }

  :deep(blockquote) {
    margin-right: 0;
    margin-left: 0;
    padding-left: 16px;
    border-left: 4px solid var(--color-gray-62);
  }

  :deep(.base-rte) {
    overflow: hidden;
  }
}
</style>
