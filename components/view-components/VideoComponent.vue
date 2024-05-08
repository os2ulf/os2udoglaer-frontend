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
  <div class="video-component">
    <div class="col-xs-12 col-sm-12 col-md-6 video-component__remove-padding">
      <VideoContent
        :data="{
          field_video_title: data.field_video_title,
          field_video_description: data.field_video_description,
        }"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 video-component__remove-padding">
      <VideoPlayer
        :data="{
          field_video_thumbnail: data.field_video_thumbnail,
          field_video: data.field_video,
        }"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.video-component {
  display: grid @(--md) flex;

  &__remove-padding {
    padding: 0;
  }
}
</style>
