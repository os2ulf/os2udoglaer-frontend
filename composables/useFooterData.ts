export function useFooterData() {
  const { useRegion } = useRegionApi();

  const { data, pending, error } = useAsyncData('footer', () =>
    useRegion('footer')
  );

  return {
    footerData: data,
    loading: pending,
    error,
  };
}