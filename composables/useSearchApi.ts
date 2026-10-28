export function useSearchApi() {
  const controllers = new Map<string, AbortController>();
  let disposed = false;

  onScopeDispose(() => {
    disposed = true;
    for (const controller of controllers.values()) controller.abort();
  });

  return async <T = any>(
    query: Record<string, string | number | undefined>,
    channel = 'list',
  ) => {
    controllers.get(channel)?.abort();
    const controller = new AbortController();
    controllers.set(channel, controller);
    try {
      const response = await $fetch<T>('/api/search', {
        query,
        signal: controller.signal,
        timeout: 20000,
        retry: 0,
      });
      return disposed || controller.signal.aborted ? undefined : response;
    } catch (error) {
      if (disposed || controller.signal.aborted) return undefined;
      throw error;
    } finally {
      if (controllers.get(channel) === controller) controllers.delete(channel);
    }
  };
}
