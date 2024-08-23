import { useApiRouteStore } from '~/stores/apiRouteEndpoint';
import { decodeBase64 } from '~/utils/base64';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';

export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const allRoutes = ref();
  const beEndpoint = ref();

  const attachHostParam = {
    params: {
      ...opt.params,
    },
  };

  const mergedParamOptions = {
    ...opt,
    ...attachHostParam,
  };

  // Decode and parse PLATFORM_ROUTES environment variable
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

  // Extract only BE-API routes, filtering out the unwanted endpoint
  const extractBEroutes = () => {
    if (!allRoutes.value) {
      return null;
    }

    // excluding 'data-well' endpoints that dont belong to any municipality, and some of them a plain wrong.
    const excludeEndpoints = [
      'https://api.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
      'https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
      'https://api.os2udoglaer.dk/',
      'https://api.api.os2udoglaer.dk/',
    ];

    // Extract URLs where "upstream" is "backend" and filter out the unwanted endpoints
    const backendRoutes = Object.entries(allRoutes.value)
      .filter(
        ([url, routeData]) =>
          routeData.upstream === 'backend' && !excludeEndpoints.includes(url),
      )
      .map(([url, routeData]) => ({
        url, // The route URL
        productionUrl: routeData.production_url,
      }));

    return backendRoutes.length > 0 ? backendRoutes : null;
  };

  const onlyBEroutes = ref(extractBEroutes());
  console.log(
    'onlyBEroutes (extracted):',
    onlyBEroutes.value,
    typeof onlyBEroutes.value,
  );

  // console.log('BE ROUTES:', onlyBEroutes.value);

  // Detect current FE domain
  const currentFEdomain = ref(useGetCurrentDomain());
  // console.log('FE DOMAIN that is querying:', currentFEdomain.value);

  // Extract the base domain to handle both staging and production
  const getDomainName = (url: string) => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, '');
  };

  const assignBEendpoint = () => {
    const apiRouteStore = useApiRouteStore();

    const currentDomain = getDomainName(currentFEdomain.value);
    let selectedBE = null;

    // Iterate through the backend routes and match the correct one based on the FE domain
    for (const route of onlyBEroutes.value) {
      const backendDomain = getDomainName(route);

      // Match the correct domain, taking "api." prefix into account by removing it.
      if (currentDomain.includes(backendDomain.replace('api.', ''))) {
        selectedBE = route;
        break;
      }
    }

    if (!selectedBE) {
      throw new Error('No matching BE route found for the current FE domain');
    }

    beEndpoint.value = selectedBE;
    apiRouteStore.setApiRouteEndpoint(beEndpoint.value);
    // console.log('FINAL beEndpoint:', beEndpoint.value);
  };

  // Development endpoints for local or staging testing
  const devEndpoint = ref(
    'https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site',
  );
  const localHostDevEnv = ref('https://localhost:3000');

  if (currentFEdomain.value === localHostDevEnv.value) {
    const apiRouteStore = useApiRouteStore();
    beEndpoint.value = devEndpoint.value;
    apiRouteStore.setApiRouteEndpoint(beEndpoint.value);
  } else {
    const apiRouteStore = useApiRouteStore();

    if (apiRouteStore.apiRouteEndpoint === '') {
      assignBEendpoint();
    }
  }

  const apiRouteStore = useApiRouteStore();

  return await $fetch<T>(path, {
    baseURL: apiRouteStore.apiRouteEndpoint,
    cache: 'no-cache',
    keepalive: true,
    ...mergedParamOptions,
  });
}

// TODO: Next up, add on right BE endpoint from the store to all components that do fetches in the components + search page
