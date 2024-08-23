import { decodeBase64 } from '~/utils/base64';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';

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

  // console.log('allRoutes type of', typeof allRoutes.value, allRoutes.value);
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

  // Detect current FE domain
  const currentFEdomain = ref(useGetCurrentDomain());
  console.log('FE DOMAIN thats qurying', currentFEdomain.value);

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

      if (currentDomain.includes(backendDomain.replace('api.', ''))) {
        selectedBE = route;
        // console.log('if true selectedBE = route', selectedBE);

        break;
      }
    }

    if (!selectedBE) {
      throw new Error('No matching BE route found for the current FE domain');
    }

    beEndpoint.value = selectedBE;
    console.log('FINAL beEndpoint', beEndpoint.value);
  };

  // the 'datawell' endpoint (access to all of data supposedly)
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

// TODO: Figure out how to match these in a good way.
// Seems like adding api. in front in not a bad idea...
// lets see what gpt has to say about it

// POSSIBLE FE DOMAINS
// https://ulfiaarhus.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site
// https://aabenaalborg.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site

// extracted BE ROUTES [
//   'https://api.aabenaalborg.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.klcviborg.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.laeringsportalenskive.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.mitvadehav.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.rum.thisted.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.ude.nu.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.udoglaer.randers.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.udoglaer.vejle.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.udsynmodarbejdsliv.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.ulfiaarhus.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://api.ungegarantien.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/',
//   'https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site/'
// ]
