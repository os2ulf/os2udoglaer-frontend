<script setup>
const props = defineProps({
  nestedItems: {
    type: Array,
    required: false,
  },
});
</script>

<template>
  <div class="meta-offcanvas">
    <div class="meta-offcanvas__item-wrapper">
      <div
        class="meta-offcanvas__item"
        v-for="item in props.nestedItems"
        :key="item"
      >
        <NuxtLink
          :aria-label="'Link til ' + item.title"
          :to="item.link.url"
          class="meta-offcanvas__item-link"
        >
          {{ item.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.meta-offcanvas {
  position: absolute;
  z-index: 1000;
  top: 100%;
  right: 0;
  width: 100% @(--sm) 340px;
  box-shadow: 0 4px 30px 0 #0000001a;

  &__item-wrapper {
    text-align: left;
    background-color: var(--color-white);
  }

  &__item {
    border-bottom: 1px solid var(--color-gray-8);
    transition: all 0.2s;

    a {
      text-decoration: none;
      color: var(--color-text);
    }

    &:hover {
      background-color: var(--color-gray-8);
    }
  }

  &__item-link {
    padding: 16px 24px;
    color: var(--color-text);
    width: 100%;
    display: block;

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
