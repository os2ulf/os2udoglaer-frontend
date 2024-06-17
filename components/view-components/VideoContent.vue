<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});
</script>

<template>
  <div class="video-content">
    <div class="video-content__text-wrapper">
      <h3 v-if="data.videoTitle" class="video-content__title">
        {{ data?.videoTitle }}
      </h3>
      <div
        v-if="data?.videoDescription"
        class="video-content__description"
        v-html="data?.videoDescription"
      ></div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.video-content {
  &__title {
    color: var(--color-text);
    line-height: 38px;
  }

  &__description {
    padding-top: 6px;
    color: var(--color-text);
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
