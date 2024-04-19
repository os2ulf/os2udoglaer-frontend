<template>
  <div class="image-block">
    <NuxtLink
      v-if="blockData?.field_image_link !== null"
      :to="blockData?.field_image_link?.url"
      :target="blockData?.field_image_link?.target"
      class="image-block__link"
    >
      <BaseImage
        :image="blockData?.field_image_media"
        :caption="blockData?.field_image_caption"
      />
    </NuxtLink>
    <BaseImage
      v-else
      :image="blockData?.field_image_media"
      :caption="blockData?.field_image_caption"
    />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const props = defineProps({
  blockData: Object,
});
</script>

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
