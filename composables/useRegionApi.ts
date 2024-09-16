import { useGetBackendDomain } from '~/composables/useGetBackendDomain';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';

export default function () {
  const useRegion = (region: string) => {
    const apiRouteStore = useApiRouteStore();
    const beEndpoint = useGetBackendDomain();

    apiRouteStore.setApiRouteEndpoint(beEndpoint);
    return UseBaseApi(apiRouteStore.apiRouteEndpoint, {
      params: {
        format: 'json',
        region,
      },
      keepalive: true,
    });
  };

  return {
    useRegion,
  };
}
