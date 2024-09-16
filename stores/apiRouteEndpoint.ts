import { defineStore } from 'pinia';

export const useApiRouteStore = defineStore('useApiRouteStore', () => {
  const apiRouteEndpoint = ref('');

  const setApiRouteEndpoint = (value: string) => {
    apiRouteEndpoint.value = value;
  };

  return { apiRouteEndpoint, setApiRouteEndpoint };
});
