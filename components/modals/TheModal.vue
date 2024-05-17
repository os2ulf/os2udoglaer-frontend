<script setup lang="ts">
import { useModalStore } from '~~/stores/modal';
const modalStore = useModalStore();

const isVisible = computed(() => modalStore.isVisible);

const modalContent = computed(() => {
  return modalStore.modalData;
});

// listen to escape key
const handleEscapeKey = (e) => {
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
      <div class="the-modal__wrapper">
        <div class="the-modal__header">
          <button class="the-modal__button-close" @click="modalStore.hideModal">
            <NuxtIcon class="the-modal__close-icon" name="close" />
          </button>
        </div>
        <div v-show="modalContent" class="the-modal__content-body">
          <p>
            {{ modalContent?.video_overlay_text }}
          </p>

          <NuxtLink
            class="button button--primary the-modal__button-cta"
            :to="modalContent?.field_video_url?.url"
            target="_blank"
          >
            Se video
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="postcss">
.the-modal {
  color: var(--color-tertiary);
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
    max-width: 600px; /* Adjust width as needed */
    min-height: 400px;
    max-height: 90%;
    background-color: var(--color-white);
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center content vertically */
    align-items: center; /* Center content horizontally */
    transition: all 0.3s ease-in-out;
  }

  &__header {
    position: absolute;
    top: 0;
    right: 0;
    text-align: end;
  }

  &__button-close {
    padding: 15px;
    color: var(--color-tertiary);
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
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  svg {
    font-size: 30px;
  }
}
</style>
