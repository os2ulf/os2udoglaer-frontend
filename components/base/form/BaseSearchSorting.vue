<script setup lang="ts">
// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';

const props = defineProps({
  sortingFilterData: {
    type: Object,
  },

  isLoading: {
    type: Boolean,
    default: false,
  },

  defaultSelectedOption: {
    type: String,
    default: null,
  },
});

const id = `sorting-${uuidv4()}`;
const emit = defineEmits(['sortingValue']);
const visible = ref(false);
const sortingFilterData = ref(props.sortingFilterData);

const defaultFilterLabel = ref('Sorteret efter');
const selectedFilterLabel = ref(null);
const computedDefaultSelectedOption = computed(() => {
  return props.defaultSelectedOption;
});

const computedLabel = computed(() => {
  return selectedFilterLabel.value
    ? selectedFilterLabel.value
    : defaultFilterLabel.value;
});

const computedIsLoading = computed(() => {
  return props.isLoading;
});

const toggleDropdown = () => {
  visible.value = !visible.value;
};

const select = (item) => {
  if (item.value === selectedFilterLabel.value) {
    visible.value = false;
    return;
  }

  selectedFilterLabel.value = item.value;

  item = {
    ...item,
    searchQueryUrlAlias: 'sort_by',
    isDropdownOpen: false,
  };

  visible.value = false;
  emit('sortingValue', item);
};

// select without emitting
const selectWithoutEmit = (filterOption) => {
  selectedFilterLabel.value = filterOption;
};

const handleClickOutside = (e) => {
  if (!e.target.closest(`#${id}`)) {
    visible.value = false;
  }
};

// Select default sorting option
const selectDefaultSortingOption = () => {
  if (props.defaultSelectedOption) {
    for (const option of sortingFilterData.value.sort_by.options) {
      if (option.key == computedDefaultSelectedOption.value) {
        selectWithoutEmit(option.value);
      }
    }
  }
};

onMounted(() => {
  selectDefaultSortingOption();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div
    :id="id"
    class="sorting"
    :class="{ 'sorting--focus': visible }"
    @click="toggleDropdown"
    aria-label="Sorting dropdown"
  >
    <button
      class="sorting__selector"
      :class="{ 'sorting__selector--border': visible }"
      aria-label="Filter dropdown"
    >
      <div class="sorting__label">
        <span
          class="sorting__title"
          :class="{
            'sorting__title--focus': visible,
            'sorting__title--active': computedLabel !== defaultFilterLabel,
          }"
          >{{ computedLabel }}</span
        >
        <div
          class="sorting__arrow"
          :class="{
            sorting__arrow__rotate: visible,
            'sorting__arrow--active': computedLabel !== defaultFilterLabel,
          }"
        >
          <NuxtIcon name="swap-vertical" filled />
        </div>
      </div>
    </button>

    <TransitionGroup name="pan-top">
      <div
        class="sorting__list"
        :class="{
          sorting__list__visible: visible,
          sorting__list__hidden: !visible,
        }"
        v-if="visible"
        @click.stop
      >
        <ul :class="isLoading ? 'sorting__list--loading' : ''">
          <li
            class="sorting__item"
            v-for="item in sortingFilterData.sort_by.options"
            :key="item"
          >
            <label
              class="sorting__list-item"
              :class="
                computedLabel === item.value
                  ? 'sorting__list-item--selected'
                  : ''
              "
              @click="select(item)"
            >
              {{ item.value }}
            </label>
          </li>
        </ul>
      </div>
    </TransitionGroup>
  </div>
</template>
<style lang="postcss" scoped>
.sorting {
  width: inherit;
  cursor: pointer;
  position: relative;
  color: #444444;
  font-weight: 500;
  font-size: var(--font-size-paragraph-sm);
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  :deep(svg) {
    transform: translateY(-2px);
  }

  &__title {
    &--focus {
      color: var(--color-primary);
    }

    &--active {
      color: var(--color-primary);
      transition: color 0.3s ease-in-out;

      :deep(path) {
        stroke: var(--color-primary);
      }

      &:hover {
        opacity: 0.7;
      }
    }
  }

  &__selector {
    width: inherit;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 0;
  }

  &__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    color: var(--color-gray-62);
    font-size: var(--font-size-paragraph-sm);

    &:hover {
      color: var(--color-primary);

      :deep(path) {
        transition: all 0.3s ease-in-out;
        stroke: var(--color-primary);
      }
    }
  }

  &__arrow {
    width: fit-content;
    margin-left: 8px;
    transform: rotateZ(0deg) translateY(0);
    transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
    transition-duration: 0.3s;
    font-size: 24px;

    :deep(path) {
      transition: all 0.3s ease-in-out;
      stroke: #212121;
    }

    &__rotate {
      transform: rotateZ(180deg) translateY(0);

      :deep(path) {
        stroke: var(--color-primary);
      }
    }

    &--active {
      :deep(path) {
        stroke: var(--color-primary);
      }
    }
  }

  &__list {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 8;
    width: 100%;
    background: var(--color-white);
    box-shadow: 0px 4px 30px 0px #0000001a;
    border-radius: 4px;
    padding: 32px 24px;
    cursor: default;

    &__visible {
      visibility: visible;
      transition: all 0.15s ease;
      min-width: max-content;
    }

    &__hidden {
      visibility: hidden;
      transition: all 0.15s ease;
      min-width: max-content;
    }

    &--loading {
      filter: blur(2px);
      pointer-events: none;
    }
  }

  &__list-item {
    display: flex;
    width: fit-content;
    color: var(--color-text);
    font-weight: 400;
    font-size: 16px;
    align-items: center;
    cursor: pointer;
    font-size: var(--font-size-paragraph-sm);
    line-height: 1.125;
    color: #212121;

    &:hover {
      opacity: 0.7;
      color: var(--color-primary);
    }

    &--selected {
      color: var(--color-primary);
    }
  }

  ul {
    padding: 0;
    list-style-type: none;
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
</style>
