import { decodeBase64 } from '~/utils/base64';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';
import { excludeEndpoints } from '~/config/excludedEndpoints';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';

export function useGetBackendDomain() {
  let allRoutes: Record<string, any> | null = null;
  let beEndpoint: string | null = null;
  const devEnv = 'https://localhost:3000';

  if (process.env.PLATFORM_ROUTES) {
    try {
      const encodedPlatformRoutes = process.env.PLATFORM_ROUTES;
      const decodedRoutes = decodeBase64(encodedPlatformRoutes);
      allRoutes = JSON.parse(decodedRoutes);
    } catch (error) {
      console.error('Error decoding or parsing PLATFORM_ROUTES:', error);
      allRoutes = null;
    }
  }

  const extractBackendRoutes = () => {
    if (!allRoutes) return null;
    const backendUrls = Object.keys(allRoutes).filter(
      (url) =>
        allRoutes![url]?.upstream === 'backend' &&
        !excludeEndpoints.includes(url),
    );
    return backendUrls.length > 0 ? backendUrls : null;
  };

  const onlyBackendRoutes = extractBackendRoutes();
  const currentFrontendDomain = useGetCurrentDomain();

  const getDomainName = (url: string) =>
    new URL(url).hostname.replace(/^www\./, '');

  const assignBackendEndpoint = () => {
    if (!onlyBackendRoutes) return;

    const currentDomain = getDomainName(currentFrontendDomain);
    let selectedBackend = null;

    for (const route of onlyBackendRoutes) {
      const backendDomain = getDomainName(route);
      if (currentDomain.includes(backendDomain.replace('api.', ''))) {
        selectedBackend = route;
        break;
      }
    }

    if (!selectedBackend) {
      throw new Error(
        'No matching backend route found for the current frontend domain',
      );
    }

    beEndpoint = selectedBackend.endsWith('/')
      ? selectedBackend.slice(0, -1)
      : selectedBackend;
  };

  if (currentFrontendDomain === devEnv) {
    beEndpoint =
      'https://api.ulfiaarhus.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site';
  } else {
    const apiRouteStore = useApiRouteStore();
    if (!apiRouteStore.apiRouteEndpoint) {
      assignBackendEndpoint();
    } else {
      beEndpoint = apiRouteStore.apiRouteEndpoint;
    }
  }

  return beEndpoint;
}
