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

onMounted(() => {
  document.addEventListener('keyup', handleEscapeKey);
  document.body.style.overflow = 'hidden';
  dialog.value?.showModal();
});

onBeforeUnmount(() => {
  dialog.value?.close();
});

onUnmounted(() => {
  document.removeEventListener('keyup', handleEscapeKey);
  document.body.style.overflow = 'auto';
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
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 0 @(--sm) 20px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__header {
    display: flex;
    justify-content: flex-end;
    font-size: 30px;
    color: var(--color-text);
    background: var(--color-white);
    padding-bottom: 15px;
  }

  &__content {
    background: var(--color-white);
    padding: 15px @(--sm) 30px;

    overflow-y: auto;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }

  &__button {
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
  }

  dialog:open {
    opacity: 1;
    transition: opacity 0.3s ease-in;
  }
}

dialog {
  border: none !important;
  padding: 0 !important;
  border-radius: 5px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.2);
  width: 100%;
  max-width: 600px;
  position: relative;
  max-height: 100vh @(--sm) 80vh;
}
</style>
