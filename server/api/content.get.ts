import { publicApiBase } from '../utils/publicApiBase';
import { getContentRequest } from '../utils/contentRequest';
import { compactPageContent } from '../utils/compactPageContent';

export default defineEventHandler(async (event) => {
  const request = getContentRequest(getQuery(event));
  setResponseHeader(event, 'Cache-Control', 'no-store');
  const data = await $fetch(new URL(request.path, publicApiBase(event)).href, {
    query: request.query,
    headers: { Accept: 'application/json' },
    timeout: 15000,
    retry: 0,
  });
  if (!data || typeof data !== 'object') {
    throw createError({
      statusCode: 502,
      statusMessage: 'Invalid content response',
    });
  }
  return request.query.region === 'content' ? compactPageContent(data) : data;
});
