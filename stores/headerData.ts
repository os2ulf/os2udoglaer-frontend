import { defineStore } from 'pinia';

export const useHeaderDataStore = defineStore('headerData', () => {
  const { useRegion } = useRegionApi();

  const loading = ref(false);
  const headerData = ref(null);

  const getHeaderData = async () => {
    if (headerData.value) return;

    loading.value = true;

    try {
      headerData.value = await useRegion('header');
    } finally {
      loading.value = false;
    }
  };

  return { headerData, getHeaderData, loading };
});