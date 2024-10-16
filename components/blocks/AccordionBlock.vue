<template>
  <div class="accordion">
    <h2 class="accordion__title">{{ blockData.field_accordion_headline }}</h2>
    <div v-for="item in computedItems" :key="item.id" class="accordion__item">
      <button
        class="accordion__trigger"
        :class="{ 'accordion__trigger--active': item.id === active }"
        type="button"
        @click="toggle(item.id)"
      >
        {{ item.field_accordion_item_headline }}

        <NuxtIcon name="chevron-down" fill />
      </button>

      <div
        :class="{ 'accordion__content--active': item.id === active }"
        class="accordion__content"
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
        :button-data="{
          title: blockData.field_accordion_show_more || 'Vis mere',
        }"
        @click="showAll"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});

const active = ref(-1);

const toggle = (id) => {
  if (active.value === id) {
    active.value = -1;
  } else {
    active.value = id;
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
</script>

<style lang="postcss" scoped>
.accordion {
  &__title {
    margin-bottom: 14px;
    word-break: break-word;

    @media (--viewport-sm-min) {
      margin-bottom: 28px;
    }
  }

  &__item {
    overflow: hidden;
    background: var(--color-white);
    border-top: 1px solid var(--site-background-color);
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

    @media (--viewport-sm-min) {
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
    transform: translateY(100px);
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

    @media (--viewport-sm-min) {
      padding: 0 28px 28px;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 14px;

    @media (--viewport-sm-min) {
      padding-top: 28px;
    }
  }
}
</style>
