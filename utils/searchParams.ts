import { normalizeMapViewport, readMapViewport } from './mapViewport.ts';
import type { MapViewport } from './mapViewport.ts';
import { normalizeMapMarkerId } from './mapMarker.ts';

export interface SearchFilter {
  searchQueryUrlAlias: string;
  value: string | number;
  label?: string;
  source?: string;
}

export interface SearchState {
  mapMarker?: string | number;
  mapViewport?: MapViewport;
  mode?: 'list' | 'map';
  search?: string;
  page?: number;
  sort?: string | null;
  filters?: SearchFilter[];
  startDate?: string;
  endDate?: string;
}

export function readSearchParams(params: URLSearchParams) {
  const filters: SearchFilter[] = [];
  for (const [key, value] of params) {
    if (!/^f\[\d+\]$/.test(key)) continue;
    const separator = value.indexOf(':');
    if (separator > 0) {
      filters.push({
        searchQueryUrlAlias: value.slice(0, separator),
        value: value.slice(separator + 1),
      });
    }
  }
  const page = Number(params.get('page') || 0);
  return {
    mapMarker: normalizeMapMarkerId(params.get('map_marker')),
    mapViewport: readMapViewport(params),
    mode: params.get('mode') === 'map' ? ('map' as const) : ('list' as const),
    filters,
    search: params.get('search_string') || '',
    page: Number.isInteger(page) && page >= 0 ? page : 0,
    sort: params.get('sort_by'),
    startDate: params.get('period[min]') || '',
    endDate: params.get('period[max]') || '',
  };
}

export function buildSearchParams(state: SearchState) {
  const params = new URLSearchParams();
  if (state.mode === 'map') params.set('mode', 'map');
  const mapMarker = normalizeMapMarkerId(state.mapMarker);
  if (mapMarker) params.set('map_marker', mapMarker);
  const viewport = normalizeMapViewport(state.mapViewport);
  if (viewport) {
    params.set('map_lat', String(viewport.lat));
    params.set('map_lng', String(viewport.lng));
    params.set('map_zoom', String(viewport.zoom));
  }
  if (state.search) params.set('search_string', state.search);
  if (state.sort) params.set('sort_by', state.sort);
  // Filter indexes are dense even when date and "all" selections are omitted.
  let index = 0;
  for (const filter of state.filters || []) {
    if (filter.searchQueryUrlAlias === 'period' || filter.value === 'all')
      continue;
    params.set(
      `f[${index++}]`,
      `${filter.searchQueryUrlAlias}:${filter.value}`,
    );
  }
  if (state.page && state.page > 0) params.set('page', String(state.page));
  if (state.startDate) params.set('period[min]', state.startDate);
  if (state.endDate) params.set('period[max]', state.endDate);
  return params;
}
