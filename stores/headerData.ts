import { defineStore } from 'pinia';

export const useHeaderDataStore = defineStore('headerData', () => {
  const { useRegion } = useRegionApi();
  const loading = ref(false);
  const headerData: any = ref(null);

  const getHeaderData = async () => {
    loading.value = true;

    if (!headerData.value) {
      const { data } = await useAsyncData('header', () => useRegion('header'));

      headerData.value = data.value;
    }
    loading.value = false;
  };

  return { headerData, getHeaderData, loading };
});
