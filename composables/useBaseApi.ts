import { decodeBase64 } from '~/utils/base64';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';
import { all } from 'axios';

export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const allRoutes = ref();
  const config = useRuntimeConfig().public;
  const beEndpoint = ref(config.API_BASE_URL);

  const attachHostParam = {
    params: {
      ...opt.params,
    },
  };

  const mergedParamOptions = {
    ...opt,
    ...attachHostParam,
  };

  // Grab routes from platform sh enc. var and decode 'em
  if (process.server && process.env.PLATFORM_ROUTES) {
    let encodedPlatformRoutes = process.env.PLATFORM_ROUTES;
    allRoutes.value = decodeBase64(encodedPlatformRoutes);
  } else {
    if (process.env.PLATFORM_ROUTES) {
      let encodedPlatformRoutes = process.env.PLATFORM_ROUTES;
      allRoutes.value = decodeBase64(encodedPlatformRoutes);
    } else {
      allRoutes.value = null;
    }
  }

  console.log('allRoutes type of', typeof allRoutes.value);
  // extract only BE-API routes
  const extractBEroutes = () => {
    if (!allRoutes.value) {
      return null;
    }

    // Extract URLs where "upstream" is "backend"
    const backendUrls = Object.keys(allRoutes.value).filter(
      (url) => allRoutes.value[url]?.upstream === 'backend',
    );

    return backendUrls.length > 0 ? backendUrls : null;
  };

  const onlyBEroutes = ref(extractBEroutes());
  console.log('extracted BE ROUTES', onlyBEroutes.value);

  // Detect current FE domain
  const currentFEdomain = ref(useGetCurrentDomain());

  // the data well endpoint (access to all of data supposedly)
  const devEndpoint = ref(
    'https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site',
  );

  if (currentFEdomain.value === 'https://localhost:3000') {
    beEndpoint.value = devEndpoint.value;
  } else {
    //
  }

  // e.g. returns this from the server: currentFEdomain https://ulfiaarhus.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site
  // or currentFEdomain https://aabenaalborg.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site

  // We need to know the current FE domain user is accessing to get the right BE domain
  // Find the right matching route from allRoutes and assign it to be the BE endpoint

  //

  return await $fetch<T>(path, {
    baseURL: beEndpoint.value,
    cache: 'no-cache',
    keepalive: true,
    ...mergedParamOptions,
  });
}
