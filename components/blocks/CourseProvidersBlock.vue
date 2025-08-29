<script setup lang="ts">
// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import { stripHtmlFromString } from '~/utils/stripHtml';
import { truncateString } from '~/utils/truncateString';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';

const apiRouteStore = useApiRouteStore();
const id = `search-block-provider-${uuidv4()}`;

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
  sectionWidth: {
    type: String,
  },
});

const searchBlockData = ref(props.blockData);
const backEndDomain = ref(apiRouteStore.apiRouteEndpoint);
const isLoading = ref(true);
const isLoadingPageResults = ref(true);
const searchKeyword = ref('');
const dynamicContent = ref(searchBlockData?.value?.results);
const totalItemsFound = ref(searchBlockData?.value?.pager?.items);
const pager = ref(searchBlockData?.value?.pager);
const allSortingOptions = ref(searchBlockData?.value?.facets);
const pageSortingOptions = ref(searchBlockData?.value?.exposed_filters);
const selectedPage = ref(0);
const showAllFilters = ref(false);
const showListView = ref(true);
const showMapView = ref(false);
const sortingString = ref(
  searchBlockData?.value?.exposed_filters.sort_by.default_value || null,
);

const isClient = ref(false)

let map
let markersLayer // A layer group to easily clear & redraw markers

function createSvgMarker(size = 40) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-64 0 512 512">
      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker', // remove default styles
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // bottom center
    popupAnchor: [0, -size]
  });
}
// keeps track of filters and handles adding/removing selected filters
const selectedFiltersData = reactive([]);
const lastInteractedFilterReference = ref({});

const handleFilterChange = (
  selectedFilterOption: any,
  hideFilterDropdown = false,
) => {
  if (hideFilterDropdown) {
    lastInteractedFilterReference.value = {
      isFilterDropdownOpen: false,
    };
  } else {
    lastInteractedFilterReference.value = {
      lastInteractedFilter: selectedFilterOption.searchQueryUrlAlias,
      isFilterDropdownOpen: selectedFilterOption.isDropdownOpen,
    };
  }

  if (selectedFilterOption) {
    // Check if selectedFilterOption already exists in selectedFiltersData
    const index = selectedFiltersData.findIndex(
      (option) => option.value === selectedFilterOption.value,
    );

    if (index !== -1) {
      selectedFiltersData.splice(index, 1);
    } else {
      selectedFiltersData.push(selectedFilterOption);
    }
  }
};

// always pass "true" to to method if you want to clear the pager or hide DropdownFilter upon calling the method.
const getFilteredPageResults = async (
  clearCurrentPage = false,
  hideFilterDropdown = false,
) => {
  try {
    isLoadingPageResults.value = true;

    if (hideFilterDropdown) {
      lastInteractedFilterReference.value = {
        isFilterDropdownOpen: false,
      };
    }

    if (clearCurrentPage) {
      selectedPage.value = 0;
    }

    let filterString = '';
    selectedFiltersData.forEach((filter, index) => {
      // Append each filter as &f[index]=<searchQueryUrlAlias>:<value> <- structure BE expects
      filterString += `&f[${index}]=${filter.searchQueryUrlAlias}:${filter.value}`;
    });

    const response: any = await fetch(
      `${backEndDomain.value}/transform/view-results/${searchBlockData.value.view_id}/${searchBlockData.value.display_id}?filters=${filterString}&search_string=${searchKeyword.value}&page=${selectedPage.value}&sort_by=${sortingString.value}&items_per_page=${pager.value.limit}`,
    );
    const data = await response.json();

    dynamicContent.value = data.results;
    totalItemsFound.value = data.pager.items;
    pager.value = data.pager;
    allSortingOptions.value = data.facets;
  } catch (error) {
    console.error('Error fetching filtered results:', error);
  } finally {
    isLoadingPageResults.value = false;
  }
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const handleSearchByKeyword = computed(() => {
  return debounce(() => {
    updateURLParameters();
    getFilteredPageResults(true, true);
  }, 800);
});

const updateURLParameters = () => {
  const params = new URLSearchParams();

  // Add search keyword to URL parameters
  if (searchKeyword.value) {
    params.set('search_string', searchKeyword.value);
  }

  // Add sorting
  if (sortingString.value) {
    params.set('sort_by', sortingString.value);
  }

  // Add selected filters to URL parameters
  selectedFiltersData.forEach((filter, index) => {
    params.append(
      `f[${index}]`,
      `${filter.searchQueryUrlAlias}:${filter.value}`,
    );
  });

  // Add selected page to URL parameters
  params.set('page', selectedPage.value.toString());

  // update state
  const newURL = `${window.location.pathname}?${params.toString()}`;

  // Convert reactive objects to plain objects
  const plainState = {
    searchKeyword: searchKeyword.value,
    sortingString: sortingString.value,
    selectedFiltersData: JSON.parse(JSON.stringify(selectedFiltersData)), // Clone as plain object
    selectedPage: selectedPage.value,
  };

  history.replaceState(plainState, '', newURL);
};

if (process.client) {
  window.onpopstate = (event) => {
    if (event.state) {
      searchKeyword.value = event.state.searchKeyword || '';
      sortingString.value = event.state.sortingString || '';
      selectedPage.value = event.state.selectedPage || 0;

      selectedFiltersData.splice(
        0,
        selectedFiltersData.length,
        ...(event.state.selectedFiltersData || []),
      );

      updateURLParameters();
    }
  };
}

// Parse URL parameters
const extractedFilters = reactive([]);
const parseUrlParameters = () => {
  const params = new URLSearchParams(window.location.search);
  extractedFilters.value = [];

  // Extract filters 'f[''
  params.forEach((value, key) => {
    if (key.startsWith('f[')) {
      const [searchQueryUrlAlias, filterValue] = value.split(':');
      extractedFilters.value.push({
        searchQueryUrlAlias,
        value: filterValue,
      });
    }
  });

  // extract page
  const page = params.get('page');
  if (page) {
    selectedPage.value = parseInt(page, 10);
  }

  // extract search keyword
  const search = params.get('search_string');
  if (search) {
    searchKeyword.value = search;
  }

  // extract sorting
  const sort = params.get('sort_by');
  if (sort) {
    sortingString.value = sort;
  }

  // if finds anything - fetches data.
  if (extractedFilters.value.length > 0 || searchKeyword.value || page) {
    handleExtractedFilters();
  }
};

// populates selectedFiltersData with extracted filters
const setSelectedFiltersDataWithExtractedFilters = () => {
  // Clear previous selections
  selectedFiltersData.splice(0, selectedFiltersData.length);

  // Iterate through extractedFilters
  extractedFilters.value.forEach((filter) => {
    // Find the matching facet in allSortingOptions
    const matchingFacet = Object.values(allSortingOptions.value).find(
      (facet) => {
        return facet.url_alias === filter.searchQueryUrlAlias;
      },
    );

    if (matchingFacet) {
      // Find the specific item in the matching facet's items array
      const selectedItem = matchingFacet.items.find(
        (item) => item.value === filter.value,
      );

      if (selectedItem) {
        // Push the filter object with necessary properties
        selectedFiltersData.push({
          searchQueryUrlAlias: filter.searchQueryUrlAlias,
          value: filter.value,
          label: selectedItem.label,
        });
      }
    }
  });
};

const handleExtractedFilters = async () => {
  try {
    let queryString = '';
    extractedFilters.value.forEach((filter, index) => {
      // Append each filter as &f[index]=<searchQueryUrlAlias>:<value> <- structure BE expects
      queryString += `&f[${index}]=${filter.searchQueryUrlAlias}:${filter.value}`;
    });

    const response: any = await fetch(
      `${backEndDomain.value}/transform/view-results/${searchBlockData.value.view_id}/${searchBlockData.value.display_id}?${queryString}&search_string=${searchKeyword.value}&page=${selectedPage.value}&sort_by=${sortingString.value}&items_per_page=${pager.value.limit}`,
    );

    const data = await response.json();
    dynamicContent.value = data.results;
    totalItemsFound.value = data.pager.items;
    pager.value = data.pager;
    allSortingOptions.value = data.facets;
    isLoading.value = false;

    setSelectedFiltersDataWithExtractedFilters();
  } catch (error) {
    console.error('Error fetching filtered results:', error);
  }
};

watch(selectedFiltersData, () => {
  getFilteredPageResults(true);
  updateURLParameters();
});

const handleClearAllFilters = () => {
  selectedFiltersData.splice(0, selectedFiltersData.length);

  lastInteractedFilterReference.value = {
    isFilterDropdownOpen: false,
  };
};

const handlePager = (page: number) => {
  selectedPage.value = page;
  updateURLParameters();

  getFilteredPageResults(false, true).then(() => {
    const searchBlock = document.querySelector('.search-block-provider');

    if (searchBlock) {
      searchBlock.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

const handleSortingChange = (item) => {
  if (item.searchQueryUrlAlias && item.value) {
    sortingString.value = item.value;
    updateURLParameters();

    getFilteredPageResults(false, true);
  }

  lastInteractedFilterReference.value = {
    isFilterDropdownOpen: false,
  };
};

const searchResultSuffix = computed(() => {
  if (props.blockData.display_id === 'block_1') {
    return totalItemsFound.value > 1 ? 'udbydere' : 'udbyder';
  } else {
    return totalItemsFound.value > 1 ? 'virksomheder' : 'virksomhed';
  }
});

// Transform dynamicContent into Leaflet-friendly marker data
const leafletMarkers = computed(() =>
  dynamicContent.value
    .filter(item =>
      item.field_view_on_map === 'show_on_map' &&
      item.field_dawa_address?.lat &&
      item.field_dawa_address?.lng
    )
    .map((item) => {
      let imageHtml = '';
      if (item.field_logo.img_element) {
        imageHtml = `<div class="leaflet-popup-content__image leaflet-popup-content__image--logo"><a href="${item.link}"><img src="${item.field_logo.img_element.uri}" alt="" /></a></div>`;
      } else if (item.field_image.img_element) {
        imageHtml = `<div class="leaflet-popup-content__image leaflet-popup-content__image--image"><a href="${item.link}"><img src="${item.field_image.img_element.uri}" alt="" /></a></div>`;
      }

      return ({
        id: item.id,
        title: item.label,
        coords: [item.field_dawa_address.lat, item.field_dawa_address.lng],
        popupContent: `
          <div class="leaflet-popup-content__inner">
            ${imageHtml}
            <div class="leaflet-popup-content__content">
              <h4>${item.label}</h4>
              <a href="${item.link}">Se udbyder</a>
            </div>
          </div>
        `
      });
    })
);

onBeforeMount(() => {
  if (window.location.search) {
    parseUrlParameters();
  }
});

onMounted(async() => {
  isLoading.value = false;
  isLoadingPageResults.value = false;
  isClient.value = true;
});

// Watch leafletMarkers globally to refresh markers whenever search/filter changes
watch(leafletMarkers, (newMarkers) => {
  if (map && markersLayer) {
    updateMarkers(newMarkers);
  }
});

watch(showMapView, async (value) => {
  if (value) {
    await nextTick(); // Wait for DOM to render

    // Lazy load Leaflet
    if (!window.L) {
      const leaflet = await import('leaflet');
      window.L = leaflet.default;

      const LMarkerCluster = await import('leaflet.markercluster');
      await import('leaflet.markercluster/dist/MarkerCluster.css');
      await import('leaflet.markercluster/dist/MarkerCluster.Default.css');
      await import('leaflet/dist/leaflet.css');

      // Fix marker paths
      const markerShadow = (await import('leaflet/dist/images/marker-shadow.png')).default;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({ shadowUrl: markerShadow });
    }

    const mapContainer = document.getElementById('provider-map');
    if (!mapContainer) return console.error('Map container not found!');

    initMap();
  } else {
    // Cleanup map when hiding
    if (map) {
      map.remove();
      map = null;
      markersLayer = null;
    }
  }
});

function initMap() {
  if (map) return; // Prevent double init

  map = L.map('provider-map').setView([20, 0], 2)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Create a marker cluster group instead of a simple layer group
  markersLayer = L.markerClusterGroup();
  map.addLayer(markersLayer);

  updateMarkers(leafletMarkers.value);

  watch(leafletMarkers, (newMarkers) => {
    updateMarkers(newMarkers)
  })
}

function updateMarkers(markers) {
  if (!markersLayer) return
  markersLayer.clearLayers()

  markers.forEach(marker => {
    L.marker(marker.coords, {
      icon: createSvgMarker(40)
    })
    .bindPopup(marker.popupContent, { maxWidth: 250 })
    .addTo(markersLayer)
  })

  if (markers.length) {
    const bounds = L.latLngBounds(markers.map(m => m.coords))
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}
</script>

<template>
  <div :id="id">
    <div class="search-block-provider">
      <div class="search-block-provider__label" v-if="searchBlockData?.label">
        {{ searchBlockData?.label }}
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12" v-if="!isLoading">
          <div class="search-block-provider__filters-container">
            <div class="search-block-provider__search-keyword">
              <BaseInputFloatingLabel
                v-model="searchKeyword"
                type="text"
                name="search"
                label="Søg"
                :is-search="true"
                @input="handleSearchByKeyword"
              />
            </div>
            <div class="search-block-provider__list-map-toggle">
              <button
                class="button button--ghost"
                v-if="dynamicContent.length > 0 && isClient && showListView"
                @click="showListView = false; showMapView = true;"
              >
                <NuxtIcon
                  class="search-block-provider__chip-close"
                  name="map"
                  filled
                ></NuxtIcon>
                Vis på kort
              </button>
              <button
                class="button button--ghost"
                v-if="dynamicContent.length > 0 && isClient && showMapView"
                @click="showListView = true; showMapView = false;"
              >
                <NuxtIcon
                  class="search-block-provider__chip-close"
                  name="grid"
                  filled
                ></NuxtIcon>
                Vis listevisning
              </button>
            </div>

            <div
              :class="
                Object.keys(allSortingOptions).length > 0
                  ? 'search-block-provider__filters'
                  : ''
              "
              v-if="!isLoadingPageResults"
            >
              <div
                class="search-block-provider__dropdown"
                v-for="(item, name, idx) in allSortingOptions"
                :key="item"
                :class="{
                  'search-block-provider__dropdown--is-hidden-mobile':
                    !showAllFilters
                      ? 'search-block-provider__dropdown--is-hidden-mobile'
                      : '',
                }"
              >
                <ClientOnly>
                  <BaseSearchDropdown
                    @dropdown-value="handleFilterChange"
                    :allFilters="item"
                    :last-interacted-filter-data="lastInteractedFilterReference"
                    :isLoading="isLoadingPageResults"
                  />
                </ClientOnly>
              </div>
              <button
                class="search-block-provider__show-all-filters search-block-provider__show-all-filters--desktop"
                v-if="
                  Object.keys(allSortingOptions).length > 4 && !showAllFilters
                "
                @click="showAllFilters = true"
              >
                <NuxtIcon
                  class="search-block-provider__chip-close"
                  name="controls-vertical-alt"
                  filled
                ></NuxtIcon>
                Alle filtre

                <div class="search-block-provider__show-all-filters__counter">
                  {{ Object.keys(allSortingOptions).length }}
                </div>
              </button>

              <button
                class="search-block-provider__show-all-filters search-block-provider__show-all-filters--mobile"
                v-if="
                  Object.keys(allSortingOptions).length > 0 && !showAllFilters
                "
                @click="showAllFilters = true"
              >
                <NuxtIcon
                  class="search-block-provider__chip-close"
                  name="controls-vertical-alt"
                  filled
                ></NuxtIcon>
                Alle filtre

                <div class="search-block-provider__show-all-filters__counter">
                  {{ Object.keys(allSortingOptions).length }}
                </div>
              </button>
            </div>
            <div v-else class="search-block-provider__skeleton">
              <BaseLoading />
            </div>

            <!-- chips -->
            <div
              class="search-block-provider__chips"
              v-if="selectedFiltersData.length > 0"
            >
              <TransitionGroup name="pan-right">
                <div
                  class="search-block-provider__chip"
                  v-for="item in selectedFiltersData"
                  :key="item"
                  @click="handleFilterChange(item, true)"
                >
                  <NuxtIcon
                    class="search-block-provider__chip-close"
                    name="close"
                  ></NuxtIcon>
                  <span>{{ item?.label }}</span>
                </div>
              </TransitionGroup>
              <button
                @click="handleClearAllFilters"
                class="search-block-provider__chip-clear"
                v-if="selectedFiltersData.length > 0"
                aria-label="Nulstil filtre"
              >
                Nulstil filtre
              </button>
            </div>
          </div>

          <div
            class="search-block-provider__results-container"
            v-if="dynamicContent.length > 0"
          >
            <div class="search-block-provider__extra-filters-bar" v-if="showListView">
              <div class="search-block-provider__results-found">
                <h4>Viser {{ totalItemsFound }} {{ searchResultSuffix }}</h4>
              </div>
              <div class="search-block-provider__sorting">
                <ClientOnly>
                  <BaseSearchSorting
                    @sorting-value="handleSortingChange"
                    :sortingFilterData="pageSortingOptions"
                    :isLoading="isLoadingPageResults"
                    :defaultSelectedOption="sortingString"
                  />
                </ClientOnly>
              </div>
            </div>

            <div
              v-if="showListView"
              class="search-block-provider__result-items"
              :class="{
                'search-block-provider__result-items--loading':
                  isLoadingPageResults,
              }"
            >
              <TransitionGroup name="fade-in-search-results">
                <div
                  class="search-block-provider__result-item"
                  v-for="item in dynamicContent"
                  :key="item"
                >
                  <div class="search-block-provider__card-item">
                    <NuxtLink
                      class="search-block-provider__card-link"
                      :to="item?.link"
                    >
                      <div class="search-block-provider__card">
                        <div
                          class="search-block-provider__card-image-container"
                          v-if="item?.field_logo.length !== 0"
                        >
                          <BaseImage
                            class="search-block-provider__card-image"
                            :image="item?.field_logo"
                          />
                        </div>
                        <div
                          class="search-block-provider__card-image-container"
                          v-else-if="item?.field_image.length !== 0"
                        >
                          <BaseImage
                            class="search-block-provider__card-image"
                            :image="item?.field_image"
                          />
                        </div>

                        <div
                          class="search-block-provider__card-label"
                          v-if="item?.field_name"
                        >
                          <h4 v-if="item?.field_name">
                            {{ item?.field_name }}
                          </h4>
                          <p
                            v-if="item?.field_presentation"
                            class="search-block-provider__card-description"
                          >
                            {{
                              truncateString(
                                stripHtmlFromString(item?.field_presentation),
                                250,
                              )
                            }}
                          </p>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </TransitionGroup>
            </div>

            <ClientOnly v-else-if="showMapView">
              <div id="provider-map"></div>
            </ClientOnly>

            <BasePager
              class="search-block-provider__pager"
              v-if="pager && showListView"
              :pager="pager"
              @change="handlePager"
            />
          </div>

          <div
            class="search-block-provider__no-results-container"
            :class="{
              'search-block-provider__no-results-container--loading':
                isLoadingPageResults,
            }"
            v-else
          >
            <div class="search-block-provider__no-result-item">
              <h4>Ingen resultater</h4>

              <div
                v-if="isLoadingPageResults"
                class="search-block-provider__spinner"
              ></div>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12" v-else>
          <div class="loader">
            <BaseLoading />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.search-block-provider {
  &__label {
    color: var(--theme-color);
    margin-bottom: 24px @(--sm) 64px;
    font-size: var(--font-size-h1);
    font-weight: 700;
  }

  padding-top: 48px @(--sm) 96px;
  margin-bottom: 48px @(--sm) 96px;
  background-color: transparent;
  color: var(--theme-color);

  &__skeleton {
    height: 100%;
  }

  /* removes overflow to the side, if the
  rightest nav option clips to the side of the page */
  overflow-x: clip;

  &__heading {
    margin-bottom: 0;
    color: var(--color-text);
  }

  /* Filters stuff */
  &__filters {
    display: flex;
    padding-top: 32px;
    gap: 24px;
    flex-wrap: wrap;
    min-height: auto @(--sm) 88px;

    &-container {
      display: flex;
      flex-direction: row;
    }
  }

  &__list-map-toggle {
    margin-left: auto;

    & .button {
      margin-left: 16px;
      border: var(--form-input-border);
      font-weight: 400;
    }
  }

  &__search-keyword {
    width: 100% @(--sm) 500px;
  }

  &__extra-filters-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px @(--sm) 64px;
  }

  &__dropdown {
    width: 100% @(--sm) auto;

    &--is-hidden {
      display: none;
    }

    &--is-hidden-mobile {
      @media (--viewport-sm-max) {
        display: none;
      }
    }
  }

  &__show-all-filters {
    display: flex;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    height: 56px;
    border-radius: 56px;
    background-color: var(--color-primary-lighten-4);
    padding: 15px 32px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-primary-darken-3);
    align-items: center;
    position: relative;
    transition: all 0.3s ease-in-out;
    border: 1px solid transparent;
    font-weight: 700;

    &--mobile {
      display: none;

      @media (--viewport-sm-max) {
        display: flex;
      }
    }

    &--desktop {
      display: flex;

      @media (--viewport-sm-max) {
        display: none;
      }
    }

    &:hover {
      background-color: var(--color-primary-lighten-3);
      border: 1px solid var(--color-primary);
      box-shadow: 0px 0px 0px 4px #297f781a;
    }

    &__counter {
      position: absolute;
      top: -3px;
      right: 0;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background-color: var(--color-secondary);
      color: var(--color-text);
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      display: block @(--sm) none;
    }
  }

  /* chips */
  &__chips {
    padding-top: 24px @(--sm) 32px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  &__chip {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-primary-lighten-4);
    border-radius: 4px;
    padding: 7px 16px;
    color: var(--color-primary-darken-3);
    background-color: var(--color-primary-lighten-4);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: var(--color-primary-lighten-3);
    }
  }

  &__chip-close {
    font-size: 20px;
    padding-right: 8px;
  }

  &__chip-clear {
    text-transform: uppercase;
    background: transparent;
    border: none;
    font-size: 500;
    font-size: 14px;
    letter-spacing: 1px;
    color: var(--color-primary-darken-3);
    transition: color 0.3s ease-in-out;
    padding: 7px 16px;

    &:hover {
      color: var(--color-primary);
    }
  }

  /* Results stuff */
  &__results-container {
    padding-top: 24px @(--sm) 96px;

    &--loading {
      opacity: 0.5;
      cursor: wait;
    }
  }

  &__no-results-container {
    padding-top: 48px;

    &--loading {
      opacity: 0.5;
      cursor: wait;
    }
  }

  &__no-result-item {
    display: flex;
    align-items: center;

    h4 {
      margin: 0;
    }
  }

  &__spinner {
    border: 4px solid rgba(var(--color-primary-rgb), 0.3);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-left: 10px;
  }

  &__results-found {
    h4 {
      margin: 0;
    }
  }

  &__result-items {
    display: flex;
    flex-wrap: wrap;
    gap: 24px 0 @(--sm) 48px 24px;

    &--loading {
      opacity: 0.5;
      cursor: wait;
    }
  }

  &__result-item {
    width: 100% @(--sm) calc(50% - 12px);
  }

  &__card-item {
    width: 100%;
    height: 100%;
  }

  &__card-link {
    display: flex;
    color: var(--color-text);
    text-decoration: none;
    width: 100%;
    height: 100%;
    background: var(--color-white);
    border: 2px solid var(--color-primary-lighten-4);
    border-radius: 4px;
    box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.1);
    padding: 24px @(--sm) 32px;
    transition: all 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 4px 10px 10px rgba(var(--color-primary-rgb), 0.15);

      .search-block-provider__card-image {
        opacity: 0.8;
      }

      .search-block-provider__card-label {
        color: var(--color-primary);
      }
    }
  }

  &__card-image {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  &__card {
    display: flex;
    flex-direction: column @(--md) row;
    gap: 0 @(--sm) 24px;
  }

  &__card-label {
    color: var(--color-text);
    transition: color 0.3s ease-in-out;

    h4 {
      margin: 0;
    }
  }

  &__card-image-container {
    position: relative;
    flex: auto @(--md) 0 0 129px @(--lg) 0 0 188px;
    width: 180px @(--sm) 160px @(--md) 129px @(--lg) 188px;
    margin-bottom: 24px @(--sm) 0;
    border-radius: 4px;
    overflow: hidden;
  }

  &__card-description {
    padding-top: 8px;
    color: var(--color-text);
  }

  .form-label {
    background-color: var(--theme-background-color);
    color: var(--theme-color);

    .theme-none & {
      background-color: var(--site-background-color);
    }

    svg {
      fill: var(--theme-color);
    }
  }

  .form-input--floating-label {
    &.form-input--up ~ .form-label,
    &:focus ~ .form-label {
      background-color: var(--theme-background-color);
      color: var(--theme-color);

      .theme-none & {
        background-color: var(--site-background-color);
      }
    }
  }

  .form-input {
    background-color: var(--theme-background-color);

    .theme-none & {
      background-color: var(--site-background-color);
    }

    &:focus {
      background-color: var(--theme-background-color);

      .theme-none & {
        background-color: var(--site-background-color);
      }
    }
  }

  &__pager {
    padding-top: 32px @(--sm) 64px;
  }

  .card {
    color: var(--color-text);
  }
}

#provider-map {
  width: 100%;
  height: 700px;
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

    a {
      font-weight: 400;
    }
  }

  &__image {
    flex-basis: 140px;
    align-content: center;

    &--logo {
      border-right: 1px solid var(--color-quaternary-lighten-5);

      img {
        width: 90%;
        height: auto;
        margin-left: 5%;
      }
    }

    &--image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    flex-grow: 1;
    padding: 15px;
  }
}
</style>
