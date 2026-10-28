export function normalizeMapMarkerId(value: unknown): string | undefined {
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < 0) return;
    value = String(value);
  }
  if (typeof value === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(value))
    return value;
}

export function matchingMapMarkerId(
  selectedId: unknown,
  markers: ReadonlyArray<{ id: string | number }>,
) {
  const id = normalizeMapMarkerId(selectedId);
  return id && markers.some((marker) => String(marker.id) === id)
    ? id
    : undefined;
}
