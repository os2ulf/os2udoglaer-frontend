<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from 'vue';

type SortingOption = {
  label: string;
  value: string;
  [key: string]: unknown;
};

const props = withDefaults(
  defineProps<{
    sortingFilterData?: {
      sort_by?: {
        label?: string;
        options?: SortingOption[] | Record<string, SortingOption> | null;
      };
    };
    isLoading?: boolean;
    defaultSelectedOption?: string | null;
  }>(),
  {
    sortingFilterData: () => ({}),
    isLoading: false,
    defaultSelectedOption: null,
  },
);

const id = `sorting-${useId()}`;
const emit = defineEmits<{
  sortingValue: [
    item: SortingOption & {
      searchQueryUrlAlias: string;
      isDropdownOpen: boolean;
    },
  ];
}>();
const root = ref<HTMLElement | null>(null);
const selector = ref<HTMLElement | null>(null);
const visible = ref(false);
const activeIndex = ref(-1);
const keyboardNavigation = ref(false);
const selectedValue = ref(props.defaultSelectedOption);
// CMS options may be keyed objects; normalize before indexing or navigating them.
const options = computed(() =>
  Object.values(props.sortingFilterData?.sort_by?.options ?? {}),
);
const label = computed(
  () => props.sortingFilterData?.sort_by?.label || 'Sortér efter',
);
const selectedIndex = computed(() => {
  const index = options.value.findIndex(
    (item) => item.value === selectedValue.value,
  );
  return index >= 0 ? index : options.value.length ? 0 : -1;
});
const selectedOption = computed(() => options.value[selectedIndex.value]);
const disabled = computed(() => props.isLoading || !options.value.length);
const optionId = (index: number) => `${id}-option-${index}`;
let searchText = '';
let lastSearchTime = 0;

watch(
  () => props.defaultSelectedOption,
  (value) => {
    selectedValue.value = value;
  },
);
watch([selectedIndex, options], ([index]) => {
  if (visible.value) setActive(index);
});
watch(disabled, (value) => {
  if (value) close();
});

function close() {
  visible.value = false;
  keyboardNavigation.value = false;
  searchText = '';
}

function setActive(index: number) {
  activeIndex.value = Math.max(0, Math.min(index, options.value.length - 1));
  nextTick(() => {
    if (visible.value) {
      document
        .getElementById(optionId(activeIndex.value))
        ?.scrollIntoView({ block: 'nearest' });
    }
  });
}

function open() {
  if (disabled.value) return;
  visible.value = true;
  setActive(selectedIndex.value);
}

function toggleDropdown() {
  if (visible.value) close();
  else open();
}

function select(index: number, restoreFocus = true) {
  const item = options.value[index];
  if (disabled.value || !item) return;
  const changed = item.value !== selectedOption.value?.value;
  selectedValue.value = item.value;
  close();
  if (restoreFocus) selector.value?.focus();
  if (changed) {
    emit('sortingValue', {
      ...item,
      searchQueryUrlAlias: 'sort_by',
      isDropdownOpen: false,
    });
  }
}

function commitOnBlur() {
  if (visible.value) select(activeIndex.value, false);
}

function handleKeydown(event: KeyboardEvent) {
  // Tab commits the pending option without preventing normal focus movement.
  if (event.key === 'Tab') {
    commitOnBlur();
    return;
  }
  if (event.key === 'Escape') {
    if (visible.value) {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
    return;
  }
  if (disabled.value || event.ctrlKey || event.metaKey) return;
  if (event.altKey && event.key !== 'ArrowDown' && event.key !== 'ArrowUp')
    return;

  // Keep DOM focus on the combobox; active descendants only preview options.
  const wasOpen = visible.value;
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      keyboardNavigation.value = true;
      if (wasOpen) select(activeIndex.value);
      else open();
      return;
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault();
      keyboardNavigation.value = true;
      if (event.altKey && event.key === 'ArrowUp') {
        if (wasOpen) select(activeIndex.value);
      } else if (!wasOpen) {
        open();
      } else if (!event.altKey) {
        setActive(activeIndex.value + (event.key === 'ArrowDown' ? 1 : -1));
      }
      return;
    case 'Home':
    case 'End':
    case 'PageUp':
    case 'PageDown':
      event.preventDefault();
      keyboardNavigation.value = true;
      if (!wasOpen) open();
      setActive(
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? options.value.length - 1
            : activeIndex.value + (event.key === 'PageDown' ? 10 : -10),
      );
      return;
  }

  if (event.key.length !== 1 || event.altKey) return;
  event.preventDefault();
  keyboardNavigation.value = true;
  if (!wasOpen) open();
  const now = Date.now();
  searchText =
    (now - lastSearchTime < 700 ? searchText : '') +
    event.key.toLocaleLowerCase('da');
  lastSearchTime = now;
  const repeated = [...searchText].every(
    (character) => character === searchText[0],
  );
  const query = repeated ? searchText[0] : searchText;
  const start =
    searchText.length === 1 || repeated
      ? activeIndex.value + 1
      : activeIndex.value;
  for (let offset = 0; offset < options.value.length; offset++) {
    const index = (start + offset) % options.value.length;
    if (options.value[index].label.toLocaleLowerCase('da').startsWith(query)) {
      setActive(index);
      break;
    }
  }
}

function handlePointerOutside(event: PointerEvent) {
  if (event.target instanceof Node && !root.value?.contains(event.target)) {
    commitOnBlur();
  }
}

onMounted(() => document.addEventListener('pointerdown', handlePointerOutside));
onUnmounted(() =>
  document.removeEventListener('pointerdown', handlePointerOutside),
);
</script>

<template>
  <div
    ref="root"
    :id="id"
    class="sorting"
    :class="{ 'sorting--focus': visible }"
    @pointerdown="keyboardNavigation = false"
    @pointermove="keyboardNavigation = false"
  >
    <span :id="`${id}-label`" class="sorting__field-label">{{ label }}</span>
    <div
      ref="selector"
      class="sorting__selector"
      :class="{ 'sorting__selector--border': visible }"
      role="combobox"
      tabindex="0"
      aria-haspopup="listbox"
      :aria-labelledby="`${id}-label`"
      :aria-expanded="visible"
      :aria-controls="`${id}-listbox`"
      :aria-activedescendant="
        visible && activeIndex >= 0 ? optionId(activeIndex) : undefined
      "
      :aria-disabled="disabled"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      @blur="commitOnBlur"
    >
      <div class="sorting__label">
        <span
          class="sorting__title"
          :class="{
            'sorting__title--focus': visible,
            'sorting__title--active': selectedOption?.label !== label,
          }"
        >
          {{ selectedOption?.label }}
        </span>
        <div
          class="sorting__arrow"
          :class="{
            sorting__arrow__rotate: visible,
            'sorting__arrow--active': selectedOption?.label !== label,
          }"
        >
          <NuxtIcon name="swap-vertical" filled aria-hidden="true" />
        </div>
      </div>
    </div>

    <Transition name="pan-top">
      <div
        v-show="visible"
        :id="`${id}-listbox`"
        class="sorting__list sorting__list__visible"
        role="listbox"
        :aria-labelledby="`${id}-label`"
        :aria-hidden="!visible"
      >
        <ul role="presentation">
          <li
            v-for="(item, index) in options"
            :id="optionId(index)"
            :key="item.value"
            class="sorting__item"
            role="option"
            :aria-selected="item.value === selectedOption?.value"
            @mousedown.prevent
            @click="select(index)"
          >
            <span
              class="sorting__list-item"
              :class="{
                'sorting__list-item--selected':
                  item.value === selectedOption?.value,
                'sorting__list-item--active':
                  visible && keyboardNavigation && index === activeIndex,
              }"
              >{{ item.label }}</span
            >
          </li>
        </ul>
      </div>
    </Transition>
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

  &__field-label {
    display: block;
    padding: 0 24px;
    color: var(--color-gray-62);
  }

  &__selector {
    display: inline-block;
    width: inherit;
    margin: 0;
    border: 1px solid transparent;
    background-color: transparent;
    padding: 0;
    font-weight: var(--body-font-weight);
    text-align: center;
    vertical-align: baseline;

    &:focus {
      border: 1px solid var(--color-primary);
      box-shadow: 0 0 0 4px #297f781a;
      outline: none;
    }
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
    box-shadow: 0 4px 30px 0 #0000001a;
    border-radius: 4px;
    padding: 24px 20px;
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
    display: block;
    width: 100%;
    padding: 4px;
    cursor: pointer;
    color: #212121;
    line-height: 1.125;
    font-weight: 400;
    font-size: var(--font-size-paragraph-sm);
    text-align: left;
    background-color: transparent;
    border: 1px solid transparent;

    &:hover {
      opacity: 0.7;
      color: var(--color-primary);
    }

    &:focus {
      border: 1px solid var(--color-primary);
      box-shadow: 0 0 0 4px #297f781a;
      outline: none;
    }

    &--active {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
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
    margin-top: 16px;

    &:first-child {
      margin-top: 0;
    }

    label {
      cursor: pointer;
    }
  }
}
</style>
