import { defineStore } from 'pinia';

export const useApiRouteStore = defineStore('useApiRouteStore', () => {
  const apiRouteEndpoint = ref<string | null>('');

  const setApiRouteEndpoint = (value: string | null) => {
    apiRouteEndpoint.value = value;
  };

  return { apiRouteEndpoint, setApiRouteEndpoint };
});
