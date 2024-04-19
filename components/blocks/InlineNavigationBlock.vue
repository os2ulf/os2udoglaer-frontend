<script setup>
import { Navigation, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const props = defineProps({
  blockData: Object,
  title: {
    type: String,
    required: false,
  },
});

const modules = [Navigation, Scrollbar, A11y];
const breakpoints = {
  768: {
    slidesPerView: 2,
  },
  992: {
    slidesPerView: 3,
  },
  1200: {
    slidesPerView: 4,
  },
};
</script>

<template>
  <div class="inline-navigation">
    <ClientOnly>
      <h2 v-if="blockData.field_headline" class="inline-navigation__title">
        {{ blockData.field_headline }}
      </h2>
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="30"
        :breakpoints="breakpoints"
        navigation
        :scrollbar="{ draggable: true }"
        class="inline-navigation__swiper"
      >
        <SwiperSlide
          v-for="item in blockData.items"
          :key="item.id"
          class="inline-navigation__slide"
        >
          <BaseArticle :article="item" />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>

<style lang="postcss" scoped>
.inline-navigation {
  padding: 30px 0;

  &__slide {
    padding-bottom: 30px;

    &:first-child {
      margin-left: auto !important;
    }

    &:last-child {
      margin-right: auto !important;
    }
  }

  &__title {
    position: relative;
    bottom: -50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 42px;
    margin: 0;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }
}
</style>
