export function useSearchUrlState() {
  const route = useRoute();
  const router = useRouter();
  const pagePath = route.path;
  let writtenQuery: string | undefined;

  const readParams = () => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(route.query)) {
      for (const item of Array.isArray(value) ? value : [value]) {
        if (item != null) params.append(key, item);
      }
    }
    return params;
  };

  const queryKey = (params: URLSearchParams) => {
    const sorted = new URLSearchParams(params);
    sorted.sort();
    return sorted.toString();
  };

  const writeParams = (params: URLSearchParams) => {
    const key = queryKey(params);
    if (key === queryKey(readParams())) return;
    writtenQuery = key;
    // Vue Router preserves the history state required for back/forward navigation.
    return router.replace({
      path: route.path,
      query: Object.fromEntries(params),
      hash: route.hash,
    });
  };

  const onParamsChange = (restore: () => void | Promise<void>) => {
    watch(
      () => route.fullPath,
      () => {
        if (route.path !== pagePath) return;
        if (queryKey(readParams()) === writtenQuery) {
          writtenQuery = undefined;
          return;
        }
        void restore();
      },
    );
  };

  return { readParams, writeParams, onParamsChange };
}
