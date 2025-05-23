<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:isOpen']);
const dialog = ref<HTMLDialogElement | null>(null);

const close = () => {
  emit('update:isOpen', false);
  dialog.value?.close();
};

const handleEscapeKey = (e) => {
  if (
    props.isOpen &&
    (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)
  ) {
    close();
  }
};

const scrollTopOffset = document.documentElement.scrollTop;

onMounted(() => {
  document.addEventListener('keyup', handleEscapeKey);
  document.body.style.top = `-${scrollTopOffset}px`;
  document.body.style.position = 'fixed';
  dialog.value?.showModal();
});

onBeforeUnmount(() => {
  dialog.value?.close();
});

onUnmounted(() => {
  document.removeEventListener('keyup', handleEscapeKey);
  document.body.style.top = '';
  document.body.style.position = 'relative';
  window.scrollTo(0, scrollTopOffset);
});
</script>

<template>
  <div v-if="isOpen" class="modal__overlay">
    <dialog ref="dialog" role="dialog" aria-modal="true">
      <div class="modal__content">
        <header class="modal__header">
          <button class="modal__button" @click="close" aria-label="Luk modal">
            <NuxtIcon class="the-modal__close-icon" name="close" />
          </button>
        </header>
        <main class="modal__body">
          <slot></slot>
        </main>
      </div>
    </dialog>
  </div>
</template>

<style lang="postcss" scoped>
.modal {
  &__overlay {
    color: var(--color-text);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: flex-start @(--sm) center;
    padding: 20px;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }

  &__header {
    top: 0;
    display: flex;
    justify-content: flex-end;
    padding: 15px;
    background: var(--color-white);
    z-index: 1;
  }

  &__content {
    background: var(--color-white);
    border-radius: 5px;
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 0 15px 30px;
  }

  &__button {
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;

    :deep(svg) {
      height: 24px;
      width: 24px;
    }
  }
}

dialog {
  position: relative;
  padding: 0 !important;
  max-width: 600px;
  width: 100%;
  max-height: 100vh @(--sm) 80vh;
  margin-top: 0 @(--sm) auto;
  margin-bottom: 0 @(--sm) auto;
  border-radius: 5px;
  border: none !important;
  box-shadow: 0 4px 10px 7px rgba(var(--color-primary-rgb), 0.2);
}
</style>
