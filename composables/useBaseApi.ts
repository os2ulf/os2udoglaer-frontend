import { useApiRouteStore } from '~/stores/apiRouteEndpoint';
import { useGetBackendDomain } from '~/composables/useGetBackendDomain';

export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const beEndpoint = useGetBackendDomain();
  const apiRouteStore = useApiRouteStore();

  apiRouteStore.setApiRouteEndpoint(beEndpoint);

  const { params, query, ...requestOptions } = opt;
  const requestFetch = useRequestFetch();
  return await requestFetch<T>('/api/content', {
    cache: 'no-cache',
    ...requestOptions,
    query: { ...params, ...query, path },
  });
}
