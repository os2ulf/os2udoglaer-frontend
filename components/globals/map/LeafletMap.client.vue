<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet.markercluster';

// CSS can be statically imported here safely (no hydration issues since this file is client-only)
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

  markers.forEach((m) => {
    L.marker(m.coords, { icon: createSvgMarker(40) })
      .bindPopup(m.popupContent, { maxWidth: 250 })
      .addTo(markersLayer as L.LayerGroup);
  });

  if (markers.length) {
    const bounds = L.latLngBounds(markers.map((m) => m.coords));
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

onMounted(() => {
  initMap();
});

// keep markers in sync with filters/search
watch(
  () => props.markers,
  (m) => {
    updateMarkers(m || []);
  },
  { deep: true }
);

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
  <div id="provider-map" class="provider-map" ref="mapEl">
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
    width: 350px;
    height: 140px;
    font-size: 14px;
    font-family: var(--body-font-family);

    &--no-image {
      width: 210px;
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
    flex-grow: 1;
    padding: 15px 30px 15px 15px;
  }
}
</style>