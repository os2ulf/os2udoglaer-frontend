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
      <h3 v-if="data.field_video_title" class="video-content__title">
        {{ data?.field_video_title }}
      </h3>
      <div
        class="video-content__text"
        v-html="data?.field_video_description"
      ></div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.video-content {
  &__title {
    line-height: 38px;
  }
}
</style>
