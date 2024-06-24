<script setup lang="ts">
import { useModalStore } from '~/stores/modal';
const modalStore = useModalStore();

const props = defineProps({
  videoArr: {
    required: true,
    default: null,
  },
});

const handleVideo = (videoItem: any) => {
  modalStore.showModal(videoItem);
};
</script>

<template>
  <div class="video">
    <div
      v-if="Array.isArray(props.videoArr)"
      v-for="videoItem in props.videoArr"
      :key="videoItem"
      class="video__wrapper"
      @click="handleVideo(videoItem)"
    >
      <BaseImage
        v-if="videoItem?.field_video_thumbnail"
        :image="videoItem?.field_video_thumbnail"
        class="video__thumbnail"
      />
      <NuxtIcon class="video__play-icon" name="play" />
    </div>

    <!-- Here its an object -->
    <div v-else @click="handleVideo(props.videoArr)">
      <BaseImage
        v-if="props.videoArr?.field_video_thumbnail"
        :image="props.videoArr?.field_video_thumbnail"
        class="video__thumbnail"
      />
      <NuxtIcon class="video__play-icon" name="play" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.video {
  padding-top: 20px @(--md) 0;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;

  :deep(svg) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
  }

  &__play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 48px @(--sm) 64px;
    height: 48px @(--sm) 64px;
    color: var(--color-white);
    border: 2px solid var(--color-white);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  &__thumbnail {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
