import type { H3Event } from 'h3';
import { getRequestURL, createError } from 'h3';
import { getBackendDomainServer } from '~/utils/getBackendDomainServer';

export function publicApiBase(event: H3Event) {
  const hostname = getRequestURL(event, { xForwardedHost: true }).hostname;
  const config = useRuntimeConfig(event);
  const local = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname);
  const base = local
    ? config.public.LOCAL_API_BASE_URL
    : getBackendDomainServer(hostname);
  if (!base)
    throw createError({
      statusCode: 503,
      statusMessage: 'Public API is not configured',
    });
  return base;
}
