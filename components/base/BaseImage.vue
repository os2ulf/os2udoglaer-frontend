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

const processedIsOverlay = computed(() => {
  return props.isOverlay ? 'image--overlay' : '';
});

const processedComponentTypeClass = computed(() => {
  if (props.componentTypeClass == undefined) {
    return '';
  } else {
    return props.componentTypeClass;
  }
});
</script>

<template>
  <figure class="image">
    <picture :class="[processedIsOverlay + ' ' + processedComponentTypeClass]">
      <template
        v-for="(el, index) in image?.field_media_image?.sources"
        :key="index"
      >
        <source :media="el.media" :srcset="el.srcset" />
      </template>
      <img
        :src="image?.field_media_image?.img_element?.uri"
        :alt="
          image?.field_media_image?.img_element?.alt
            ? image?.field_media_image?.img_element?.alt
            : image?.label
        "
        loading="lazy"
        :width="image?.field_media_image?.width"
        :height="image?.field_media_image?.height"
      />
    </picture>

    <figcaption
      v-if="
        (caption && caption !== null) ||
        (image?.field_copyright && props.copyrightEnabled)
      "
      class="image__caption"
    >
      {{ caption && caption !== null ? caption : '' }}
      <span v-if="image?.field_copyright !== null"
        >(© {{ image?.field_copyright }})</span
      >
    </figcaption>
  </figure>
</template>

<style setup lang="postcss" scoped>
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

  &--overlay {
    filter: brightness(0.6);
  }

  &__caption {
    max-width: var(--container-width);
    margin: 16px auto 0;
    color: var(--color-gray-62);
    font-size: var(--font-size-paragraph-xs);
  }
}

.container--full {
  .image {
    &__caption {
      padding: 0 var(--grid-gutter-half);
    }
  }
}

.appetizer,
.article,
.slider,
.hero {
  .image__caption {
    display: none;
  }
}
</style>
