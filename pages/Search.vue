<script setup lang="ts">
useHead({
  title: 'Søg',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: 'Søg i alle sider',
    },
  ],
});

// TODO: Once we create logic to dynamically set the right BE Domain, use it here
const backEndDomain = ref(
  'https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site',
);
const isLoading = ref(true);
const searchKeyword = ref('');
const dynamicContent = ref(null);
const totalItemsFound = ref(null);
const pager = ref(null);
const allSortingOptions = ref(null);
const selectedPage = ref(0);
const isLoadingPageResults = ref(false);
const showAllFilters = ref(false);

const getInitialSearchResults = async () => {
  try {
    const response: any = await $fetch(
      `${backEndDomain.value}/search?format=json&region=content`,
    );

    dynamicContent.value = response.content.results;
    totalItemsFound.value = response.content.pager.items;
    pager.value = response.content.pager;
    allSortingOptions.value = response.content.facets;
  } catch (error) {
    console.error('Error fetching search results:', error);
  } finally {
    isLoading.value = false;
  }
};

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
      `${backEndDomain.value}/search?format=json&region=content${filterString}&search_string=${searchKeyword.value}&page=${selectedPage.value}`,
    );
    const data = await response.json();

    dynamicContent.value = data.content.results;
    totalItemsFound.value = data.content.pager.items;
    pager.value = data.content.pager;
    allSortingOptions.value = data.content.facets;
  } catch (error) {
    console.error('Error fetching filtered results:', error);
  } finally {
    isLoadingPageResults.value = false;
  }
};

watch(selectedFiltersData, () => {
  getFilteredPageResults(true);
  updateURLParameters();
});

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

const handlePager = (page: number) => {
  selectedPage.value = page;
  updateURLParameters();

  getFilteredPageResults(false, true).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

const handleClearAllFilters = () => {
  selectedFiltersData.splice(0, selectedFiltersData.length);

  lastInteractedFilterReference.value = {
    isFilterDropdownOpen: false,
  };
};

const updateURLParameters = () => {
  const params = new URLSearchParams();

  // Add search keyword to URL parameters
  if (searchKeyword.value) {
    params.set('search_string', searchKeyword.value);
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
      (facet) => facet.facet_id === filter.searchQueryUrlAlias,
    );

    if (matchingFacet) {
      // Find the specific item in the matching facet's items
      const selectedItem = matchingFacet.items[filter.value];

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
      `${backEndDomain.value}/search?format=json&region=content${queryString}&search_string=${searchKeyword.value}&page=${selectedPage.value}`,
    );

    const data = await response.json();
    dynamicContent.value = data.content.results;
    totalItemsFound.value = data.content.pager.items;
    pager.value = data.content.pager;
    allSortingOptions.value = data.content.facets;
    isLoading.value = false;

    setSelectedFiltersDataWithExtractedFilters();
  } catch (error) {
    console.error('Error fetching filtered results:', error);
  }
};

onBeforeMount(() => {
  if (window.location.search) {
    parseUrlParameters();
  } else {
    getInitialSearchResults();
  }
});
</script>

<template>
  <div class="search">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12" v-if="!isLoading">
          <div class="search__filters-container">
            <div class="search__search-keyword">
              <BaseInputFloatingLabel
                v-model="searchKeyword"
                type="text"
                name="search"
                label="Søg"
                :is-search="true"
                @input="handleSearchByKeyword"
              />
            </div>

            <div class="search__filters" v-if="!isLoadingPageResults">
              <div
                class="search__dropdown"
                v-for="(item, name, idx) in allSortingOptions"
                :key="item"
                :class="{
                  'search__dropdown--is-hidden': idx >= 4 && !showAllFilters,
                  'search__dropdown--is-hidden-mobile': !showAllFilters
                    ? 'search__dropdown--is-hidden-mobile'
                    : '',
                }"
              >
                <BaseSearchDropdown
                  @dropdown-value="handleFilterChange"
                  :allFilters="item"
                  :last-interacted-filter-data="lastInteractedFilterReference"
                  :isLoading="isLoadingPageResults"
                />
              </div>
              <button
                class="search__show-all-filters"
                v-if="
                  Object.keys(allSortingOptions).length > 3 && !showAllFilters
                "
                @click="showAllFilters = true"
              >
                <NuxtIcon
                  class="search__chip-close"
                  name="controls-vertical-alt"
                  filled
                ></NuxtIcon>
                Alle filtre

                <div class="search__show-all-filters__counter">
                  {{ Object.keys(allSortingOptions).length }}
                </div>
              </button>
            </div>
            <div v-else class="search__skeleton">
              <BaseLoading />
            </div>

            <!-- chips -->
            <div class="search__chips" v-if="selectedFiltersData.length > 0">
              <TransitionGroup name="pan-right">
                <div
                  class="search__chip"
                  v-for="item in selectedFiltersData"
                  :key="item"
                  @click="handleFilterChange(item, true)"
                >
                  <NuxtIcon class="search__chip-close" name="close"></NuxtIcon>
                  <span>{{ item?.label }}</span>
                </div>
              </TransitionGroup>
              <button
                @click="handleClearAllFilters"
                class="search__chip-clear"
                v-if="selectedFiltersData.length > 0"
                aria-label="Nulstil filtre"
              >
                Nulstil filtre
              </button>
            </div>
          </div>

          <div
            class="search__results-container"
            v-if="dynamicContent.length > 0"
          >
            <div class="search__extra-filters-bar">
              <div class="search__results-found">
                <h4>Viser {{ totalItemsFound }} forløb</h4>
              </div>
            </div>

            <div
              class="search__result-items"
              :class="{ 'search__result-items--loading': isLoadingPageResults }"
            >
              <TransitionGroup name="fade-in-search-results">
                <div
                  class="search__result-item"
                  v-for="item in dynamicContent"
                  :key="item"
                >
                  <div class="search__card-item">
                    <BaseCard :data="item" />
                  </div>
                </div>
              </TransitionGroup>
            </div>

            <BasePager
              class="search__pager"
              v-if="pager"
              :pager="pager"
              @change="handlePager"
            />
          </div>

          <div
            class="search__no-results-container"
            :class="{
              'search__no-results-container--loading': isLoadingPageResults,
            }"
            v-else
          >
            <div class="search__no-result-item">
              <h4>Ingen resultater</h4>

              <div v-if="isLoadingPageResults" class="search__spinner"></div>
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
.search {
  padding-top: 48px @(--sm) 96px;
  margin-bottom: 48px @(--sm) 96px;
  background-color: var(--color-tertiary-lighten-6);
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

.header-parent {
  background-color: var(--color-tertiary-lighten-6) !important;
}
</style>
