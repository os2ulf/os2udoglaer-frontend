<script setup lang="ts">
import { computed, type PropType } from 'vue';

type Logo =
  | string
  | {
      src?: string;
      url?: string;
      uri?: string;
      alt?: string;
      width?: number | string;
      height?: number | string;
    };

const props = defineProps({
  logo: {
    type: [String, Object] as PropType<Logo>,
    required: true,
  },
});

const logoData = computed(() => {
  if (typeof props.logo === 'string') {
    return {
      src: props.logo,
      alt: 'logo',
      width: undefined,
      height: undefined,
    };
  }

  return {
    src: props.logo?.src ?? props.logo?.url ?? props.logo?.uri ?? '',
    alt: props.logo?.alt ?? 'logo',
    width: props.logo?.width,
    height: props.logo?.height,
  };
});

const logoStyle = computed(() => {
  const width = Number(logoData.value.width);
  const height = Number(logoData.value.height);

  if (!Number.isFinite(width) || !Number.isFinite(height) || height <= 0) {
    return undefined;
  }

  const renderedWidth = (width / height) * 70;

  return {
    width: `${renderedWidth}px`,
    minWidth: '140px',
  };
});
</script>
<template>
  <img
    v-if="logoData.src"
    :src="logoData.src"
    :alt="logoData.alt"
    :width="logoData.width"
    :height="logoData.height"
    :style="logoStyle"
    class="base-logo"
  />
</template>

<style lang="postcss" scoped>
img.base-logo {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 70px;
  object-fit: contain;
}
</style>
