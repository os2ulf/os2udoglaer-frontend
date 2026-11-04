export interface MapViewport {
  lat: number;
  lng: number;
  zoom: number;
}

export function normalizeMapViewport(
  viewport?: MapViewport,
): MapViewport | undefined {
  if (
    !viewport ||
    !Number.isFinite(viewport.lat) ||
    Math.abs(viewport.lat) > 90 ||
    !Number.isFinite(viewport.lng) ||
    Math.abs(viewport.lng) > 180 ||
    !Number.isInteger(viewport.zoom) ||
    viewport.zoom < 0 ||
    viewport.zoom > 19
  )
    return;
  return {
    lat: Number(viewport.lat.toFixed(6)),
    lng: Number(viewport.lng.toFixed(6)),
    zoom: viewport.zoom,
  };
}

export function readMapViewport(params: URLSearchParams) {
  const values = ['map_lat', 'map_lng', 'map_zoom'].map((key) =>
    params.get(key),
  );
  if (values.some((value) => value == null || value.trim() === '')) return;
  return normalizeMapViewport({
    lat: Number(values[0]),
    lng: Number(values[1]),
    zoom: Number(values[2]),
  });
}
