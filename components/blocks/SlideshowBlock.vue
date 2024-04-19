<script setup lang="ts">
import { Navigation, A11y, Autoplay, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const modules = [Navigation, Scrollbar, A11y, Autoplay];

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

let autoplay: any = false;
if (props.blockData?.field_slideshow_autoplay) {
  autoplay = {
    delay: 3500,
    disableOnInteraction: false,
  };
}
</script>

<template>
  <div class="slider">
    <ClientOnly>
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="50"
        :autoplay="autoplay"
        navigation
        :scrollbar="{ draggable: true }"
      >
        <SwiperSlide
          v-for="image in blockData.field_slideshow_images"
          :key="image.id"
        >
          <BaseImage :image="image" />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>
