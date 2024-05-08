<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

// {{ data.field_video_thumbnail }}
// {{ data.field_video.url }}
</script>

<template>
  <div class="video-player">
    <div>
      LOGIC NEEDED: some sort of alert needs to happen here with a message, a
      modal and a redirect button to see the video on the provider site. Should
      it open in a new tab? <br />
      <br />
      +add base image once images transformed to proper structure
      <img
        :src="data.field_video_thumbnail.src"
        alt="video thumbnail"
        class="video-player__thumbnail"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.video-player {
}
</style>
