<script setup lang="ts">
// @ts-nocheck
import { useId } from 'vue';
import type { MapViewport } from '~/utils/mapViewport';
import { matchingMapMarkerId } from '~/utils/mapMarker';
import { buildSearchParams, readSearchParams } from '~/utils/searchParams';
import LeafletMap from '~/components/globals/map/LeafletMap.client.vue';

const id = `search-block-${useId()}`;

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
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
const searchResultString = ref(searchBlockData?.value?.result_string);
const pager = ref(searchBlockData?.value?.pager);
const defaultSortingOptions = ref(searchBlockData?.value?.facets);
const showMapView = ref(false);
const mapViewport = shallowRef<MapViewport>();
const selectedMapMarkerId = ref<string>();
const showListView = computed(() => !showMapView.value);

const isClient = ref(false);

const leafletMapRef = ref(null);
const dynamicMapContent = ref<any[]>([]);
const loadingMap = ref(false);

// Exclude facet from default sorting options if facet_id is on of the below:
const excludedFacetIds = [
  'course_is_free',
  'course_is_free_primary_school',
  'course_is_free_youth_education',
  'course_educators_is_free',
  'period',
  'internship_company_guarantee_partner',
];

const defaultSortingOptionsFiltered = computed(() => {
  return Object.values(defaultSortingOptions.value).filter(
    (facet) => !excludedFacetIds.includes(facet.facet_id),
  );
});

// Set hidden sorting options to use for showing the "Alle filtre" button
const hiddenSortingOptions = ref(
  Object.values(defaultSortingOptions.value).filter(
    (facet) => facet.hidden === true,
  ),
);

const computedFilters = computed(() => {
  return defaultSortingOptionsFiltered.value;
});

const allSortingOptions = ref(computedFilters);
const pageSortingOptions = ref(searchBlockData?.value?.exposed_filters);
const selectedPage = ref(0);
const showAllFilters = ref(false);
const sortingString = ref(
  searchBlockData?.value?.exposed_filters.sort_by.default_value || null,
);
const datePickerStartDate = ref('');
const datePickerEndDate = ref('');
const datePickerLabel = ref(props.blockData?.exposed_filters?.period?.label);

// keeps track of filters and handles adding/removing selected filters
const selectedFiltersData = reactive([]);
const lastInteractedFilterReference = ref({});

const fetchViewResults = (map = false) => {
  const params = buildSearchParams({
    search: searchKeyword.value,
    page: selectedPage.value,
    sort: sortingString.value,
    filters: selectedFiltersData,
    startDate: datePickerStartDate.value,
    endDate: datePickerEndDate.value,
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
    // if date
    if (selectedFilterOption.searchQueryUrlAlias === 'period') {
      const index = selectedFiltersData.findIndex(
        (filter) => filter.searchQueryUrlAlias === 'period',
      );

      if (index !== -1) {
        datePickerEndDate.value = '';
        datePickerStartDate.value = '';

        updateURLParameters();
      }
    }

    // if is free filter
    if (selectedFilterOption.source === 'isFreeFilter') {
      selectedPriceFilter.value = 'all';
    }

    // if Guarantee Partner filter
    if (selectedFilterOption.source === 'guaranteePartnerFilter') {
      selectedGuaranteePartnerFilter.value = 'all';
    }

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
    searchResultString.value = data.result_string;
    pager.value = data.pager;
    defaultSortingOptions.value = data.facets;
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
      startDate: datePickerStartDate.value,
      endDate: datePickerEndDate.value,
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
      return {
        ...filter,
        label: item?.label || String(filter.value),
        source:
          filter.searchQueryUrlAlias === isFreeUrlAlias.value
            ? 'isFreeFilter'
            : filter.searchQueryUrlAlias === guaranteePartnerUrlAlias.value
              ? 'guaranteePartnerFilter'
              : undefined,
      };
    });
    datePickerStartDate.value = state.startDate;
    datePickerEndDate.value = state.endDate;
    selectedPriceFilter.value =
      state.filters.find(
        (filter) => filter.searchQueryUrlAlias === isFreeUrlAlias.value,
      )?.value || 'all';
    selectedGuaranteePartnerFilter.value =
      state.filters.find(
        (filter) =>
          filter.searchQueryUrlAlias === guaranteePartnerUrlAlias.value,
      )?.value || 'all';
    if (state.startDate && state.endDate) {
      filters.push({
        searchQueryUrlAlias: 'period',
        value: state.startDate + '/' + state.endDate,
        label: 'Fra ' + state.startDate + ' til ' + state.endDate,
      });
    }
    selectedFiltersData.splice(0, selectedFiltersData.length, ...filters);
    if (params.size > 0) {
      await getFilteredPageResults(false);
    } else {
      dynamicContent.value = searchBlockData.value.results || [];
      pager.value = searchBlockData.value.pager;
      searchResultString.value = searchBlockData.value.result_string;
      defaultSortingOptions.value = searchBlockData.value.facets;
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
  selectedPriceFilter.value = 'all';
  selectedGuaranteePartnerFilter.value = 'all';

  if (datePickerStartDate.value && datePickerEndDate.value) {
    datePickerStartDate.value = '';
    datePickerEndDate.value = '';
    updateURLParameters();
  }

  lastInteractedFilterReference.value = {
    isFilterDropdownOpen: false,
  };
};

const handlePager = (page: number) => {
  selectedPage.value = page;
  updateURLParameters();

  getFilteredPageResults(false, true).then(() => {
    const searchBlock = document.querySelector('.search-block');

    if (searchBlock) {
      searchBlock.scrollIntoView({ behavior: 'smooth' });
      const searchBlockResults = document.querySelector(
        '.search-block__result-items',
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

const formatDate = (isoString) => {
  const date = new Date(isoString);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
};

const handleDatePicker = (date) => {
  const formattedDates = date.map((item) => formatDate(item));

  if (formattedDates[0] && formattedDates[1]) {
    datePickerStartDate.value = formattedDates[0];
    datePickerEndDate.value = formattedDates[1];
    updateURLParameters();

    // THis code will push in calendar as a 'chip' in the filters chips part.
    const index = selectedFiltersData.findIndex(
      (filter) => filter.searchQueryUrlAlias === 'period',
    );

    if (index !== -1) {
      selectedFiltersData.splice(index, 1);
    }

    selectedFiltersData.push({
      searchQueryUrlAlias: 'period',
      value: `period[min]=${datePickerStartDate.value}&period[max]=${datePickerEndDate.value}`,
      label: `Fra ${datePickerStartDate.value} til ${datePickerEndDate.value}`,
    });
  }
};

const allFilterData = ref(searchBlockData?.value?.facets || {});

// Filter out only "is free" filters
const isFreeFacetIds = [
  'course_is_free_primary_school',
  'course_is_free',
  'course_is_free_youth_education',
  'course_educators_is_free',
];

const isFreeFilterData = computed(() => {
  return Object.values(allFilterData.value).filter((item) =>
    isFreeFacetIds.includes(item?.facet_id),
  );
});

const selectedPriceFilter = ref('all');
const isFreeUrlAlias = ref(isFreeFilterData?.value[0]?.url_alias || '');

watch(selectedPriceFilter, () => {
  if (restoringUrl) return;
  const matchedItem = isFreeFilterData.value[0]?.items.find(
    (item) => item.value === selectedPriceFilter.value,
  );

  if (matchedItem) {
    const existingFilterIndex = selectedFiltersData.findIndex(
      (filter) => filter.searchQueryUrlAlias === isFreeUrlAlias.value,
    );

    if (existingFilterIndex !== -1) {
      selectedFiltersData.splice(existingFilterIndex, 1);
    }

    if (selectedPriceFilter.value === 'all') return;
    selectedFiltersData.push({
      searchQueryUrlAlias: isFreeUrlAlias.value,
      value: selectedPriceFilter.value,
      label: matchedItem.label,
      source: 'isFreeFilter',
    });
  }
});

const guaranteePartnerFilterData = computed(() => {
  return Object.values(allFilterData.value).filter((item) =>
    ['internship_company_guarantee_partner'].includes(item?.facet_id),
  );
});

const selectedGuaranteePartnerFilter = ref('all');
const guaranteePartnerUrlAlias = ref(
  guaranteePartnerFilterData?.value[0]?.url_alias || '',
);

watch(selectedGuaranteePartnerFilter, () => {
  if (restoringUrl) return;
  const matchedItem = guaranteePartnerFilterData.value[0]?.items.find(
    (item) => item.value === selectedGuaranteePartnerFilter.value,
  );

  if (matchedItem) {
    const existingFilterIndex = selectedFiltersData.findIndex(
      (filter) => filter.searchQueryUrlAlias === guaranteePartnerUrlAlias.value,
    );

    if (existingFilterIndex !== -1) {
      selectedFiltersData.splice(existingFilterIndex, 1);
    }

    if (selectedGuaranteePartnerFilter.value === 'all') return;
    selectedFiltersData.push({
      searchQueryUrlAlias: guaranteePartnerUrlAlias.value,
      value: selectedGuaranteePartnerFilter.value,
      label: matchedItem.label,
      source: 'guaranteePartnerFilter',
    });
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
    course: 'Se forløbet',
    internship: 'Se praktikken',
    junior_apprenticeship: 'Se forløbet',
    course_educators: 'Se kurset',
  };

  return map[bundle] || 'Se forløbet';
};

// Transform dynamicMapContent into Leaflet-friendly marker data
const leafletMarkers = computed(() =>
  dynamicMapContent.value
    .filter(
      (item) =>
        (item.field_view_on_map === 'show_vendor_address' &&
          item.provider?.field_dawa_address?.data?.y &&
          item.provider?.field_dawa_address?.data?.x) ||
        (item.field_view_on_map === 'show_vendor_address' &&
          item.corporation?.field_dawa_address?.data?.y &&
          item.corporation?.field_dawa_address?.data?.x) ||
        (item.field_view_on_map === 'show_alternative_address' &&
          item.field_dawa_address?.lat &&
          item.field_dawa_address?.lng),
    )
    .map((item) => {
      let imageHtml = '';
      let innerWrapperClass = 'leaflet-popup-content__inner';
      if (item.field_image?.img_element) {
        imageHtml = `<div class="leaflet-popup-content__image leaflet-popup-content__image--image"><a href="${item.link}"><img src="${item.field_image.img_element.uri}" alt="${item.field_image.img_element.alt}" /></a></div>`;
      } else {
        innerWrapperClass += ' leaflet-popup-content__inner--no-image';
      }

      let latitude;
      let longitude;
      if (
        item.field_view_on_map === 'show_vendor_address' &&
        item.provider?.field_dawa_address?.data?.y &&
        item.provider?.field_dawa_address?.data?.x
      ) {
        latitude = item.provider?.field_dawa_address?.data?.y;
        longitude = item.provider?.field_dawa_address?.data?.x;
      } else if (
        item.field_view_on_map === 'show_vendor_address' &&
        item.corporation?.field_dawa_address?.data?.y &&
        item.corporation?.field_dawa_address?.data?.x
      ) {
        latitude = item.corporation?.field_dawa_address?.data?.y;
        longitude = item.corporation?.field_dawa_address?.data?.x;
      } else {
        latitude = item.field_dawa_address?.lat;
        longitude = item.field_dawa_address?.lng;
      }

      let providerHtml = '';
      if (item.provider) {
        providerHtml = `<p class="leaflet-popup-content__provider-link"><a href="${item.provider.link}">${item.provider.field_name}</a></p>`;
      }

      return {
        id: item.id,
        title: item.label,
        coords: [latitude, longitude],
        popupContent: `
        <div class="${innerWrapperClass}">
          ${imageHtml}
          <div class="leaflet-popup-content__content">
            <h2 class="h4"><a href="${item.link}">${item.label}</a></h2>
            ${providerHtml}
            <a href="${item.link}" class="leaflet-popup-content__link">${getBundleCTA(item.bundle)}</a>
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
    <div class="search-block">
      <div class="search-block__label" v-if="searchBlockData?.label">
        {{ searchBlockData?.label }}
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12" v-if="!isLoading">
          <div class="search-block__filters-container">
            <div class="search-block__filters-container__inner">
              <div class="search-block__search-keyword">
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
                <div class="search-block__list-map-toggle">
                  <button
                    class="button button--ghost"
                    v-if="dynamicContent.length > 0 && isClient && showListView"
                    @click="
                      showMapView = true;
                    "
                  >
                    <NuxtIcon
                      class="search-block__chip-close"
                      name="map"
                      filled
                    ></NuxtIcon>
                    <span>Vis på kort</span>
                  </button>
                  <button
                    class="button button--ghost"
                    v-if="dynamicContent.length > 0 && isClient && showMapView"
                    @click="
                      showMapView = false;
                    "
                  >
                    <NuxtIcon
                      class="search-block__chip-close"
                      name="grid"
                      filled
                    ></NuxtIcon>
                    <span>Vis listevisning</span>
                  </button>
                </div>
              </ClientOnly>
            </div>

            <div class="search-block__filters" v-if="!isLoadingPageResults">
              <div
                class="search-block__dropdown"
                v-for="item in allSortingOptions"
                :key="item.facet_id || item.url_alias"
                :class="{
                  'search-block__dropdown--is-hidden':
                    item.hidden && !showAllFilters,
                  'search-block__dropdown--is-hidden-mobile': !showAllFilters
                    ? 'search-block__dropdown--is-hidden-mobile'
                    : '',
                }"
              >
                <div v-if="item.exposed_filter === 'period'">
                  <BaseDatePicker
                    @datepicker-value="handleDatePicker"
                    :startAndEndDates="{
                      startDate: datePickerStartDate,
                      endDate: datePickerEndDate,
                    }"
                    :filter-name="datePickerLabel"
                  />
                </div>

                <BaseSearchDropdown
                  v-else
                  @dropdown-value="handleFilterChange"
                  :allFilters="item"
                  :last-interacted-filter-data="lastInteractedFilterReference"
                  :isLoading="isLoadingPageResults"
                />
              </div>

              <button
                class="search-block__show-all-filters search-block__show-all-filters--desktop"
                v-if="
                  Object.keys(hiddenSortingOptions).length > 0 &&
                  !showAllFilters
                "
                @click="showAllFilters = true"
              >
                <NuxtIcon
                  class="search-block__chip-close"
                  name="controls-vertical-alt"
                  filled
                ></NuxtIcon>
                Alle filtre

                <div class="search-block__show-all-filters__counter">
                  {{ Object.keys(allSortingOptions).length }}
                </div>
              </button>

              <button
                class="search-block__show-all-filters search-block__show-all-filters--mobile"
                v-if="!showAllFilters"
                @click="showAllFilters = true"
              >
                <NuxtIcon
                  class="search-block__chip-close"
                  name="controls-vertical-alt"
                  filled
                ></NuxtIcon>
                Alle filtre

                <div class="search-block__show-all-filters__counter">
                  {{ Object.keys(allSortingOptions).length }}
                </div>
              </button>

              <div
                v-for="item in isFreeFilterData"
                :key="item.facet_id"
                class="search-block__price-filter"
              >
                <div
                  v-for="(item, idx) in isFreeFilterData[0]?.items"
                  :key="idx"
                  class="search-block__price-filter__radio"
                >
                  <input
                    class="search-block__price-filter__input"
                    type="radio"
                    :id="id + item.label + item.value"
                    name="price"
                    :value="item.value"
                    v-model="selectedPriceFilter"
                  />
                  <label
                    class="search-block__price-filter__label"
                    :for="id + item.label + item.value"
                    >{{ item.label }}</label
                  >
                </div>
              </div>

              <div
                v-for="item in guaranteePartnerFilterData"
                :key="item.facet_id"
                class="search-block__price-filter"
              >
                <div
                  v-for="(item, idx) in guaranteePartnerFilterData[0]?.items"
                  :key="idx"
                  class="search-block__price-filter__radio"
                >
                  <input
                    class="search-block__price-filter__input"
                    type="radio"
                    :id="id + item.label + item.value"
                    name="price"
                    :value="item.value"
                    v-model="selectedGuaranteePartnerFilter"
                  />
                  <label
                    class="search-block__price-filter__label"
                    :for="id + item.label + item.value"
                    >{{ item.label }}</label
                  >
                </div>
              </div>
            </div>

            <div v-else class="search-block__skeleton">
              <BaseLoading />
            </div>

            <!-- chips -->
            <div
              class="search-block__chips"
              v-if="selectedFiltersData.length > 0"
            >
              <TransitionGroup name="pan-right">
                <button
                  class="search-block__chip"
                  v-for="item in selectedFiltersData"
                  :key="`${item.searchQueryUrlAlias}:${item.value}`"
                  @click="handleFilterChange(item, true)"
                >
                  <NuxtIcon
                    class="search-block__chip-close"
                    name="close"
                  ></NuxtIcon>
                  <span>{{ item?.label }}</span>
                </button>
              </TransitionGroup>
              <button
                @click="handleClearAllFilters"
                class="search-block__chip-clear"
                v-if="selectedFiltersData.length > 0"
                aria-label="Nulstil filtre"
              >
                Nulstil filtre
              </button>
            </div>
          </div>

          <div
            class="search-block__results-container"
            v-if="dynamicContent.length > 0"
          >
            <div class="search-block__extra-filters-bar" v-if="showListView">
              <div class="search-block__results-found">
                <div class="h4">{{ searchResultString }}</div>
              </div>
              <div class="search-block__sorting">
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
              class="search-block__result-items"
              :class="{
                'search-block__result-items--loading': isLoadingPageResults,
              }"
            >
              <TransitionGroup name="fade-in-search-results">
                <div
                  class="search-block__result-item"
                  v-for="item in dynamicContent"
                  :key="item.id || item.link"
                >
                  <article class="search-block__card-item">
                    <BaseCard :data="item" />
                  </article>
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
              class="search-block__pager"
              v-if="pager && showListView"
              :pager="pager"
              @change="handlePager"
            />
          </div>

          <div
            class="search-block__no-results-container"
            :class="{
              'search-block__no-results-container--loading':
                isLoadingPageResults,
            }"
            v-else
          >
            <div class="search-block__no-result-item">
              <div class="h4">Ingen resultater</div>

              <div
                v-if="isLoadingPageResults"
                class="search-block__spinner"
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

<style lang="postcss" scoped>
.search-block {
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

      &:focus {
        border: 1px solid var(--color-primary);
        box-shadow: 0 0 0 4px #297f781a;
        outline: none;
      }

      &:focus-visible {
        outline: -webkit-focus-ring-color auto 1px;
      }

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
    position: relative;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 15px 32px;
    background-color: var(--color-primary-lighten-4);
    color: var(--color-primary-darken-3);
    font-size: 16px;
    font-weight: 700;
    border-radius: 56px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

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
      box-shadow: 0px 0px 0px 4px #297f781a;
    }

    &__counter {
      display: block;
      position: absolute;
      top: -3px;
      right: 0;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background-color: var(--color-secondary);
      color: var(--color-secondary-text);
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 600;

      @media (min-width: 768px) {
        display: none;
      }
    }
  }

  .search-block__price-filter {
    padding-top: 10px;
    padding-left: 2px;
    display: flex;
    gap: 24px;
    width: 100%;
    text-align: left;

    &__radio {
      display: flex;
      align-items: center;
    }

    &__input {
      appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-border);
      border-radius: 50%;
      position: relative;
      cursor: pointer;
      transition: border 0.2s ease-in-out;
      display: inline-block;
      vertical-align: middle;

      /* Custom checked state */
      &:checked::before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        background-color: var(--color-primary);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &:checked {
        border-color: var(--color-primary);
      }

      &:focus {
        box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.3);
        outline: none;
      }

      &:focus-visible {
        outline: -webkit-focus-ring-color auto 1px;
      }
    }

    &__label {
      font-size: 14px;
      line-height: 18px;
      font-weight: 600;
      letter-spacing: 1px;
      color: var(--color-text);
      cursor: pointer;
      vertical-align: middle;
      padding-left: 8px;
    }
  }

  /* chips */
  &__chips {
    padding-top: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

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
    padding: 7px 16px;
    text-transform: uppercase;
    background: transparent;
    border: none;
    font-size: 14px;
    letter-spacing: 1px;
    color: var(--color-primary-darken-3);
    transition: color 0.3s ease-in-out;

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
    height: 100%;
  }

  .form-input--floating-label {
    &.form-input--up ~ .form-label,
    &:focus ~ .form-label {
      background-color: var(--color-gray-8);
    }
  }

  .form-input {
    background-color: var(--color-gray-8);

    &:focus {
      background-color: var(--color-gray-8);
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
