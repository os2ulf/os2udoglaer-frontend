<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<template>
  <div class="image-block">
    <NuxtLink
      v-if="blockData?.field_image_link !== null"
      :to="blockData?.field_image_link?.url"
      :target="blockData?.field_image_link?.target"
      class="image-block__link"
    >
      <BaseImage
        v-if="blockData?.field_image_media"
        :image="blockData?.field_image_media"
      />
    </NuxtLink>
    <BaseImage
      v-else-if="blockData?.field_image_media"
      :image="blockData?.field_image_media"
    />
  </div>
</template>

<style lang="postcss" scoped>
.image-block {
  padding-bottom: 32px;

  @media (--viewport-md-min) {
    padding-bottom: 0;
  }

  &__link {
    text-decoration: none;
  }
}
</style>
