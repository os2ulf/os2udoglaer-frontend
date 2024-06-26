import { defineStore } from 'pinia';

export const useFooterDataStore = defineStore('footerData', () => {
  const { useRegion } = useRegionApi();
  const loading = ref(false);
  const footerData: any = ref(null);

  const getFooterData = async () => {
    loading.value = true;

    if (!footerData.value) {
      const { data } = await useAsyncData('footer', () => useRegion('footer'));

      footerData.value = data.value;
    }
    loading.value = false;
  };

  return { footerData, getFooterData, loading };
});
