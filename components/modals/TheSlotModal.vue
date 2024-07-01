<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:isOpen']);

const close = () => {
  emit('update:isOpen', false);
};

const handleEscapeKey = (e) => {
  if (e.key === 'Escape') {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keyup', handleEscapeKey);
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.removeEventListener('keyup', handleEscapeKey);
  document.body.style.overflow = 'auto';
});
</script>

<template>
  <div v-if="isOpen" class="modal__overlay">
    <div class="modal__content">
      <header class="modal__header">
        <button class="modal__button" @click="close">
          <NuxtIcon class="the-modal__close-icon" name="close" />
        </button>
      </header>
      <main class="modal__body">
        <slot></slot>
      </main>
    </div>
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
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &__header {
    display: flex;
    justify-content: flex-end;
    font-size: 30px;
    color: var(--color-text);
  }

  &__content {
    background: var(--color-white);
    padding: 30px;
    border-radius: 5px;
    width: 100% @(--sm) 600px;
    min-height: 100% @(--sm) 690px;
    max-width: 100%;
    box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.2);
  }

  &__button {
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
