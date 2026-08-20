<script setup>
const props = defineProps({
  blockData: Object,
});

const accordionId = `accordion-${useId()}`;
const openItemIds = ref([]);

const getExpandedItemIds = (items = []) =>
  items
    .filter((item) => item?.field_accordion_expanded === true)
    .map((item) => item.id);

watch(
  () => props.blockData?.field_accordion_items,
  (items) => {
    openItemIds.value = getExpandedItemIds(items);
  },
  { immediate: true },
);

const isItemActive = (id) => openItemIds.value.includes(id);

const toggle = (id) => {
  if (isItemActive(id)) {
    openItemIds.value = openItemIds.value.filter((itemId) => itemId !== id);
  } else {
    openItemIds.value = [...openItemIds.value, id];
  }
};

const showingAll = ref(false);
const showAll = () => {
  showingAll.value = true;
};
const computedItems = computed(() => {
  if (showingAll.value) {
    return props.blockData.field_accordion_items;
  }
  return props.blockData.field_accordion_items.slice(0, 5);
});

const getTriggerId = (index) => `${accordionId}-trigger-${index}`;
const getContentId = (index) => `${accordionId}-content-${index}`;
const getToggleLabel = (item) => {
  const action = isItemActive(item.id) ? 'Luk' : 'Åbn';
  return `${action} ${item.field_accordion_item_headline}`;
};
</script>

<template>
  <div class="accordion">
    <h2 class="accordion__title">{{ blockData.field_accordion_headline }}</h2>
    <div
      v-for="(item, index) in computedItems"
      :key="item.id"
      class="accordion__item"
    >
      <h3 class="accordion__heading">
        <button
          :id="getTriggerId(index)"
          class="accordion__trigger"
          :class="{ 'accordion__trigger--active': isItemActive(item.id) }"
          type="button"
          :aria-expanded="isItemActive(item.id)"
          :aria-controls="getContentId(index)"
          :aria-label="getToggleLabel(item)"
          @click="toggle(item.id)"
        >
          {{ item.field_accordion_item_headline }}

          <NuxtIcon name="chevron-down" filled aria-hidden="true" />
        </button>
      </h3>

      <div
        :id="getContentId(index)"
        :class="{ 'accordion__content--active': isItemActive(item.id) }"
        class="accordion__content"
        role="region"
        :aria-labelledby="getTriggerId(index)"
        :aria-hidden="!isItemActive(item.id)"
        :inert="!isItemActive(item.id)"
      >
        <div
          v-if="item.field_accordion_item_text !== null"
          class="accordion__inner"
          v-html="item.field_accordion_item_text"
        ></div>
      </div>
    </div>

    <div
      v-if="blockData.field_accordion_items.length > 5 && !showingAll"
      class="accordion__footer"
    >
      <BaseButton
        type="button"
        :aria-label="blockData.field_accordion_show_more || 'Vis flere punkter'"
        :button-data="{
          title: blockData.field_accordion_show_more || 'Vis mere',
        }"
        @click="showAll"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.accordion {
  &__title {
    margin-bottom: 14px;
    word-break: break-word;
    color: var(--theme-color);

    @media (min-width: 768px) {
      margin-bottom: 28px;
    }
  }

  &__item {
    overflow: hidden;
    background: var(--color-white);
    margin-bottom: 2px;

    .theme-none & {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
  }

  &__heading {
    margin: 0;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 15px 18px;
    color: var(--color-text);
    font-weight: bold;
    font-size: var(--font-size-h3);
    font-family: var(--heading-font-family);
    text-align: left;
    background: none;
    border: none;
    transition: opacity 0.2s;

    @media (min-width: 768px) {
      padding: 25px 28px;
    }

    &:hover {
      opacity: 0.5;
    }

    :deep(svg) {
      transform: rotateX(0);
      transition: transform 0.3s;
    }

    &--active {
      :deep(svg) {
        transform: rotateX(180deg);
      }
    }
  }

  &__content {
    height: 0;
    overflow: hidden;
    transform: translateY(30px);
    transition: transform 0.3s;

    :deep(p) {
      font-size: var(--font-size-paragraph-sm);
    }

    &--active {
      height: auto;
      transform: translateY(0);
    }
  }

  &__inner {
    padding: 0 18px 18px;

    @media (min-width: 768px) {
      padding: 0 28px 28px;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 14px;

    @media (min-width: 768px) {
      padding-top: 28px;
    }
  }
}
</style>
