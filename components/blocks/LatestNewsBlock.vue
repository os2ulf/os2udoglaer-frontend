<script setup lang="ts">
import { Navigation, A11y, Autoplay, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const modules = [Navigation, Scrollbar, A11y, Autoplay];
const breakpoints = {
  768: {
    slidesPerView: 1,
  },
  992: {
    slidesPerView: 2.6,
  },
  1200: {
    slidesPerView: 3.6,
  },
  1400: {
    slidesPerView: 4.3,
  },
};

const props = defineProps({
  blockData: Object,
  sectionWidth: String,
});

const newsData = ref(props.blockData?.results);
</script>

<template>
  <div
    class="latest-news"
    v-if="newsData.length > 0"
    :class="
      sectionWidth === 'section--width-full' && newsData.length > 4
        ? 'container'
        : ''
    "
  >
    <div
      :class="
        props.sectionWidth === 'section--width-full' && newsData.length > 4
          ? 'latest-news--width-full'
          : ''
      "
    >
      <!-- Normal view -->
      <div v-if="newsData.length <= 4" class="latest-news__normal">
        <h2 class="latest-news__title">Seneste nyheder</h2>
        <div class="row">
          <div
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3 latest-news__card"
            v-for="i in newsData"
            :key="i"
          >
            <div class="latest-news__card-item">
              <NewsCard :data="i" />
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel view -->
      <div v-else class="latest-news__carousel">
        <h2 class="latest-news__title">Seneste nyheder</h2>
        <ClientOnly>
          <Swiper
            :modules="modules"
            :breakpoints="breakpoints"
            :space-between="24"
            navigation
            :scrollbar="{ draggable: true }"
            class="latest-news__swiper"
          >
            <SwiperSlide
              v-for="i in newsData"
              :key="i"
              class="latest-news__slide"
            >
              <div class="latest-news__item-content">
                <NewsCard :data="i" />
              </div>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
/* This is neat!! */
.row {
  margin-left: calc(-1 * var(--grid-gutter) / 4);
  margin-right: calc(-1 * var(--grid-gutter) / 4);
}

.latest-news {
  &--width-full {
    @media (--viewport-md-min) {
      position: relative;
      overflow: hidden;
      margin-right: calc(var(--grid-gutter-half) * -1);
    }
  }

  &__title {
    color: var(--theme-color);
    margin-bottom: 24px @(--sm) 44px;
  }

  &__card {
    padding-left: calc(var(--grid-gutter) / 4);
    padding-right: calc(var(--grid-gutter) / 4);
    margin-bottom: calc(var(--grid-gutter) / 2);

    &-item {
      height: 100%;

      :deep(figure),
      :deep(picture),
      :deep(img) {
        height: 100%;
      }
    }
  }

  /* Filthy Swiper styling for this component */
  &__swiper {
    padding: 0 0 80px @(--sm) 0 0 140px;
  }

  &__item-content {
    height: 100%;
  }

  :deep(.swiper-scrollbar-drag) {
    background: var(--color-primary);
  }

  :deep(
      .swiper-horizontal > .swiper-scrollbar,
      .swiper-scrollbar.swiper-scrollbar-horizontal
    ) {
    background-color: var(--color-primary-lighten-4);
  }

  :deep(.swiper-button-next:after) {
    color: var(--theme-color);
  }

  :deep(.swiper-button-prev:after) {
    color: var(--theme-color);
  }

  :deep(.swiper-horizontal > .swiper-scrollbar) {
    position: absolute;
    bottom: 82px;
    left: 0;
    width: calc(100% - 120px);
    height: 4px;
    margin-bottom: 0;

    @media (--viewport-sm-max) {
      bottom: 16px;
    }
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    top: auto;
    bottom: 64px;
    margin-bottom: 0;
    border-width: 2px;

    @media (--viewport-sm-max) {
      bottom: 0;
    }
  }

  :deep(.swiper-button-prev) {
    right: 56px;
  }
}
</style>
