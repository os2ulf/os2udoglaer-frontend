import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', () => {
  const isVisible = ref(false);
  const modalData = ref(null);

  const showModal = (modalContent: any) => {
    isVisible.value = true;
    modalData.value = modalContent;
    console.log(modalData.value, modalContent);

    document.body.style.overflow = 'hidden';
  };

  const hideModal = () => {
    isVisible.value = false;
    document.body.style.overflow = 'auto';

    setTimeout(() => {
      modalData.value = null;
    }, 400);
  };

  return {
    isVisible,
    showModal,
    hideModal,
    modalData,
  };
});
