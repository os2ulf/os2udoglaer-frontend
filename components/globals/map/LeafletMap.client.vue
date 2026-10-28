<script setup lang="ts">
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { normalizeMapViewport } from '~/utils/mapViewport';
import type { MapViewport } from '~/utils/mapViewport';
import { matchingMapMarkerId, normalizeMapMarkerId } from '~/utils/mapMarker';

type Marker = {
  id: string | number;
  title: string;
  coords: [number, number];
  popupContent: string;
};

const props = defineProps<{
  markers: Marker[];
  loading?: boolean;
  heightClass?: string; // allow custom height if you want
  viewport?: MapViewport;
  selectedMarkerId?: string;
}>();

const emit = defineEmits<{
  viewportChange: [viewport: MapViewport];
  markerChange: [id: string | undefined];
}>();
const mapEl = ref<HTMLElement | null>(null);
const renderedViewport = shallowRef<MapViewport>();
const activeMarkerId = ref<string>();
const markersById = new Map<string, { layer: L.Marker; data: Marker }>();
let map: L.Map | null = null;
let markersLayer: L.MarkerClusterGroup | null = null;
let selectedPopup: L.Popup | null = null;
let restoringSelection = false;
let disposed = false;
let programmaticMove = false;

function updateMarkerSelection() {
  mapEl.value
    ?.querySelectorAll('.leaflet-marker-selected')
    .forEach((el) => el.classList.remove('leaflet-marker-selected'));
  for (const [id, marker] of markersById) {
    marker.layer
      .getElement()
      ?.setAttribute('aria-pressed', String(id === activeMarkerId.value));
  }
  const selected =
    activeMarkerId.value && markersById.get(activeMarkerId.value);
  if (selected) {
    markersLayer
      ?.getVisibleParent(selected.layer)
      ?.getElement()
      ?.classList.add('leaflet-marker-selected');
  }
}

function openMarkerPopup(id: string, restoring = false) {
  const marker = markersById.get(id);
  if (!map || !selectedPopup || !marker) return;
  activeMarkerId.value = id;
  // An independent popup can reopen a clustered marker without changing zoom.
  selectedPopup.options.autoPan = !restoring;
  selectedPopup
    .setLatLng(marker.layer.getLatLng())
    .setContent(marker.data.popupContent)
    .openOn(map);
  selectedPopup.options.autoPan = true;
  updateMarkerSelection();
}

function handlePopupClose(event: L.PopupEvent) {
  if (event.popup !== selectedPopup || restoringSelection || disposed) return;
  activeMarkerId.value = undefined;
  updateMarkerSelection();
  emit('markerChange', undefined);
}

function restoreSelectedMarker(refreshContent = false) {
  if (!map || !selectedPopup || props.loading) return;
  const id = matchingMapMarkerId(props.selectedMarkerId, props.markers);
  restoringSelection = true;
  try {
    if (id) {
      if (
        refreshContent ||
        activeMarkerId.value !== id ||
        !map.hasLayer(selectedPopup)
      )
        openMarkerPopup(id, true);
    } else {
      selectedPopup.remove();
      activeMarkerId.value = undefined;
      updateMarkerSelection();
    }
  } finally {
    restoringSelection = false;
  }
  if (props.selectedMarkerId && !id) emit('markerChange', undefined);
}

function currentViewport() {
  if (!map) return;
  const center = map.getCenter().wrap();
  return normalizeMapViewport({
    lat: center.lat,
    lng: center.lng,
    zoom: map.getZoom(),
  });
}

function handleMoveEnd() {
  renderedViewport.value = currentViewport();
  if (!programmaticMove && renderedViewport.value) {
    emit('viewportChange', renderedViewport.value);
  }
}

function moveWithoutSaving(action: () => void) {
  programmaticMove = true;
  try {
    action();
    renderedViewport.value = currentViewport();
  } finally {
    programmaticMove = false;
  }
}

function restoreViewportOrFitMarkers() {
  if (!map || !markersLayer) return;
  moveWithoutSaving(() => {
    const viewport = normalizeMapViewport(props.viewport);
    if (viewport) {
      // A full reset avoids Leaflet rounding a small restore to a whole-pixel pan.
      const options = { animate: false, reset: true };
      map!.setView([viewport.lat, viewport.lng], viewport.zoom, options);
    } else if (markersLayer!.getLayers().length) {
      map!.fitBounds(markersLayer!.getBounds(), {
        padding: [50, 50],
        animate: false,
      });
    } else {
      map!.setView([20, 0], 2, { animate: false });
    }
  });
}

function createSvgMarker(size = 40) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-64 0 512 512">
      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function initMap() {
  if (!mapEl.value || map) return;

  map = L.map(mapEl.value).setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  markersLayer = L.markerClusterGroup();
  map.addLayer(markersLayer);
  selectedPopup = L.popup({ maxWidth: 250, offset: L.point(0, -40) });
  map.on('popupclose', handlePopupClose);
  map.on('zoomend', updateMarkerSelection);
  markersLayer.on('animationend', updateMarkerSelection);

  updateMarkers(props.markers);
  map.on('moveend', handleMoveEnd);
}

function updateMarkers(markers: Marker[]) {
  if (!map || !markersLayer) return;

  markersLayer.clearLayers();
  markersById.clear();

  markers.forEach((m) => {
    const id = normalizeMapMarkerId(m.id);
    if (!id) return;
    const layer = L.marker(m.coords, {
      icon: createSvgMarker(40),
      title: m.title,
    });
    markersById.set(id, { layer, data: m });
    // Let the marker toggle its popup before the map handles the same click.
    layer.on('preclick', (event) => {
      L.DomEvent.stopPropagation(event as unknown as Event);
    });
    layer.on('click', () => {
      if (
        activeMarkerId.value === id &&
        selectedPopup &&
        map?.hasLayer(selectedPopup)
      ) {
        selectedPopup.remove();
        return;
      }
      openMarkerPopup(id);
      emit('markerChange', id);
    });
    layer.on('add', () => {
      const element = layer.getElement();
      element?.setAttribute('data-map-marker-id', id);
      element?.setAttribute('aria-label', m.title);
      element?.setAttribute(
        'aria-pressed',
        String(activeMarkerId.value === id),
      );
    });
    layer.addTo(markersLayer as L.LayerGroup);
  });

  restoreViewportOrFitMarkers();
  restoreSelectedMarker(true);
}

function refreshMapAndFitBounds() {
  if (!map) return;

  moveWithoutSaving(() => map!.invalidateSize({ pan: false }));
  restoreViewportOrFitMarkers();
  restoreSelectedMarker();
}
defineExpose({ refreshMapAndFitBounds });

watch(
  [() => props.selectedMarkerId, () => props.loading],
  () => restoreSelectedMarker(),
  { flush: 'post' },
);

watch(
  () => props.viewport,
  (viewport) => {
    const current = currentViewport();
    if (
      viewport &&
      current &&
      Math.abs(viewport.lat - current.lat) < 0.000001 &&
      Math.abs(viewport.lng - current.lng) < 0.000001 &&
      viewport.zoom === current.zoom
    )
      return;
    restoreViewportOrFitMarkers();
  },
);

// keep markers in sync with filters/search
watch(
  () => props.markers,
  (m) => {
    updateMarkers(m || []);
  },
  { deep: true },
);

onMounted(() => {
  initMap();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const clickable = target.closest('.leaflet-popup-clickable');
    const clickedLink = target.closest('a');

    const tag = target.tagName.toLowerCase();
    const isTextElement = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'span',
    ].includes(tag);

    if (clickable && !clickedLink && !isTextElement) {
      const link = clickable.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    }
  });
});

onBeforeUnmount(() => {
  disposed = true;
  restoringSelection = true;
  try {
    map?.off('moveend', handleMoveEnd);
    map?.off('popupclose', handlePopupClose);
    map?.off('zoomend', updateMarkerSelection);
    map?.remove();
  } finally {
    map = null;
    markersLayer = null;
    selectedPopup = null;
    markersById.clear();
  }
});
</script>

<template>
  <BaseLoading v-if="props.loading" />

  <div
    v-show="!props.loading && props.markers.length > 0"
    id="provider-map"
    class="provider-map"
    :data-map-lat="renderedViewport?.lat"
    :data-map-lng="renderedViewport?.lng"
    :data-map-zoom="renderedViewport?.zoom"
    :data-map-marker="activeMarkerId"
    ref="mapEl"
  ></div>
  <div
    v-show="!props.loading && props.markers.length === 0"
    class="text-center py-10"
  >
    <p>Der er ingen steder at vise.</p>
  </div>
</template>

<style lang="postcss">
.custom-leaflet-marker svg {
  display: block;
}

.leaflet-marker-selected {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.provider-map {
  width: 100%;
  height: 0;
  padding-bottom: 400px;

  @media (min-width: 768px) {
    padding-bottom: 70%;
  }

  @media (min-width: 992px) {
    padding-bottom: 60%;
  }
}

.custom-leaflet-marker {
  svg {
    fill: var(--color-primary);
  }
}

.leaflet-popup-content-wrapper {
  padding: 0 !important;
  border-radius: 0 !important;
}

.leaflet-container a.leaflet-popup-close-button {
  width: 30px !important;
  height: 30px !important;
  font-size: 22px !important;
}

.leaflet-popup-content {
  width: auto !important;
  margin: 0 !important;

  &__inner {
    display: flex;
    flex-direction: row;
    width: 400px;
    min-height: 140px;
    font-size: 14px;
    font-family: var(--body-font-family);

    &--no-image {
      width: 260px;
    }

    a {
      font-weight: 400;
    }
  }

  &__image {
    flex: 0 0 140px;

    a {
      display: block;
    }

    &--logo {
      align-content: center;
      border-right: 1px solid var(--color-quaternary-lighten-5);

      a {
        margin: 15px;
      }
    }

    &--image {
      a {
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  &__content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding: 15px 30px 15px 15px;

    p {
      margin: 0 0 8px;
      font-size: 14px;
      font-family: var(--body-font-family);
    }

    h4 {
      a {
        text-decoration: none;
        color: inherit;
        font-weight: inherit;
        font-size: inherit;
      }
    }
  }

  &__link {
    display: block;
    margin-top: auto;
  }
}
</style>
