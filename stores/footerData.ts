import { defineStore } from 'pinia';

export const useFooterDataStore = defineStore('footerData', () => {
  const { useRegion } = useRegionApi();

  const loading = ref(false);
  const footerData = ref(null);

  const getFooterData = async () => {
    if (footerData.value) return;

    loading.value = true;

    try {
      footerData.value = await useRegion('footer');
    } finally {
      loading.value = false;
    }
  };

  return { footerData, getFooterData, loading };
});