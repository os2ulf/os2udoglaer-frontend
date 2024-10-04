<script setup lang="ts">
const props = defineProps({
  image: Object,
  caption: String,
  isOverlay: Boolean,
  componentTypeClass: String,
  copyrightEnabled: {
    type: Boolean,
    default: true,
  },
});

console.log('image', props.image);
</script>

<template>
  <figure class="image">
    <picture>
      <template v-for="el in image?.sources" :key="el">
        <source :media="el.media" :srcset="el.srcset" />
      </template>
      <img
        :src="image?.img_element?.uri"
        :alt="
          image?.img_element?.alt
            ? image?.img_element?.alt
            : image?.label || 'bilede'
        "
        loading="lazy"
        :width="image?.width"
        :height="image?.height"
      />
    </picture>
  </figure>
</template>

<style lang="postcss" scoped>
.image {
  position: relative;
  width: 100%;
  margin: 0;

  img,
  picture {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
</style>
