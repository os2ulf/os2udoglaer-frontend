<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

const isLoading = ref(false);
const relatedContent = ref(props.data.relatedContent);
const componentKey = ref(0);

const processedFilters = computed(() => {
  const targetGroupFilters =
    ref(relatedContent.value?.exposed_filters?.target_group?.options) || null;

  const exposedFilters =
    ref(relatedContent.value?.exposed_filters?.type?.options) || null;

  // remove 'all'
  const processedExposedFilters = exposedFilters.value.filter(
    (filter: any) => filter.value !== 'All',
  );
  const processedTargetGroupFilters = targetGroupFilters.value.filter(
    (filter: any) => filter.value !== 'All',
  );

  // create a new object, that will have "All" as first value and then add the rest values onto it
  const allFilterAdded = ref([
    {
      label: 'Alle',
      value: 'Alle',
    },
    ...processedTargetGroupFilters,
    ...processedExposedFilters,
  ]);

  return {
    exposedFilters: allFilterAdded,
  };
});

const allSortingOptions = ref(processedFilters.value.exposedFilters);

const dynamicContent = ref(null);
const content = computed(() =>
  dynamicContent.value
    ? dynamicContent.value
    : props.data.relatedContent.results,
);

const currentFilter = ref('Alle');
const handleSorting = (key: any) => {
  if (key.label === currentFilter.value) {
    return;
  }

  isLoading.value = true;
  currentFilter.value = key.label;

  if (key.label === 'Alle') {
    dynamicContent.value = props.data.relatedContent.results;
  } else if (key.value === 'course') {
    dynamicContent.value = props.data.relatedContent.results.filter(
      (item: any) => {
        return item.bundle === 'course';
      },
    );
  } else {
    dynamicContent.value = props.data.relatedContent.results.filter(
      (item: any) => {
        if (item.bundle === 'course') {
          return item.field_target_group === key.label;
        } else {
          return item.bundle === key.label || item.bundle_label === key.label;
        }
      },
    );
  }

  componentKey.value += 1;

  setTimeout(() => {
    isLoading.value = false;
  }, 200);
};
</script>

<template>
  <div class="related-content">
    <div class="related-content__title-container">
      <h2>Forløb udbudt af {{ data?.title }}</h2>
      <p class="related-content__description">
        Se forløb til dagtilbud, grundskole eller ungdomsuddannelse herunder
      </p>
    </div>

    <div class="related-content__filters-container">
      <div class="related-content__filters">
        <button
          class="related-content__filter-item"
          v-for="item in allSortingOptions"
          @click="handleSorting(item)"
          :key="item"
          :class="
            currentFilter === item.label
              ? 'related-content__filter-item--active'
              : ''
          "
          :aria-label="item"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div :class="isLoading ? 'related-content__wrapper--loading' : ''">
      <div v-if="content.length > 0">
        <transition-group
          name="fade-in"
          class="related-content__wrapper row"
          tag="div"
        >
          <div
            class="col-xs-12 col-sm-12 col-md-12 col-lg-6 related-content__card"
            v-for="(item, index) in content"
            :key="index"
          >
            <div class="related-content__card-item" :key="componentKey">
              <BaseCard :data="item" />
            </div>
          </div>
        </transition-group>
      </div>

      <div v-else>
        <h4>Ingen resultater</h4>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.related-content {
  &__title-container {
    margin-bottom: 18px @(--sm) 36px;
  }

  &__description {
    margin-bottom: 0;
  }

  &__filters-container {
    padding-top: 6px;
    margin-bottom: 30px @(--sm) 64px;
  }

  &__filters {
    position: relative;
    display: flex;
    flex-flow: wrap;
    width: fit-content;
    border: 2px solid var(--color-primary-lighten-3);
    border-radius: 25px;
    padding-top: 2px;
    padding-left: 2px;
  }

  &__filter-item {
    border: none;
    background-color: transparent;
    border-radius: 50px;
    color: var(--color-primary);
    padding: 10px 16px;
    font-weight: 700;
    font-size: 14px @(--sm) 16px;
    line-height: 1.25;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-right: 2px;
    margin-bottom: 2px;

    &--active {
      color: var(--color-white);
      background-color: var(--color-primary);
      border-radius: 50px;

      &:hover {
        background-color: var(--color-primary) !important;
      }
    }

    &:hover {
      color: var(--color-white);
      background-color: var(--color-primary-lighten-2);
      border-radius: 50px;
    }
  }

  &__wrapper {
    &--loading {
      opacity: 0.8;
      cursor: wait;
    }
  }

  &__card {
    margin-bottom: 24px;

    @media (--viewport-lg-min) {
      &:nth-child(odd) {
        padding-right: calc(var(--grid-gutter) / 4);
      }

      &:nth-child(even) {
        padding-left: calc(var(--grid-gutter) / 4);
      }
    }

    &-item {
      height: 100%;

      :deep(figure),
      :deep(picture),
      :deep(img) {
        height: 100%;
      }
    }
  }
}
</style>
