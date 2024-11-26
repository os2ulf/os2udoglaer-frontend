<script setup lang="ts">
const props = defineProps({
  image: Object,
  captionData: Object,
});

const noTheme = 'theme-default'; // This acts as a no theme trigger
const hasTheme = computed(() => {
  if (!props.captionData?.selectedTheme) {
    return false;
  } else if (props.captionData?.selectedTheme[1] === noTheme) {
    return false;
  } else {
    return props.captionData?.selectedTheme[1];
  }
});
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
            : image?.label || 'Billede'
        "
        :title="
          image?.img_element?.alt
            ? image?.img_element?.alt
            : image?.label || 'Billede'
        "
        loading="lazy"
        :width="image?.width"
        :height="image?.height"
      />
    </picture>
    <figcaption
      v-if="props.captionData?.imageCaption"
      class="image__caption"
      :class="[
        hasTheme ? 'image__caption--has-theme' : '',
        hasTheme ? hasTheme : '',
      ]"
    >
      {{ props.captionData?.imageCaption }}
    </figcaption>
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

  &__caption {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: white;
    font-size: 1rem;
    text-align: left;
    padding: 8px 12px;
    box-sizing: border-box;

    &--has-theme {
      background-color: var(--theme-background-color);
      color: var(--theme-color);
    }
  }
}
</style>
