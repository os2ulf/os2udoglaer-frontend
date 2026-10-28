<script setup lang="ts">
// @ts-nocheck
import { useId } from 'vue';
import type { MapViewport } from '~/utils/mapViewport';
import { matchingMapMarkerId } from '~/utils/mapMarker';
import { stripHtmlFromString } from '~/utils/stripHtml';
import { truncateString } from '~/utils/truncateString';
import { buildSearchParams, readSearchParams } from '~/utils/searchParams';
import LeafletMap from '~/components/globals/map/LeafletMap.client.vue';

const id = `search-block-provider-${useId()}`;

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
const searchApi = useSearchApi();
const { readParams, writeParams, onParamsChange } = useSearchUrlState();
const searchError = ref<string | null>(null);
let restoringUrl = false;
let restoreVersion = 0;
let listRequestVersion = 0;
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
const showMapView = ref(false);
const mapViewport = shallowRef<MapViewport>();
const selectedMapMarkerId = ref<string>();
const showListView = computed(() => !showMapView.value);
const sortingString = ref(
  searchBlockData?.value?.exposed_filters.sort_by.default_value || null,
);

const isClient = ref(false);

const leafletMapRef = ref(null);
const dynamicMapContent = ref<any[]>([]);
const loadingMap = ref(false);

// keeps track of filters and handles adding/removing selected filters
const selectedFiltersData = reactive([]);
const lastInteractedFilterReference = ref({});

const fetchViewResults = (map = false) => {
  const params = buildSearchParams({
    search: searchKeyword.value,
    page: selectedPage.value,
    sort: sortingString.value,
    filters: selectedFiltersData,
  });
  if (map) {
    params.delete('page');
  } else if (pager.value?.limit) {
    params.set('items_per_page', String(pager.value.limit));
  }
  return searchApi(
    {
      ...Object.fromEntries(params),
      view: searchBlockData.value.view_id,
      display: searchBlockData.value.display_id + (map ? '_map' : ''),
    },
    map ? 'map' : 'list',
  );
};

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
      (option) =>
        option.searchQueryUrlAlias ===
          selectedFilterOption.searchQueryUrlAlias &&
        String(option.value) === String(selectedFilterOption.value),
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
  const requestVersion = ++listRequestVersion;
  searchError.value = null;
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

    const data = await fetchViewResults();
    if (!data) return;
    if (showMapView.value) {
      const mapData = await fetchViewResults(true);
      if (mapData) dynamicMapContent.value = mapData.results || [];
    }

    dynamicContent.value = data.results;
    totalItemsFound.value = data.pager.items;
    pager.value = data.pager;
    allSortingOptions.value = data.facets;
  } catch (error) {
    searchError.value = 'Søgningen kunne ikke hentes. Prøv igen.';
    console.error('Error fetching filtered results:', error);
  } finally {
    if (requestVersion === listRequestVersion)
      isLoadingPageResults.value = false;
  }
};

const debounce = (func, delay) => {
  let timeoutId;
  onScopeDispose(() => clearTimeout(timeoutId));
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const handleSearchByKeyword = debounce(() => {
  if (restoringUrl) return;
  void getFilteredPageResults(true, true);
  updateURLParameters();
}, 800);

const updateURLParameters = () => {
  if (restoringUrl) return;
  void writeParams(
    buildSearchParams({
      mode: showMapView.value ? 'map' : 'list',
      mapViewport: mapViewport.value,
      mapMarker: selectedMapMarkerId.value,
      search: searchKeyword.value,
      page: selectedPage.value,
      sort: sortingString.value,
      filters: selectedFiltersData,
    }),
  );
};

const handleMapViewportChange = (viewport: MapViewport) => {
  if (restoringUrl) return;
  mapViewport.value = viewport;
  updateURLParameters();
};

const handleMapMarkerChange = (id: string | undefined) => {
  if (restoringUrl) return;
  selectedMapMarkerId.value = id;
  updateURLParameters();
};

const restoreFromUrl = async () => {
  const version = ++restoreVersion;
  searchError.value = null;
  restoringUrl = true;
  try {
    const params = readParams();
    const state = readSearchParams(params);
    mapViewport.value = state.mapViewport;
    selectedMapMarkerId.value = state.mapMarker;
    showMapView.value = state.mode === 'map';
    selectedPage.value = state.page;
    searchKeyword.value = state.search;
    sortingString.value =
      state.sort ||
      searchBlockData.value.exposed_filters?.sort_by?.default_value ||
      null;
    const filters = state.filters.map((filter) => {
      const facet = Object.values(searchBlockData.value.facets || {}).find(
        (item) => item.url_alias === filter.searchQueryUrlAlias,
      );
      const item = facet?.items?.find(
        (item) => String(item.value) === String(filter.value),
      );
      return { ...filter, label: item?.label || String(filter.value) };
    });

    selectedFiltersData.splice(0, selectedFiltersData.length, ...filters);
    if (params.size > 0) {
      await getFilteredPageResults(false);
    } else {
      dynamicContent.value = searchBlockData.value.results || [];
      pager.value = searchBlockData.value.pager;
      totalItemsFound.value = searchBlockData.value.pager?.items;
      allSortingOptions.value = searchBlockData.value.facets;
    }
  } finally {
    await nextTick();
    if (version === restoreVersion) restoringUrl = false;
  }
};

onParamsChange(restoreFromUrl);

watch(
  selectedFiltersData,
  () => {
    if (restoringUrl) return;
    void getFilteredPageResults(true);
    updateURLParameters();
  },
  { flush: 'post' },
);

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
      const searchBlockResults = document.querySelector(
        '.search-block-provider__result-items',
      );

      if (searchBlockResults) {
        searchBlockResults.setAttribute('tabindex', '-1');
        searchBlockResults.focus({ preventScroll: true });
      }
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

watch(showMapView, async (newVal) => {
  if (restoringUrl) return;
  updateURLParameters();
  if (newVal) {
    try {
      loadingMap.value = true;
      const dataForMapMarkers = await fetchViewResults(true);
      if (!dataForMapMarkers) return;
      dynamicMapContent.value = dataForMapMarkers.results;
    } catch (error) {
      console.error('Error fetching map results:', error);
      dynamicMapContent.value = [];
    } finally {
      loadingMap.value = false;
      await nextTick();
      leafletMapRef.value?.refreshMapAndFitBounds();
    }
  }
});

const getBundleCTA = (bundle) => {
  const map = {
    Udbyder: 'Se udbyder',
    Virksomhed: 'Se virksomhed',
  };

  return map[bundle] || 'Se udbyder';
};

// Transform dynamicMapContent into Leaflet-friendly marker data
const leafletMarkers = computed(() =>
  dynamicMapContent.value
    .filter(
      (item) =>
        item.field_view_on_map === 'show_on_map' &&
        item.field_dawa_address?.lat &&
        item.field_dawa_address?.lng,
    )
    .map((item) => {
      let imageHtml = '';
      let innerWrapperClass = 'leaflet-popup-content__inner';
      if (item.field_logo?.img_element) {
        imageHtml = `<div class="leaflet-popup-content__image leaflet-popup-content__image--logo"><a href="${item.link}"><img src="${item.field_logo.img_element.uri}" alt="${item.field_image?.img_element.alt}" /></a></div>`;
      } else if (item.field_image.img_element) {
        imageHtml = `<div class="leaflet-popup-content__image leaflet-popup-content__image--image"><a href="${item.link}"><img src="${item.field_image.img_element.uri}" alt="${item.field_image.img_element.alt}" /></a></div>`;
      } else {
        innerWrapperClass += ' leaflet-popup-content__inner--no-image';
      }

      return {
        id: item.id,
        title: item.field_name,
        coords: [item.field_dawa_address.lat, item.field_dawa_address.lng],
        popupContent: `
          <div class="${innerWrapperClass}">
            ${imageHtml}
            <div class="leaflet-popup-content__content">
              <h2 class="h4"><a href="${item.link}">${item.field_name}</a></h2>
              <a href="${item.link}" class="leaflet-popup-content__link">${getBundleCTA(item.bundle_label)}</a>
            </div>
          </div>
        `,
      };
    }),
);

watch(leafletMarkers, (markers) => {
  if (
    !restoringUrl &&
    selectedMapMarkerId.value &&
    !matchingMapMarkerId(selectedMapMarkerId.value, markers)
  ) {
    handleMapMarkerChange(undefined);
  }
});

onMounted(async () => {
  isClient.value = true;
  await restoreFromUrl();
  isLoading.value = false;
  isLoadingPageResults.value = false;
});
</script>

<template>
  <div :id="id">
    <p v-if="searchError" role="alert">{{ searchError }}</p>
    <div class="search-block-provider">
      <div class="search-block-provider__label" v-if="searchBlockData?.label">
        {{ searchBlockData?.label }}
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12" v-if="!isLoading">
          <div class="search-block-provider__filters-container">
            <div class="search-block-provider__filters-container__inner">
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
              <ClientOnly>
                <div class="search-block-provider__list-map-toggle">
                  <button
                    class="button button--ghost"
                    v-if="dynamicContent.length > 0 && isClient && showListView"
                    @click="showMapView = true"
                  >
                    <NuxtIcon
                      class="search-block-provider__chip-close"
                      name="map"
                      filled
                    ></NuxtIcon>
                    <span>Vis på kort</span>
                  </button>
                  <button
                    class="button button--ghost"
                    v-if="dynamicContent.length > 0 && isClient && showMapView"
                    @click="showMapView = false"
                  >
                    <NuxtIcon
                      class="search-block-provider__chip-close"
                      name="grid"
                      filled
                    ></NuxtIcon>
                    <span>Vis listevisning</span>
                  </button>
                </div>
              </ClientOnly>
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
                v-for="item in allSortingOptions"
                :key="item.facet_id || item.url_alias"
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
                  :key="`${item.searchQueryUrlAlias}:${item.value}`"
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
                <div class="h4">Viser {{ totalItemsFound }} {{ searchResultSuffix }}</div>
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
                  :key="item.id || item.link"
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
                          <h2 class="h4" v-if="item?.field_name">
                            {{ item?.field_name }}
                          </h2>
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

            <ClientOnly>
              <LeafletMap
                v-if="showMapView"
                ref="leafletMapRef"
                :markers="leafletMarkers"
                :loading="loadingMap"
                :viewport="mapViewport"
                :selected-marker-id="selectedMapMarkerId"
                @marker-change="handleMapMarkerChange"
                @viewport-change="handleMapViewportChange"
              />
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
              <div class="h4">Ingen resultater</div>

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
  margin-bottom: 48px;
  padding-top: 48px;
  background-color: transparent;
  color: var(--theme-color);

  @media (min-width: 768px) {
    margin-bottom: 96px;
    padding-top: 96px;
  }

  &__label {
    margin-bottom: 24px;
    color: var(--theme-color);
    font-size: var(--font-size-h1);
    font-weight: 700;

    @media (min-width: 768px) {
      margin-bottom: 64px;
    }
  }

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
    position: relative;
    z-index: 2;
    display: flex;
    padding-top: 32px;
    gap: 24px;
    flex-wrap: wrap;
    min-height: auto;

    @media (min-width: 768px) {
      min-height: 88px;
    }

    &-container {
      &__inner {
        display: flex;
        flex-direction: row;
        align-items: end;
      }
    }
  }

  &__list-map-toggle {
    margin-left: auto;

    & .button {
      max-height: 59px;
      margin-left: 16px;
      border: var(--form-input-border);
      font-weight: 400;
      white-space: nowrap;

      @media (max-width: 767px) {
        .nuxt-icon {
          padding-right: 0;
        }
        span:not(.nuxt-icon) {
          display: none;
        }
      }
    }
  }

  &__search-keyword {
    width: 100%;

    @media (min-width: 768px) {
      width: 500px;
    }
  }

  &__extra-filters-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (min-width: 768px) {
      margin-bottom: 64px;
    }
  }

  &__dropdown {
    width: 100%;

    @media (min-width: 768px) {
      width: auto;
    }

    &--is-hidden {
      display: none;
    }

    &--is-hidden-mobile {
      @media (max-width: 991px) {
        display: none;
      }
    }
  }

  &__show-all-filters {
    display: flex;
    padding: 15px 32px;
    cursor: pointer;
    height: 56px;
    border-radius: 56px;
    background-color: var(--color-primary-lighten-4);
    font-size: 16px;
    font-weight: 700;
    color: var(--color-primary-darken-3);
    align-items: center;
    position: relative;
    transition: all 0.3s ease-in-out;
    border: 1px solid transparent;

    &--mobile {
      display: none;

      @media (max-width: 991px) {
        display: flex;
      }
    }

    &--desktop {
      display: flex;

      @media (max-width: 991px) {
        display: none;
      }
    }

    &:hover {
      background-color: var(--color-primary-lighten-3);
      border: 1px solid var(--color-primary);
      box-shadow: 0 0 0 4px #297f781a;
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
      display: block;

      @media (min-width: 768px) {
        display: none;
      }
    }
  }

  /* chips */
  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    padding-top: 24px;

    @media (min-width: 768px) {
      padding-top: 32px;
    }
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
    font-weight: 500;
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
    position: relative;
    z-index: 1;
    padding-top: 24px;

    @media (min-width: 768px) {
      padding-top: 96px;
    }

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

    .h4 {
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
    .h4 {
      margin: 0;
    }
  }

  &__result-items {
    display: flex;
    flex-wrap: wrap;
    gap: 24px 0;

    @media (min-width: 768px) {
      gap: 48px 24px;
    }

    &--loading {
      opacity: 0.5;
      cursor: wait;
    }
  }

  &__result-item {
    width: 100%;

    @media (min-width: 768px) {
      width: calc(50% - 12px);
    }
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
    padding: 24px;
    background: var(--color-white);
    border: 2px solid var(--color-primary-lighten-4);
    border-radius: 4px;
    box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.1);
    transition: all 0.3s ease-in-out;

    @media (min-width: 768px) {
      padding: 32px;
    }

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
    flex-direction: column;
    gap: 0;

    @media (min-width: 768px) {
      gap: 24px;
    }

    @media (min-width: 992px) {
      flex-direction: row;
    }
  }

  &__card-label {
    color: var(--color-text);
    transition: color 0.3s ease-in-out;

    .h4 {
      margin: 0;
    }
  }

  &__card-image-container {
    position: relative;
    flex: auto;
    width: 180px;
    margin-bottom: 24px;
    border-radius: 4px;
    overflow: hidden;

    @media (min-width: 768px) {
      width: 160px;
      margin-bottom: 0;
    }

    @media (min-width: 992px) {
      flex: 0 0 129px;
      width: 129px;
    }

    @media (max-width: 1399px) {
      flex: 0 0 188px;
      width: 188px;
    }
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
    padding-top: 32px;

    @media (min-width: 768px) {
      padding-top: 64px;
    }
  }

  .card {
    color: var(--color-text);
  }
}
</style>
