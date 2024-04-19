<template>
  <div
    v-if="alteredData.field_text !== null"
    class="rte"
    v-html="alteredData.field_text"
  ></div>
</template>

<script setup>
const config = useRuntimeConfig().public;

const props = defineProps({
  blockData: Object,
});

const alteredData = { ...props.blockData };

if (alteredData.field_text !== null) {
  // find all img sources in the block data
  const imgRegex = /<img[^>]*src="([^"]*)"[^>]*>/g;
  const imgSrcs = alteredData.field_text.match(imgRegex);

  // find all data-align in the image
  const alignRegex = /data-align="([^"]*)"/g;
  const aligns = alteredData.field_text.match(alignRegex);

  // find all data-caption in the image
  const captionRegex = /<img[^>]*data-caption="([^"]*)"[^>]*>/g;
  const captions = alteredData.field_text.match(captionRegex);

  // replace all img sources with the correct url
  if (imgSrcs) {
    imgSrcs.forEach((imgSrc) => {
      const src = imgSrc.match(/src="([^"]*)"/)[1];
      // add the correct url to the img src
      const newSrc = src.replace(src, config.API_BASE_URL + src);
      alteredData.field_text = alteredData.field_text.replace(src, newSrc);
    });
  }

  // replace all data-align options with a class
  if (aligns) {
    aligns.forEach((align) => {
      const alignClass = align.match(/data-align="([^"]*)"/)[1];
      // attach alignmed class to image
      alteredData.field_text = alteredData.field_text.replace(
        align,
        `class="${alignClass}"`,
      );
    });
  }

  // if image has data-caption
  if (alteredData.field_text.includes('data-caption')) {
    const captionRegex = /<img[^>]*data-caption="([^"]*)"[^>]*>/g;
    const captions = alteredData.field_text.match(captionRegex);

    captions.forEach((caption) => {
      let captionAlignmentClass = '';
      // if image also has a class= attribute set var to hold the value and then attach the same class to the caption text under image
      if (caption.includes('class=')) {
        const captionText = caption.match(/class="([^"]*)"/)[1];
        captionAlignmentClass = captionText;
      }

      const captionText = caption.match(/data-caption="([^"]*)"/)[1];
      const captionDiv = `<figcaption class="${captionAlignmentClass}">${captionText}</figcaption>`;

      alteredData.field_text = alteredData.field_text.replace(
        caption,
        caption + captionDiv,
      );
    });
  }
}
</script>

<style lang="postcss" scoped>
/* Aligning image with deep selectors */
.rte {
  :deep(.text-align-center) {
    display: block;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
  }

  :deep(.text-align-left) {
    display: block;
    margin-right: aut;
    margin-left: 0;
    text-align: left;
  }

  :deep(.text-align-justify) {
    display: block;
    margin-right: auto;
    margin-left: auto;
    text-align: justify;
  }

  :deep(.text-align-right) {
    display: block;
    margin-right: 0;
    margin-left: auto;
    text-align: right;
  }

  :deep(figcaption) {
    color: var(--color-gray-42);
    font-size: 0.9rem;
    font-style: italic;
  }
}
</style>
