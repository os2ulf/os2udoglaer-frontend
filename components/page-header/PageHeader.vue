<script setup lang="ts">
import { Navigation, Scrollbar, A11y } from 'swiper';
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
    <div
      class="section section--spacing-top-medium section--spacing-bottom-none container"
    >
      <div class="page-header">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="page-header__content-wrapper">
              <h1>
                {{ props.pageBlockHeaderData?.field_title }}
              </h1>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="page-header__image-container">
              <img
                class="page-header__image"
                :src="pageBlockHeaderData?.field_background_image?.src"
              />
              <!-- TODO: When images transformed use the one below -->
              <!-- <BaseImage
                class="page-header__image"
                v-if="pageBlockHeaderData?.field_background !== null"
                :image="pageBlockHeaderData?.field_background"
                :component-type-class="pageBlockHeaderData?.bundle"
                /> -->
            </div>

            <div
              class="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 page-header__card-container"
            >
              <!-- carousel -->
              <div
                class="page-header__cards"
                v-if="
                  props.pageBlockHeaderData?.field_paragraph_cards?.length > 3
                "
              >
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

              <!-- Simple cards up to 3 -->
              <div class="page-header__cards-simple" v-else>
                <div class="page-header__simple-cards-wrapper">
                  <div
                    v-for="item in props.pageBlockHeaderData
                      ?.field_paragraph_cards"
                    class="page-header__simple-card"
                    :key="item"
                  >
                    <PageHeaderCard :card-item="item" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page-header {
  padding-top: 36px;

  &__container {
    background-color: var(--color-primary);
  }

  &__content-wrapper {
    color: var(--color-white);

    h1 {
      line-height: 66px;
    }
  }

  &__image-container {
    position: relative;
    overflow: hidden;
  }

  &__image {
    padding-top: 10px @(--sm) 36px;
    margin-bottom: 0 @(--sm) 116px;
    z-index: 9;
  }

  &__cards {
    position: static @(--sm) relative;
    bottom: 0 @(--sm) 435px;
    height: auto @(--sm) 0;
  }

  &__cards-simple {
    position: static @(--sm) relative;
    bottom: 0 @(--sm) 370px;
    height: auto @(--sm) 0;

    @media (--viewport-sm-max) {
      padding-top: 24px;
      margin-bottom: 24px;
    }
  }

  &__simple-cards-wrapper {
    display: flex;
    flex-wrap: wrap;

    .page-header__simple-card {
      width: 100% @(--sm) 33.3333%;
      padding-right: 0 @(--sm) 12px;
      padding-left: 0 @(--sm) 12px;

      &:first-child {
        padding-left: 0;
      }

      &:nth-child(3n) {
        padding-right: 0;
      }

      @media (--viewport-sm-max) {
        &:not(:first-child) {
          padding-top: 24px;
        }
      }
    }

    :deep(.page-header-card__description) {
      @media (--viewport-sm-max) {
        display: none;
      }
    }

    :deep(.page-header-card__item) {
      @media (--viewport-sm-max) {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    :deep(.page-header-card__link) {
      @media (--viewport-sm-max) {
        padding-top: 0;
      }
    }
  }

  &__item-content {
    height: 100%;
  }

  @media (--viewport-sm-max) {
    :deep(.page-header__card-container) {
      padding: 0;
    }
  }

  /* Filthy Swiper styling for this component */
  :deep(.swiper-scrollbar-drag) {
    background: var(--color-white);
  }

  :deep(
      .swiper-horizontal > .swiper-scrollbar,
      .swiper-scrollbar.swiper-scrollbar-horizontal
    ) {
    background-color: rgba(255, 255, 255, 0.4);
  }

  :deep(.swiper-button-next:after) {
    color: var(--color-white);
  }

  :deep(.swiper-button-prev:after) {
    color: var(--color-white);
  }

  :deep(.swiper-horizontal > .swiper-scrollbar) {
    @media (--viewport-xs-max) {
      width: 70%;
      margin-bottom: 35px;
    }

    @media (--viewport-sm-min) {
      width: 83%;
      margin-bottom: 35px;
    }

    @media (--viewport-md-min) {
      width: 82%;
      margin-bottom: 51px;
    }

    @media (--viewport-lg-min) {
      width: 88%;
      margin-bottom: 37px;
    }

    @media (--viewport-xl-min) {
      width: 90%;
      margin-bottom: 46px;
    }
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    @media (--viewport-xs-max) {
      top: 84%;
    }

    @media (--viewport-sm-min) {
      top: 85%;
    }

    @media (--viewport-md-min) {
      top: 81%;
    }

    @media (--viewport-lg-min) {
      top: 85%;
    }

    @media (--viewport-xl-min) {
      top: 83%;
    }
  }
}
</style>
