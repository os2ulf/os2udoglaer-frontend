<script setup lang="ts">
// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';

const apiRouteStore = useApiRouteStore();

const id = `search-block-${uuidv4()}`;

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

const searchBlockData = ref(props.blockData);
const backEndDomain = ref(apiRouteStore.apiRouteEndpoint);
const isLoading = ref(true);
const isLoadingPageResults = ref(true);
const searchKeyword = ref('');
const dynamicContent = ref(searchBlockData?.value?.results);
const searchResultString = ref(searchBlockData?.value?.result_string);
const pager = ref(searchBlockData?.value?.pager);
const defaultSortingOptions = ref(searchBlockData?.value?.facets);

const computedFilters = computed(() => {
  return defaultSortingOptions.value;
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
      selectedPriceFilter.value = '';
    }

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
      // remove date from filter
      if (filter.searchQueryUrlAlias === 'period') {
        return;
      }

      // Append each filter as &f[index]=<searchQueryUrlAlias>:<value> <- structure BE expects
      filterString += `&f[${index}]=${filter.searchQueryUrlAlias}:${filter.value}`;
    });

    const response: any = await fetch(
      `${backEndDomain.value}/transform/view-results/${searchBlockData.value.view_id}/${searchBlockData.value.display_id}?filters=${filterString}&search_string=${searchKeyword.value}&page=${selectedPage.value}&sort_by=${sortingString.value}&items_per_page=${pager.value.limit}&period[min]=${datePickerStartDate.value}&period[max]=${datePickerEndDate.value}`,
    );
    const data = await response.json();

    dynamicContent.value = data.results;
    searchResultString.value = data.result_string;
    pager.value = data.pager;
    defaultSortingOptions.value = data.facets;
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

  // Add date range
  if (datePickerStartDate.value && datePickerEndDate.value) {
    params.set('period[min]', datePickerStartDate.value);
    params.set('period[max]', datePickerEndDate.value);
  }

  // Add selected filters to URL parameters
  selectedFiltersData.forEach((filter, index) => {
    // Remove date from filters
    if (filter.searchQueryUrlAlias === 'period') {
      return;
    }

    params.append(
      `f[${index}]`,
      `${filter.searchQueryUrlAlias}:${filter.value}`,
    );
  });

  // Add selected page to URL parameters
  params.set('page', selectedPage.value.toString());

  // Use history.pushState to update the URL without reloading the page
  const newURL = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, '', newURL);
};

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

  // extract date range
  const minDate = params.get('period[min]');
  const maxDate = params.get('period[max]');
  if (minDate && maxDate) {
    datePickerStartDate.value = minDate;
    datePickerEndDate.value = maxDate;
  }

  // if finds anything - fetches data.
  if (extractedFilters.value.length > 0 || searchKeyword.value || page) {
    handleExtractedFilters();
  }
};

// populates selectedFiltersData with extracted filters - CHIPS
const setSelectedFiltersDataWithExtractedFilters = () => {
  selectedFiltersData.splice(0, selectedFiltersData.length);

  extractedFilters.value.forEach((filter) => {
    if (filter.searchQueryUrlAlias === 'period') {
      selectedFiltersData.push({
        searchQueryUrlAlias: filter.searchQueryUrlAlias,
        value: filter.value,
        label: `Fra ${datePickerStartDate.value} til ${datePickerEndDate.value}`,
      });
    }

    // Find the matching facet in allSortingOptions
    const matchingFacet = Object.values(allSortingOptions.value).find(
      (facet) => facet.url_alias === filter.searchQueryUrlAlias,
    );

    if (matchingFacet) {
      // Find the specific item in the matching facet's items array by value
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
      // exclude date from extractedFilters
      extractedFilters.value = extractedFilters.value.filter(
        (filter) => filter.searchQueryUrlAlias !== 'period',
      );

      // Append each filter as &f[index]=<searchQueryUrlAlias>:<value> <- structure BE expects
      queryString += `&f[${index}]=${filter.searchQueryUrlAlias}:${filter.value}`;
    });

    // add date back to extractedFilters
    if (datePickerStartDate.value && datePickerEndDate.value) {
      extractedFilters.value.push({
        searchQueryUrlAlias: 'period',
        value: `${datePickerStartDate.value}/${datePickerEndDate.value}`,
        label: `Fra ${datePickerStartDate.value} til ${datePickerEndDate.value}`,
      });
    }

    const response: any = await fetch(
      `${backEndDomain.value}/transform/view-results/${searchBlockData.value.view_id}/${searchBlockData.value.display_id}?${queryString}&search_string=${searchKeyword.value}&page=${selectedPage.value}&sort_by=${sortingString.value}&items_per_page=${pager.value.limit}&period[min]=${datePickerStartDate.value}&period[max]=${datePickerEndDate.value}`,
    );
    const data = await response.json();

    dynamicContent.value = data.results;
    searchResultString.value = data.result_string;
    pager.value = data.pager;
    defaultSortingOptions.value = data.facets;
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
  selectedPriceFilter.value = '';

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

onBeforeMount(() => {
  if (window.location.search) {
    parseUrlParameters();
  }
});

onMounted(() => {
  isLoading.value = false;
  isLoadingPageResults.value = false;
});

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
const isFreeFilterData = computed(() => {
  // Computed property to filter out only "is free" filters
  return Object.values(allFilterData.value).filter((item) =>
    [
      'course_is_free_primary_school',
      'course_is_free',
      'course_is_free_youth_education',
      'course_educators_is_free',
    ].includes(item?.facet_id),
  );
});
const selectedPriceFilter = ref('all');
const isFreeUrlAlias = ref(isFreeFilterData?.value[0]?.url_alias || '');
const selectedPriceLabel = ref();

watch(selectedPriceFilter, () => {
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

    selectedFiltersData.push({
      searchQueryUrlAlias: isFreeUrlAlias.value,
      value: selectedPriceFilter.value,
      label: matchedItem.label,
      source: 'isFreeFilter',
    });
  }
});
</script>

<template>
  <div :id="id">
    <div class="search-block">
      <div class="search-block__label" v-if="searchBlockData?.label">
        {{ searchBlockData?.label }}
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12" v-if="!isLoading">
          <div class="search-block__filters-container">
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

            <div class="search-block__filters" v-if="!isLoadingPageResults">
              <div
                class="search-block__dropdown"
                v-for="(item, name, idx) in allSortingOptions"
                :key="item || idx"
                :class="{
                  'search-block__dropdown--is-hidden':
                    idx >= 4 && !showAllFilters,
                  'search-block__dropdown--is-hidden-mobile': !showAllFilters
                    ? 'search-block__dropdown--is-hidden-mobile'
                    : '',
                }"
              >
                <ClientOnly>
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
                </ClientOnly>
              </div>

              <button
                class="search-block__show-all-filters search-block__show-all-filters--desktop"
                v-if="
                  Object.keys(allSortingOptions).length > 4 && !showAllFilters
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
                v-if="isFreeFilterData.length > 0"
                v-for="item in isFreeFilterData"
                :key="item"
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
                <div
                  class="search-block__chip"
                  v-for="item in selectedFiltersData"
                  :key="item"
                  @click="handleFilterChange(item, true)"
                >
                  <NuxtIcon
                    class="search-block__chip-close"
                    name="close"
                  ></NuxtIcon>
                  <span>{{ item?.label }}</span>
                </div>
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
            <div class="search-block__extra-filters-bar">
              <div class="search-block__results-found">
                <h4>{{ searchResultString }}</h4>
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
              class="search-block__result-items"
              :class="{
                'search-block__result-items--loading': isLoadingPageResults,
              }"
            >
              <TransitionGroup name="fade-in-search-results">
                <div
                  class="search-block__result-item"
                  v-for="item in dynamicContent"
                  :key="item"
                >
                  <div class="search-block__card-item">
                    <BaseCard :data="item" />
                  </div>
                </div>
              </TransitionGroup>
            </div>

            <BasePager
              class="search-block__pager"
              v-if="pager"
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
              <h4>Ingen resultater</h4>

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

<style lang="postcss">
.search-block {
  &__label {
    color: var(--color-tertiary);
    margin-bottom: 24px @(--sm) 64px;
    font-size: var(--font-size-h1);
    font-weight: 700;
  }

  padding-top: 48px @(--sm) 96px;
  margin-bottom: 48px @(--sm) 96px;
  background-color: transparent;
  color: var(--color-tertiary);

  &__skeleton {
    height: 100%;
  }

  /* removes overflow to the side, if the
  rightest nav option clips to the side of the page */
  overflow-x: clip;

  &__heading {
    margin-bottom: 0;
    color: var(--color-tertiary);
  }

  /* Filters stuff */
  &__filters {
    display: flex;
    padding-top: 32px;
    gap: 24px;
    flex-wrap: wrap;
    min-height: auto @(--sm) 88px;
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
      color: var(--color-tertiary);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      display: block @(--sm) none;
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
      outline: none;
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
      }
    }

    &__label {
      font-size: 14px;
      line-height: 18px;
      font-weight: 600;
      letter-spacing: 1px;
      color: var(--color-tertiary);
      cursor: pointer;
      vertical-align: middle;
      padding-left: 8px;
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
    padding: 0;
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
    height: 100%;
  }

  .form-input--floating-label {
    &.form-input--up ~ .form-label,
    &:focus ~ .form-label {
      background-color: var(--color-tertiary-lighten-6);
    }
  }

  .form-input {
    background-color: var(--color-tertiary-lighten-6);

    &:focus {
      background-color: var(--color-tertiary-lighten-6);
    }
  }

  &__pager {
    padding-top: 32px @(--sm) 64px;
  }

  .card {
    color: var(--color-tertiary);
  }
}

body {
  background-color: var(--color-tertiary-lighten-6);
}

/* overwrites */
.header-parent {
  background-color: var(--color-tertiary-lighten-6) !important;
}

.section {
  background-color: var(--color-tertiary-lighten-6) !important;
}
</style>
