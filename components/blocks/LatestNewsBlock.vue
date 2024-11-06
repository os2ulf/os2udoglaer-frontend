<script setup lang="ts">
import { Navigation, A11y, Autoplay, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const modules = [Navigation, Scrollbar, A11y, Autoplay];
const breakpoints = {
  0: {
    slidesPerView: 1.2,
  },
  480: {
    slidesPerView: 1.4,
  },
  768: {
    slidesPerView: 2.2,
  },
  992: {
    slidesPerView: 2.4,
  },
  1200: {
    slidesPerView: 3,
  },
  1400: {
    slidesPerView: 4,
  },
};

const props = defineProps({
  blockData: Object,
  sectionWidth: String,
});

const newsData = ref(props.blockData?.results);

const smartLabel = computed(() => {
  if (props.blockData?.label === '') {
    return 'Seneste nyheder';
  } else if (props.blockData?.label?.length > 0) {
    return props.blockData?.label;
  } else {
    return null;
  }
});
</script>

<template>
  <div
    class="latest-news"
    v-if="newsData.length > 0"
    :class="sectionWidth === 'section--width-full' ? 'container' : ''"
  >
    <div
      :class="
        props.sectionWidth === 'section--width-full'
          ? 'latest-news--width-full'
          : ''
      "
    >
      <div class="latest-news__carousel">
        <h2 class="latest-news__title" v-if="smartLabel">
          {{ smartLabel }}
        </h2>
        <ClientOnly>
          <Swiper
            :modules="modules"
            :breakpoints="breakpoints"
            :space-between="24"
            navigation
            :scrollbar="{
              draggable: false,
            }"
            class="latest-news__swiper"
            :class="newsData.length < 5 ? 'swiper-no-pagination' : ''"
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
      margin-right: calc(var(--grid-gutter-half) * -1);
    }

    :deep(.swiper) {
      overflow: visible;
    }
  }

  &__title {
    color: var(--theme-color);
    margin-bottom: 24px @(--sm) 44px;
    word-break: break-word;
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
    padding: 0 0 80px @(--md) 0 0 140px;

    &.swiper-no-pagination {
      @media (--viewport-xl-min) {
        padding: 0;
      }
    }
  }

  &__item-content {
    height: 100%;
  }

  :deep(.swiper-scrollbar-drag) {
    background: var(--theme-swiper-primary-color);
  }

  :deep(
      .swiper-horizontal > .swiper-scrollbar,
      .swiper-scrollbar.swiper-scrollbar-horizontal
    ) {
    background-color: var(--theme-swiper-secondary-color);
  }

  :deep(.swiper-button-next) {
    border-color: var(--theme-swiper-secondary-color);
    transition: border-color 0.3s ease;

    &:hover {
      border-color: var(--theme-swiper-primary-color);
    }

    &:after {
      color: var(--theme-swiper-primary-color);
    }
  }

  :deep(.swiper-button-prev) {
    border-color: var(--theme-swiper-secondary-color);
    transition: border-color 0.3s ease;

    &:hover {
      border-color: var(--theme-swiper-primary-color);
    }

    &:after {
      color: var(--theme-swiper-primary-color);
    }
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
