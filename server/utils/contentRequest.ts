import { createError } from 'h3';

export function getContentRequest(query: Record<string, unknown>) {
  const path = query.path || '/';
  const region = query.region || 'content';
  if (
    typeof path !== 'string' ||
    !path.startsWith('/') ||
    path.startsWith('//') ||
    /[\\?#]/.test(path) ||
    /%(2e|2f|5c)/i.test(path) ||
    path.split('/').some((part) => part === '.' || part === '..') ||
    typeof region !== 'string' ||
    !['content', 'header', 'footer', 'settings'].includes(region)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid content request',
    });
  }
  return { path, query: { format: 'json', region } };
}
