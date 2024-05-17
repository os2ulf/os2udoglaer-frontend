<script setup lang="ts">
import { Navigation, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const modules = [Navigation, Scrollbar, A11y];
const breakpoints = {
  768: {
    slidesPerView: 2,
  },
  992: {
    slidesPerView: 3,
  },
  1200: {
    slidesPerView: 4.3,
  },
};

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },

  layoutType: {
    type: String,
    required: false,
    default: 'flex',
    validator(value: string) {
      // The passed prop value must match one of these strings
      return ['flex', 'carousel'].includes(value);
    },
  },
});
</script>

<template>
  <div class="video-component">
    <div class="container">
      <div class="row">
        <!-- layout type = flex -->
        <div
          class="video-component__layout-flex"
          v-if="props.layoutType === 'flex' && data?.videoArr?.length == 1"
        >
          <div
            class="col-xs-12 col-sm-12 col-md-6 video-component__layout-flex__remove-padding"
          >
            <VideoContent
              class="video-component__layout-flex__video-content"
              v-if="data.videoTitle || data.videoDescription"
              :data="{
                videoTitle: data.videoTitle,
                videoDescription: data.videoDescription,
              }"
            />
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-6 video-component__layout-flex__remove-padding"
          >
            <VideoPlayer v-if="data?.videoArr" :videoArr="data.videoArr" />
          </div>
        </div>

        <!-- layout type = carousel -->
        <div
          v-else-if="
            props.layoutType === 'carousel' && data?.videoArr?.length > 1
          "
          class="col-xs-12 col-sm-12 col-md-8 video-component__layout-carousel__remove-padding video-component__layout-carousel"
        >
          <div>
            <VideoContent
              v-if="data.videoTitle || data.videoDescription"
              :data="{
                videoTitle: data.videoTitle,
                videoDescription: data.videoDescription,
              }"
            />
          </div>

          <div
            class="col-xs-12 col-sm-12 col-md-12 video-component__layout-carousel__remove-padding"
          >
            <Swiper
              :modules="modules"
              :slides-per-view="1"
              :space-between="30"
              :breakpoints="breakpoints"
              navigation
              :scrollbar="{ draggable: true }"
              class="video-component__layout-carousel__swiper"
            >
              <SwiperSlide
                v-for="item in data.videoArr"
                :key="item.id"
                class="video-component__layout-carousel__slide"
              >
                <VideoPlayer :videoArr="item" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.video-component {
  &__layout-flex {
    display: grid @(--md) flex;

    &__remove-padding {
      padding: 0;
    }

    &__video-content {
      padding-top: 0 @(--sm) 36px;
      padding-right: 0 @(--sm) 20px @(--md) 20px @(--lg) 0;
    }
  }

  &__layout-carousel {
    display: contents;

    &__title {
      line-height: 48px;
    }

    &__remove-padding {
      padding: 0;
    }
  }
}
</style>
