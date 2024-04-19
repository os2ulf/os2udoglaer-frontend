import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', () => {
  const isVisible = ref(false);
  const dynamicComponent = ref(null);

  const showModal = (componentName: any) => {
    isVisible.value = true;
    dynamicComponent.value = markRaw(componentName);
    document.body.style.overflow = 'hidden';
  };

  const hideModal = () => {
    isVisible.value = false;
    document.body.style.overflow = 'auto';

    setTimeout(() => {
      dynamicComponent.value = null;
    }, 400);
  };

  return {
    isVisible,
    showModal,
    hideModal,
    dynamicComponent,
  };
});
