<script setup lang="ts">
// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  allFilters: {
    type: Object,
  },

  lastInteractedFilterData: {
    type: Object,
  },

  isLoading: {
    type: Boolean,
  },
});

const id = `dropdown-${uuidv4()}`;
const emit = defineEmits(['dropdownValue']);
const visible = ref(false);
const filterLabel = ref(props.allFilters.label);
const searchQueryUrlAlias = ref(props.allFilters.url_alias);
const allFilterOptions = ref(Object.values(props.allFilters.items));
const filteredOptions = ref([...allFilterOptions.value]);
const searchFilterOptionKeyword = ref('');

const computedIsLoading = computed(() => {
  return props.isLoading;
});

const computedLastInteractedFilterData = computed(() => {
  return props.lastInteractedFilterData;
});

const toggleDropdown = () => {
  visible.value = !visible.value;
};

const select = (item) => {
  item.selected = !item.selected;
  emit('dropdownValue', {
    ...item,
    searchQueryUrlAlias: searchQueryUrlAlias.value,
    isDropdownOpen: true,
  });
};

const handleClickOutside = (e) => {
  if (!e.target.closest(`#${id}`)) {
    visible.value = false;
  }
};

const handleSearchingFilterOptions = () => {
  if (searchFilterOptionKeyword.value) {
    filteredOptions.value = allFilterOptions.value.filter((item) => {
      return item.label
        .toLowerCase()
        .includes(searchFilterOptionKeyword.value.toLowerCase());
    });
  } else {
    filteredOptions.value = [...allFilterOptions.value];
  }
};

onBeforeMount(() => {
  if (
    computedLastInteractedFilterData.value.lastInteractedFilter ==
      searchQueryUrlAlias.value &&
    computedLastInteractedFilterData.value.isFilterDropdownOpen
  ) {
    visible.value = true;
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div
    :id="id"
    class="dropdown"
    :class="{ 'dropdown--focus': visible }"
    @click="toggleDropdown"
    aria-label="Filter dropdown"
  >
    <button
      class="dropdown__selector"
      :class="{ 'dropdown__selector--border': visible }"
      aria-label="Filter dropdown"
    >
      <div class="dropdown__label">
        <span
          class="dropdown__title"
          :class="{ 'dropdown__title--focus': visible }"
          >{{ filterLabel }}</span
        >
        <div
          class="dropdown__arrow"
          :class="{ dropdown__arrow__rotate: visible }"
        >
          <NuxtIcon name="chevron-down" filled />
        </div>
      </div>
    </button>

    <TransitionGroup name="slide-top-dropdown">
      <div
        class="dropdown__list"
        :class="{
          dropdown__list__visible: visible,
          dropdown__list__hidden: !visible,
        }"
        v-if="visible"
        @click.stop
      >
        <ul :class="isLoading ? 'dropdown__list--loading' : ''">
          <li
            class="dropdown__search-wrapper"
            v-if="Object.keys(allFilterOptions).length > 10"
          >
            <BaseInputFloatingLabel
              v-model="searchFilterOptionKeyword"
              type="text"
              name="search"
              label="Søg"
              class="dropdown__search"
              @input="handleSearchingFilterOptions"
            />
          </li>

          <TransitionGroup name="list">
            <li
              class="dropdown__item"
              v-for="(item, index) in filteredOptions"
              :key="item"
            >
              <label
                class="dropdown__checkbox"
                :class="{ 'dropdown__checkbox--disabled': item.count === 0 }"
                aria-label="Checkbox"
              >
                <input
                  type="checkbox"
                  :name="item.key"
                  :id="item.key"
                  @click="select(item)"
                  :checked="item.selected"
                  :disabled="item.count === 0"
                  aria-label="Checkbox"
                />
                <span
                  class="dropdown__checkbox-label"
                  :class="{
                    'dropdown__checkbox-label--disabled': item.count === 0,
                  }"
                >
                  {{ item.label }}
                  <span class="dropdown__checkbox-count"
                    >({{ item.count }})</span
                  >
                </span>
              </label>
            </li>
          </TransitionGroup>
          <div class="dropdown__no-results" v-if="filteredOptions.length === 0">
            <p>Ingen resultater</p>
          </div>
        </ul>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="postcss" scoped>
.dropdown {
  width: inherit;
  height: inherit;
  cursor: pointer;
  position: relative;
  height: inherit;
  color: #444444;
  font-weight: 400;
  font-size: var(--font-size-paragraph-sm);
  border: 1px solid #707070;
  border-radius: 32px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  z-index: 2;
  padding: 8px 0 8px 0;

  &__title {
    text-align: left;

    &--focus {
      color: var(--color-primary);
    }
  }

  &--focus {
    border: 1px solid var(--color-primary);
    box-shadow: 0px 0px 0px 4px #297f781a;
    z-index: 9;
  }

  &__selector {
    width: inherit;
    border: none;
    outline: none;
    background-color: transparent;
  }

  &__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    color: var(--color-gray-62);
    font-size: var(--font-size-paragraph-sm);
    /* widen the button size, so it fits longer filter labels */
    min-width: 300px;
  }

  &__checkbox-label {
    font-size: var(--font-size-paragraph-sm);
    line-height: 1.125;
    color: #212121;
    margin-left: 8px;
    word-break: break-word;
    hyphens: auto;

    &--disabled {
      color: #9b9b9b;
    }
  }

  &__checkbox-count {
    font-size: var(--font-size-paragraph-sm);
    line-height: 1.125;
    color: #9b9b9b;
  }

  &__arrow {
    width: fit-content;
    margin-left: 42px;
    transform: rotateZ(0deg) translateY(0);
    transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
    transition-duration: 0.3s;
    font-size: 24px;

    &__rotate {
      transform: rotateZ(180deg) translateY(0);

      :deep(path) {
        transition: all 0.3s ease-in-out;
        stroke: var(--color-primary);
      }
    }
  }

  &__item {
    position: relative;
    z-index: 9;
  }

  &__list {
    position: absolute;
    z-index: 9;
    width: 100%;
    overflow: scroll;
    padding: 0;
    background: var(--color-white);
    box-shadow: 0px 4px 30px 0px #0000001a;
    border-radius: 4px;
    margin-top: 13px;
    padding: 32px 24px;
    cursor: default;

    &__visible {
      visibility: visible;
      transition: all 0.15s ease;
      max-height: 600px;
      overflow: scroll;
    }

    &__hidden {
      visibility: hidden;
      transition: all 0.15s ease;
    }

    &--loading {
      filter: blur(2px);

      /* disable clicking on items */
      pointer-events: none;
    }
  }

  &__no-results {
    font-weight: 400;

    p {
      padding: 0;
      margin: 0;
    }
  }

  &__search-wrapper {
    margin-bottom: 25px;
  }

  &__checkbox {
    display: flex;
    width: fit-content;
    color: var(--color-text);
    font-weight: 400;
    font-size: 16px;
    align-items: center;
    cursor: pointer;

    &:hover {
      opacity: 0.7;

      .dropdown__checkbox-label {
        color: var(--color-primary);
      }
    }

    &--disabled {
      cursor: not-allowed !important;
    }

    input {
      height: 20px;
      width: 20px;
      padding-right: 16px;
      border: 2px solid var(--color-gray-25);
      border-radius: 2px;
      position: relative;
      appearance: none;
      background-color: var(--color-white);
    }
  }

  input:checked {
    background-color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }

  input:checked::after {
    content: '✓';
    color: var(--color-white);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    text-align: left;
    color: var(--color-gray-62);
    margin-top: 24px;

    &:first-child {
      margin-top: 0;
    }

    label {
      cursor: pointer;
    }
  }
}

/* restyling search input field */
:deep(.form-input-wrapper) {
  input {
    background-color: transparent;
    font-size: var(--font-size-paragraph-sm);

    &:focus {
      background-color: transparent;
    }
  }

  .form-label {
    transform: translateY(1px);
  }

  .form-input--floating-label.form-input--up ~ .form-label {
    background-color: var(--color-white);
  }

  .form-input--floating-label:focus ~ .form-label {
    background-color: var(--color-white);
  }
}
</style>
