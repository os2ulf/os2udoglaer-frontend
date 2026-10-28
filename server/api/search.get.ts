import { getSearchRequest } from '../utils/searchRequest';
import { publicApiBase } from '../utils/publicApiBase';

// An explicit response type avoids recursive inference through Nitro's own route types.
export default defineEventHandler(async (event): Promise<unknown> => {
  const request = getSearchRequest(getQuery(event));
  const base = publicApiBase(event);

  setResponseHeader(event, 'Cache-Control', 'no-store');
  // The upstream is selected by server configuration, never by a URL from the caller.
  return await $fetch(new URL(request.path, base).href, {
    query: request.query,
    headers: { Accept: 'application/json' },
    timeout: 15000,
    retry: 0,
  });
});
