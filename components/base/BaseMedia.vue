<template>
  <div class="base-media">
    <BaseImage
      v-if="blockData.field_hero?.field_background?.bundle === 'image'"
      :image="blockData.field_hero?.field_background"
      :is-overlay="blockData.field_hero?.field_overlay"
      :component-type-class="blockData.bundle"
    />

    <!-- Needs improvements!! Not handling if video is uploaded -->
    <BaseVideo
      v-if="blockData.field_hero?.field_background?.bundle === 'remote_video'"
      :video="blockData.field_hero?.field_background"
      :component-type-class="blockData.bundle"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<style lang="postcss" scoped>
.base-media {
  :deep(.image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
