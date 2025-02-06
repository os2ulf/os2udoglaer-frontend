import { useApiRouteStore } from '~/stores/apiRouteEndpoint';
import { useGetBackendDomain } from '~/composables/useGetBackendDomain';

export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const attachHostParam = {
    params: {
      ...opt.params,
    },
  };

  const mergedParamOptions = {
    ...opt,
    ...attachHostParam,
  };

  const beEndpoint = useGetBackendDomain();
  const apiRouteStore = useApiRouteStore();

  apiRouteStore.setApiRouteEndpoint(beEndpoint);

  return await $fetch<T>(path, {
    baseURL: apiRouteStore.apiRouteEndpoint,
    cache: 'no-cache',
    keepalive: true,
    ...mergedParamOptions,
  });
}
