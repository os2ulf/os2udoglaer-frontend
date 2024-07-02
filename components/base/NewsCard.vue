<script lang="ts" setup>
import { dateConversion } from '~/utils/dateConversion';
import { stripHtmlFromString } from '~/utils/stripHtml';
import { truncateString } from '~/utils/truncateString';

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

const cardBodyText: any = ref(stripHtmlFromString(props.data.body) || '');
</script>

<template>
  <div class="news-card" v-if="data">
    <ClientOnly>
      <NuxtLink
        class="news-card__wrapper news-card__link"
        aria-label="Link til nyhed"
        :to="data?.link"
      >
        <div class="news-card__image-wrapper">
          <div class="news-card__image">
            <BaseImage v-if="data.field_image" :image="data?.field_image" />
          </div>
          <div class="news-card__tag" v-if="data?.bundle_label">
            {{ data?.bundle_label }}
          </div>
        </div>
        <div class="news-card__content">
          <div class="news-card__date" v-if="data?.created">
            {{ dateConversion(data?.created) }}
          </div>

          <h4 class="news-card__title">{{ data?.label }}</h4>
          <div class="news-card__description" v-if="data?.body">
            {{ truncateString(cardBodyText, 85) }}
          </div>
        </div>

        <div class="news-card__footer-button">
          <NuxtLink
            :to="data.link"
            aria-label="Link til nyhed"
            class="news-card__button"
            >Læs nyheden</NuxtLink
          >
          <NuxtIcon class="news-card__button-icon" name="arrow-right" filled />
        </div>
      </NuxtLink>
    </ClientOnly>
  </div>
</template>

<style lang="postcss" scoped>
.news-card {
  display: flex;
  flex-direction: column;
  color: var(--theme-color);
  background-color: var(--color-white);
  border: 2px solid var(--color-primary-lighten-4);
  border-radius: 4px;
  height: 100%;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.1);
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 10px 10px rgba(var(--color-primary-rgb), 0.15);

    :deep(img) {
      opacity: 0.8;
      transform: scale(1.2);
      transition: transform 5s;
    }

    .news-card__footer-button {
      opacity: 0.8;
    }

    .news-card__button-icon {
      animation: transformArrow 0.5s ease-in-out alternate;
    }
  }

  :deep(img) {
    transition: opacity 0.3s ease-in-out;
    transition: transform 0.5s ease-in-out;
    opacity: 1;
  }

  &__wrapper {
    padding: 24px @(--sm) 32px;
    flex-direction: column;
    flex-grow: 1;
  }

  &__link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: var(--theme-color);
    height: 100%;
  }

  &__image {
    width: 100%;
    position: relative;

    :deep(figure),
    :deep(picture),
    :deep(img) {
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
      border-radius: 3px 0 0 3px;
    }
  }

  &__image-wrapper {
    position: relative;
    overflow: hidden;
  }

  &__tag {
    position: absolute;
    bottom: 8px;
    left: 8px;
    padding: 4px 8px;
    background-color: var(--color-primary-lighten-4);
    color: var(--color-primary-darken-3);
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-radius: 4px;
    font-weight: 500;
  }

  &__content {
    padding-top: 16px;
    flex-grow: 1;
    color: var(--color-tertiary);
  }

  &__date {
    color: var(--color-primary-darken-3);
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  &__title {
    padding-top: 8px;
    color: var(--color-tertiary);
    margin-bottom: 0;
  }

  &__description {
    padding-top: 8px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    :deep(p) {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__footer-button {
    padding-top: 22px @(--sm) 32px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid var(--color-primary);
    width: fit-content;
    margin-top: auto;

    a {
      text-decoration: none;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: var(--color-primary);
    background-color: transparent;
    border: none;
    cursor: pointer;

    padding: 0;
  }

  &__button-icon {
    margin-left: 8px;
    font-size: 24px;

    :deep(path) {
      stroke: var(--color-primary);
    }
  }
}
@keyframes transformArrow {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
