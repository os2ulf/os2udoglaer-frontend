import { decodeBase64 } from '~/utils/base64';

export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const allRoutes = ref();
  const config = useRuntimeConfig().public;

  // setting the vars from platform
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

  console.log('PLATFORM SH ROUTES', allRoutes.value);

  const beEndpoint = config.API_BASE_URL;

  //

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

  return await $fetch<T>(path, {
    baseURL: config.API_BASE_URL,
    cache: 'no-cache',
    keepalive: true,
    ...mergedParamOptions,
  });
}
