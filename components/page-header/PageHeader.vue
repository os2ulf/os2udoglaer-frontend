<script setup lang="ts">
import { Navigation, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

const modules = [Navigation, Scrollbar, A11y];
const breakpoints = {
  768: {
    slidesPerView: 2,
  },
  992: {
    slidesPerView: 2,
  },
  1200: {
    slidesPerView: 3,
  },
};

const props = defineProps({
  pageBlockHeaderData: {
    type: Object,
    required: false,
  },
});
</script>

<template>
  <div v-if="props.pageBlockHeaderData" class="page-header__container">
    <div class="page-header">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-8 col-xl-7">
            <div class="page-header__content-wrapper">
              <h1 class="page-header__title">
                {{ props.pageBlockHeaderData?.field_title }}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div class="page-header__image-wrapper">
        <div class="page-header__image-container">
          <BaseImage
            v-if="pageBlockHeaderData?.field_background_image"
            :image="pageBlockHeaderData?.field_background_image"
            class="page-header__image"
          />
        </div>
      </div>
      <div
        class="page-header__card-container"
        v-if="pageBlockHeaderData?.field_paragraph_cards?.length > 0"
      >
        <div class="container">
          <div class="row">
            <div
              class="col-xs-12 col-sm-12 col-md-10 col-md-offset-2 col-lg-10 col-lg-offset-2"
            >
              <!-- carousel -->
              <Swiper
                :modules="modules"
                :slides-per-view="1"
                :space-between="30"
                :breakpoints="breakpoints"
                navigation
                :scrollbar="{ draggable: true }"
                class="page-header__swiper"
              >
                <SwiperSlide
                  v-for="item in props.pageBlockHeaderData
                    ?.field_paragraph_cards"
                  :key="item"
                  class="page-header__slide"
                >
                  <div class="page-header__item-content">
                    <PageHeaderCard :card-item="item" />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page-header {
  position: relative;
  padding-top: 36px;
  padding-bottom: 0;

  @media (min-width: 768px) {
    padding-bottom: 116px;
  }

  @media (min-width: 992px) {
    padding-top: 64px;
  }

  &__title {
    word-break: break-word;
  }

  &__container {
    background-color: var(--color-primary);
    transition: background-color 0.3s ease-in-out;
  }

  &__content-wrapper {
    color: var(--color-white);

    h1 {
      font-size: 38px;
      line-height: 1.1;
      margin-bottom: 24px;

      @media (min-width: 768px) {
        margin-bottom: 36px;
      }

      @media (min-width: 992px) {
        font-size: 48px;
      }

      @media (min-width: 1200px) {
        font-size: 58px;
      }
    }
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 24px;

    @media (min-width: 481px) {
      height: 320px;
    }

    @media (min-width: 768px) {
      height: 460px;
      margin-bottom: 0;
    }

    @media (min-width: 992px) {
      height: 560px;
    }
  }

  &__image-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;

    @media (min-width: 768px) {
      right: 16.66667%;
    }

    @media (min-width: 1400px) {
      right: calc(50% - (1632px / 12 * 4));
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;

    :deep(picture),
    :deep(img) {
      height: 100% !important;
    }
  }

  &__card-container {
    position: relative;
    bottom: auto;
    left: auto;
    width: 100%;

    @media (min-width: 768px) {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  &__item-content {
    height: 100%;
  }

  &__swiper {
    padding: 0 0 40px;

    @media (min-width: 768px) {
      padding: 0 0 140px;
    }
  }

  /* Filthy Swiper styling for this component */
  :deep(.swiper-wrapper) {
    @media (max-width: 767px) {
      flex-flow: column;
      transform: translate3d(0, 0, 0) !important;
    }
  }

  :deep(.swiper-slide) {
    @media (max-width: 767px) {
      margin-right: 0;
      margin-bottom: 24px;
    }
  }

  :deep(.swiper-scrollbar-drag) {
    background: var(--color-white);
  }

  :deep(
      .swiper-horizontal > .swiper-scrollbar,
      .swiper-scrollbar.swiper-scrollbar-horizontal
    ) {
    background-color: rgba(255, 255, 255, 0.4);
  }

  :deep(.swiper-horizontal > .swiper-scrollbar) {
    position: absolute;
    bottom: 82px;
    left: 0;
    width: calc(100% - 120px);
    height: 4px;
    margin-bottom: 0;

    @media (max-width: 767px) {
      display: none;
    }
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    top: auto;
    bottom: 64px;
    margin-bottom: 0;
    border-width: 2px;

    @media (max-width: 767px) {
      display: none;
    }

    svg {
      width: 15px;
      height: 15px;

      path {
        fill: var(--color-white);
      }
    }
  }

  :deep(.swiper-button-next) {
    right: 0;

    svg {
      margin-left: 3px;
    }
  }

  :deep(.swiper-button-prev) {
    right: 56px;
    left: auto;

    svg {
      margin-right: 3px;
    }
  }
}
</style>
