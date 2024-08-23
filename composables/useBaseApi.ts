import { decodeBase64 } from '~/utils/base64';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';

export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const allRoutes = ref();
  const config = useRuntimeConfig().public;
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

    // Extract URLs where "upstream" is "backend" and filter out the unwanted endpoint
    const backendUrls = Object.keys(allRoutes.value).filter(
      (url) =>
        allRoutes.value[url]?.upstream === 'backend' &&
        url !==
          'https://api.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/' &&
        url !== 'api.os2udoglaer.dk',
    );

    return backendUrls.length > 0 ? backendUrls : null;
  };

  const onlyBEroutes = ref(extractBEroutes());

  // Detect current FE domain
  const currentFEdomain = ref(useGetCurrentDomain());
  console.log('FE DOMAIN that is querying:', currentFEdomain.value);

  // Extract the base domain to handle both staging and production
  const getDomainName = (url: string) => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, '');
  };

  const assignBEendpoint = () => {
    const currentDomain = getDomainName(currentFEdomain.value);
    let selectedBE = null;

    // Iterate through the backend routes and match the correct one based on the FE domain
    for (const route of onlyBEroutes.value) {
      const backendDomain = getDomainName(route);

      // Match the correct domain, taking "api." prefix into account
      if (currentDomain.includes(backendDomain.replace('api.', ''))) {
        selectedBE = route;
        break;
      }
    }

    if (!selectedBE) {
      throw new Error('No matching BE route found for the current FE domain');
    }

    beEndpoint.value = selectedBE;
    console.log('FINAL beEndpoint:', beEndpoint.value);
  };

  // Development endpoints for local or staging testing
  const devEndpoint = ref(
    'https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site',
  );
  const localHostDevEnv = ref('https://localhost:3000');

  if (currentFEdomain.value === localHostDevEnv.value) {
    beEndpoint.value = devEndpoint.value;
  } else {
    assignBEendpoint();
  }

  return await $fetch<T>(path, {
    baseURL: beEndpoint.value,
    cache: 'no-cache',
    keepalive: true,
    ...mergedParamOptions,
  });
}
