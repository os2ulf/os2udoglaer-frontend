import { Transition } from 'nuxt/dist/app/compat/capi';
<script setup lang="ts">
import { useModalStore } from '~~/stores/modal';
const modalStore = useModalStore();

const isVisible = computed(() => modalStore.isVisible);

const dynamicComponent = computed(() => {
  return modalStore.dynamicComponent;
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
  <Transition name="fade-in">
    <div v-show="isVisible" class="the-modal">
      <div class="the-modal__content">
        <div class="the-modal__header">
          <button class="the-modal__button-close" @click="modalStore.hideModal">
            <NuxtIcon name="close" />
          </button>
        </div>
        <div v-if="dynamicComponent" class="the-modal__content-body">
          <component :is="dynamicComponent" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="postcss">
.the-modal {
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

  &__content {
    position: relative;
    width: 90% @(--md) 50%;
    min-height: 80% @(--md) 600px;
    max-height: 90vh @(--sm) 70vh;
    overflow: auto;
    background-color: var(--color-white);
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
    font-size: 20px;
    white-space: nowrap;
    text-decoration: none;
    background: none;
    border: none;
  }

  &__content-body {
    padding: 30px;
  }
}
</style>
