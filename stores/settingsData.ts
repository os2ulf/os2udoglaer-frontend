import { defineStore } from 'pinia';

export const useSettingsDataStore = defineStore('settingsData', () => {
  const { useRegion } = useRegionApi();
  const loading = ref(false);
  const settingsData: any = ref(null);
  const isHeaderFixed = ref(false);

  const getSettingsData = async () => {
    loading.value = true;

    if (!settingsData.value) {
      const { data } = await useAsyncData('settings', () =>
        useRegion('settings'),
      );
      settingsData.value = data.value.settings;
    }
    loading.value = false;
  };

  const setIsHeaderFixed = (value: boolean) => {
    isHeaderFixed.value = value;
  };

  return {
    settingsData,
    getSettingsData,
    loading,
    isHeaderFixed,
    setIsHeaderFixed,
  };
});
