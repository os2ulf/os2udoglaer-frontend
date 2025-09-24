<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

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
}>();

const mapEl = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markersLayer: L.MarkerClusterGroup | null = null;

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

  updateMarkers(props.markers);
}

function updateMarkers(markers: Marker[]) {
  if (!map || !markersLayer) return;

  markersLayer.clearLayers();

  if (markers.length === 0) {
    // Reset to default world view
    map.setView([20, 0], 2);
    return;
  }

  markers.forEach((m) => {
    L.marker(m.coords, { icon: createSvgMarker(40) })
      .bindPopup(m.popupContent, { maxWidth: 250 })
      .addTo(markersLayer as L.LayerGroup);
  });

  const bounds = L.latLngBounds(markers.map((m) => m.coords));
  map.fitBounds(bounds, { padding: [50, 50] });
}

function refreshMapAndFitBounds() {
  if (!map) return;

  // First refresh layout
  map.invalidateSize();

  // Then refit bounds if markers exist
  if (markersLayer && markersLayer.getLayers().length > 0) {
    const bounds = L.latLngBounds(
      (markersLayer.getLayers() as L.Marker[]).map((m: any) => m.getLatLng()),
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}
defineExpose({ refreshMapAndFitBounds });

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
  try {
    map?.remove();
  } finally {
    map = null;
    markersLayer = null;
  }
});
</script>

<template>
  <BaseLoading v-if="props.loading" />

  <div
    v-show="!props.loading && props.markers.length > 0"
    id="provider-map"
    class="provider-map"
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
.custom-leaflet-marker :deep(svg) {
  display: block;
}

.provider-map {
  width: 100%;
  height: 0;
  padding-bottom: 400px;

  @media (--viewport-sm-min) {
    padding-bottom: 70%;
  }

  @media (--viewport-md-min) {
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
