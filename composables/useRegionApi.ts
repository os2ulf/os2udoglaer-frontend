export default function () {
  const useRegion = (region: string) => {
    const config = useRuntimeConfig().public;

    return UseBaseApi(config.API_BASE_URL, {
      params: {
        format: 'json',
        region,
      },
      keepalive: true,
    });
  };

  return {
    useRegion,
  };
}
