// import { useAuthStore } from '~~/stores/auth';

export async function UseBaseApi<T>(path: string, opt = {}) {
  const config = useRuntimeConfig().public;
  const headers: any = {};

  // const authStore = useAuthStore();

  // const { accessToken } = storeToRefs(authStore);

  // if (accessToken) {
  //   headers.Authorization = `Bearer ${accessToken.value}`;
  // }

  return await $fetch<T>(path, {
    headers,
    baseURL: config.API_BASE_URL,
    cache: 'no-cache',
    keepalive: true,
    ...opt,
  });
}
