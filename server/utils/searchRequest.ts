import { createError } from 'h3';

export function getSearchRequest(query: Record<string, unknown>) {
  const { view, display } = query;
  if (view !== undefined || display !== undefined) {
    if (
      typeof view !== 'string' ||
      typeof display !== 'string' ||
      !/^[a-zA-Z0-9_]+$/.test(view) ||
      !/^[a-zA-Z0-9_]+$/.test(display)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid search view',
      });
    }
  }

  const forwarded: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (
      !/^(search_string|page|sort_by|items_per_page|period\[(min|max)\]|f\[\d+\])$/.test(
        key,
      )
    )
      continue;
    if (typeof value !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid search parameter',
      });
    }
    forwarded[key] = value;
  }

  return {
    path: view ? `/transform/view-results/${view}/${display}` : '/search',
    query: view
      ? forwarded
      : { ...forwarded, format: 'json', region: 'content' },
  };
}
