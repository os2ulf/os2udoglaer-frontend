import { defineStore } from 'pinia';

export const useSettingsDataStore = defineStore('settingsData', () => {
  const { useRegion } = useRegionApi();

  const loading = ref(false);
  const settingsData: any = ref(null);
  const isHeaderFixed = ref(false);

  // non-reactive holders for scripts (never serialized)
  let cookieScript: string | null = null;
  let trackingScript: string | null = null;

  const getSettingsData = async () => {
    loading.value = true;

    if (!settingsData.value) {
      const { data } = await useAsyncData('settings', () =>
        useRegion('settings'),
      );

      const raw = data.value.settings;

      // ✨ EXTRACT SCRIPTS BEFORE THEY TOUCH PINIA
      cookieScript = raw.site_cookie_script ?? null;
      trackingScript = raw.site_tracking_script ?? null;

      // ✨ REMOVE THEM FROM REACTIVE STATE
      delete raw.site_cookie_script;
      delete raw.site_tracking_script;

      settingsData.value = raw;
    }

    loading.value = false;
  };

  // accessors (client only)
  const getCookieScript = () => cookieScript;
  const getTrackingScript = () => trackingScript;

  const setSettingsData = (value: Object) => {
    settingsData.value = value;
  };

  const setIsHeaderFixed = (value: boolean) => {
    isHeaderFixed.value = value;
  };

  return {
    settingsData,
    getSettingsData,
    getCookieScript,
    getTrackingScript,
    loading,
    isHeaderFixed,
    setIsHeaderFixed,
  };
});