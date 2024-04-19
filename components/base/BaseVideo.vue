<script setup lang="ts">
const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="video-base">
    <div
      v-if="props.video.bundle == 'remote_video'"
      class="video-base__iframe"
      v-html="props.video.field_media_oembed_video.html"
    ></div>
    <div v-else>{{ props.video.bundle }} not implemented</div>
  </div>
</template>

<style setup lang="postcss" scoped>
.video-base {
  &__iframe {
    position: relative;

    /* padding-top determines the format:
      ~3:2  = 66%
      16:10 = 62.5%
      16:9  = 56.25%
      2:1   = 50%
    */
    padding-top: 56.25%;
    overflow: hidden;

    :deep(iframe) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}
</style>
