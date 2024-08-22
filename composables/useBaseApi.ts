export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const config = useRuntimeConfig().public;

  if (typeof window === 'undefined') {
    console.log(
      'trying to get from env',
      process.env.PLATFORM_ROUTES,
      process.env.VITE_PLATFORM_ROUTES,
    );

    // return process.env.VITE_BASE_URL;
  } else {
    console.log(
      'trying to get from env',
      process.env.PLATFORM_ROUTES,
      process.env.VITE_PLATFORM_ROUTES,
    );
  }

  const attachHostParam = {
    params: {
      ...opt.params,
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
