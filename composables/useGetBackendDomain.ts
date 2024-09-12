import { decodeBase64 } from '~/utils/base64';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';
import { excludeEndpoints } from '~/config/excludedEndpoints';

export function useGetBackendDomain() {
  const allRoutes = ref<Record<string, any> | null>(null);
  const beEndpoint = ref<string | null>(null);
  const devEnv = ref<string | null>('https://localhost:3000');
  const config = useRuntimeConfig();

  if (process.env.PLATFORM_ROUTES) {
    try {
      const encodedPlatformRoutes = process.env.PLATFORM_ROUTES;
      const decodedRoutes = decodeBase64(encodedPlatformRoutes);
      allRoutes.value = JSON.parse(decodedRoutes);
    } catch (error) {
      console.error('Error decoding or parsing PLATFORM_ROUTES:', error);
      allRoutes.value = null;
    }
  }

  const extractBackendRoutes = () => {
    if (!allRoutes.value) {
      return null;
    }

    const backendUrls = Object.keys(allRoutes.value).filter(
      (url) =>
        allRoutes.value![url]?.upstream === 'backend' &&
        !excludeEndpoints.includes(url),
    );

    return backendUrls.length > 0 ? backendUrls : null;
  };

  const onlyBackendRoutes = ref(extractBackendRoutes());

  const currentFrontendDomain = ref(useGetCurrentDomain());

  const getDomainName = (url: string) => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, '');
  };

  const assignBackendEndpoint = () => {
    const currentDomain = getDomainName(currentFrontendDomain.value);
    let selectedBackend = null;

    for (const route of onlyBackendRoutes.value!) {
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

    beEndpoint.value = selectedBackend.endsWith('/')
      ? selectedBackend.slice(0, -1)
      : selectedBackend;
  };

  // Change BE endpoint you want to develop on here:
  if (currentFrontendDomain.value === devEnv.value) {
    //  'https://api.ulfiaarhus.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site';
    // https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site
    beEndpoint.value =
      config.LOCAL_API_BASE_URL || 'https://api.ulfiaarhus.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site';
  } else {
    const apiRouteStore = useApiRouteStore();

    if (apiRouteStore.apiRouteEndpoint === '') {
      assignBackendEndpoint();
    } else {
      beEndpoint.value = apiRouteStore.apiRouteEndpoint;
    }
  }

  // Return the backend domain
  return beEndpoint.value;
}
