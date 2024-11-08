<script setup lang="ts">
import { useModalStore } from '~~/stores/modal';

interface ModalData {
  title?: string;
  content?: string;
  video_overlay_text?: string;
  field_video_url?: {
    url: url;
  };
}

interface url {
  url: string;
}

const modalStore = useModalStore();

const isVisible = computed<boolean>(() => modalStore.isVisible);

const modalContent = computed<ModalData | null>(() => {
  return modalStore.modalData;
});

const handleEscapeKey = (e: KeyboardEvent) => {
  if (isVisible.value === true && e.key === 'Escape') {
    modalStore.hideModal();
  }
};

onMounted(() => {
  document.addEventListener('keyup', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keyup', handleEscapeKey);
});
</script>

<template>
  <Transition name="fade">
    <div
      v-show="isVisible"
      class="the-modal"
      @click.self="modalStore.hideModal"
    >
      <div
        class="the-modal__wrapper"
        :class="{
          'the-modal__wrapper--video': modalContent?.field_video_url?.url,
        }"
      >
        <div class="the-modal__header">
          <button class="the-modal__button-close" @click="modalStore.hideModal">
            <NuxtIcon class="the-modal__close-icon" name="close" />
          </button>
        </div>
        <div v-show="modalContent" class="the-modal__content-body">
          <h3 v-if="modalContent?.title">{{ modalContent?.title }}</h3>
          <div
            v-if="modalContent?.content"
            v-html="modalContent?.content"
          ></div>
          <div
            v-if="modalContent?.video_overlay_text"
            v-html="modalContent?.video_overlay_text"
          ></div>
        </div>

        <div v-if="modalContent?.field_video_url?.url">
          <NuxtLink
            :to="modalContent?.field_video_url?.url"
            target="_blank"
            class="the-modal__link"
          >
            {{ modalContent?.field_video_url?.url }}
          </NuxtLink>
        </div>
        <BaseButton
          v-if="modalContent?.field_video_url?.url"
          type="button"
          :button-data="{
            title: 'Se video',
            url: modalContent?.field_video_url?.url,
            target: '_blank',
          }"
          class="the-modal__button"
          @click="modalStore.hideModal"
        />
      </div>
    </div>
  </Transition>
</template>

<style lang="postcss">
.the-modal {
  color: var(--color-text);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);

  &__wrapper {
    position: relative;
    width: 90%;
    max-width: 600px;
    min-height: 330px;
    max-height: 90%;
    background-color: var(--color-white);
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 32px;
    transition: all 0.3s ease-in-out;

    &--video {
      justify-content: space-around;
    }
  }

  &__header {
    position: absolute;
    top: 0;
    right: 0;
    text-align: end;
  }

  &__button-close {
    padding: 15px;
    color: var(--color-text);
    white-space: nowrap;
    text-decoration: none;
    background: none;
    border: none;
  }

  &__button-cta {
    margin-top: 20px;
  }

  &__close-icon {
    width: 52px;
    height: 52px;
  }

  &__content-body {
    padding: 60px 30px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: left;
  }

  &__button {
    margin: 20px 0;
  }

  &__link {
    color: var(--color-text);
    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: var(--color-primary);
    }
  }

  svg {
    font-size: 30px;
  }
}
</style>
