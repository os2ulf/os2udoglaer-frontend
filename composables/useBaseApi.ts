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
      host: beEndpoint,
    },
  };

  const mergedParamOptions = {
    ...opt,
    ...attachHostParam,
  };

  // Grab routes from platform sh var
  if (process.server && process.env.PLATFORM_ROUTES) {
    let platformRoutes = process.env.PLATFORM_ROUTES;
    allRoutes.value = decodeBase64(platformRoutes);
    // console.log('PLATFORM SH ROUTES, QUERYING FE server', allRoutes);
  } else {
    if (process.env.PLATFORM_ROUTES) {
      let platformRoutes = process.env.PLATFORM_ROUTES;
      allRoutes.value = decodeBase64(platformRoutes);
      // console.log('PLATFORM SH ROUTES, QUERYING FE client', allRoutes);
    } else {
      allRoutes.value = null;
    }
  }

  // Detect current FE domain
  const currentFEdomain = ref(useGetCurrentDomain());

  // if (currentFEdomain.value === 'https://localhost:3000') {}

  console.log('currentFEdomain', currentFEdomain.value);

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
