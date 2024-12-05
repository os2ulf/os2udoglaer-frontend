<script setup>
const props = defineProps({
  blockData: Object,
});

const imageCaption = ref(
  props.blockData?.field_image_with_link_link?.field_link_text,
);
const selectedTheme = ref(props.blockData?.field_theme);
const externalLink = ref(
  props.blockData?.field_image_with_link_link?.field_external_link?.url,
);
const internalLink = ref(
  props.blockData?.field_image_with_link_link?.field_internal_link?.url,
);

const captionData = ref({
  imageCaption: imageCaption.value,
  selectedTheme: selectedTheme.value,
});
</script>

<template>
  <div class="image-block-with-link">
    <NuxtLink
      v-if="externalLink || internalLink"
      :to="externalLink || internalLink"
      :target="externalLink"
      class="image-block-with-link__link"
    >
      <BaseImage
        v-if="blockData?.field_image_media"
        :image="blockData?.field_image_media"
        :captionData="captionData"
      />
    </NuxtLink>
    <BaseImage
      v-else-if="blockData?.field_image_media"
      :image="blockData?.field_image_media"
      :captionData="captionData"
    />
  </div>
</template>

<style lang="postcss" scoped>
.image-block-with-link {
  padding-bottom: 32px;

  @media (--viewport-md-min) {
    padding-bottom: 0;
  }

  &__link {
    text-decoration: none;
  }
}
</style>
