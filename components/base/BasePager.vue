<script setup>
const props = defineProps({
  pager: {
    type: Object,
    required: true,
  },
});

// prev can only be clicked if current is not 0 (first page)
const canPrev = computed(() => props.pager.current !== 0);
// next can only be clicked if current is not the last page
const canNext = computed(() => props.pager.current !== props.pager.pages - 1);

// limit the number of pages shown in the pager
const limitedPages = computed(() => {
  const totalPages = Math.ceil(props.pager.items / props.pager.limit);
  const current = props.pager.current + 1;
  const minPages = 4;
  const maxPages = 5;

  // return all pages if there are less than or eq minPages
  if (totalPages <= minPages) {
    // return all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const startPage = Math.max(1, current - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => i + startPage,
    );
  }
});
</script>

<template>
  <div v-if="pager.pages > 1" class="pager">
    <button
      v-if="canPrev"
      type="button"
      class="pager__page pager__page--prev"
      aria-label="Previous page"
      @click="$emit('change', pager.current - 1)"
    >
      <NuxtIcon class="pager__page--prev-icon" name="chevron-down" filled />
    </button>

    <button
      v-for="page in limitedPages"
      :key="page"
      type="button"
      class="pager__page"
      :class="{ 'pager__page--active': page - 1 == pager.current }"
      aria-label="Page {{ page }}"
      @click="$emit('change', page - 1)"
    >
      {{ page }}
    </button>

    <button
      v-if="canNext"
      type="button"
      class="pager__page pager__page--next"
      aria-label="Next page"
      @click="$emit('change', pager.current + 1)"
    >
      <NuxtIcon class="pager__page--next-icon" name="chevron-down" filled />
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: center;

  &__page {
    width: 48px;
    height: 48px;
    margin: 0 4px;
    font-weight: 700;
    font-size: 16px;
    background-color: transparent;
    border: none;
    border-radius: 30px;
    transition: all 0.3s ease-in-out;
    border: 2px solid var(--color-primary-lighten-3);
    color: var(--color-primary);

    &--active {
      width: 48px;
      height: 48px;
      color: var(--color-white);
      background: var(--color-primary);
      border: none;
      cursor: default;
      pointer-events: none;
    }

    &--prev,
    &--next {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0;
      color: var(--color-primary);
      background: transparent;
      border: 2px solid var(--color-primary);
      cursor: pointer;
      pointer-events: auto;
      font-size: 24px;

      :deep(path) {
        stroke: var(--color-primary);
      }
    }

    &--prev {
      margin-right: 6px @(--sm) 22px;
      margin-left: 0;
    }

    &--next {
      margin-left: 6px @(--sm) 22px;
      margin-right: 0;
    }

    &--prev-icon {
      transform: rotate(90deg);
    }

    &--next-icon {
      transform: rotate(270deg);
    }

    &:hover {
      opacity: 0.7;
      box-shadow: 0px 2px 10px 7px rgba(var(--color-primary-rgb), 0.1);
    }
  }
}
</style>
