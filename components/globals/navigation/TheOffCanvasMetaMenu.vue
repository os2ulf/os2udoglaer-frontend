<script setup>
import { getMenuItemUrl } from '~/utils/navigation';

const props = defineProps({
  nestedItems: {
    type: Array,
    required: false,
  },
});
</script>

<template>
  <div class="meta-offcanvas" role="group">
    <ul class="meta-offcanvas__item-wrapper">
      <li
        class="meta-offcanvas__item"
        v-for="(item, index) in props.nestedItems"
        :key="item.id ?? index"
      >
        <NuxtLink
          v-if="getMenuItemUrl(item)"
          :aria-label="'Link til ' + item.title"
          :to="getMenuItemUrl(item)"
          class="meta-offcanvas__item-link"
        >
          {{ item.title }}
        </NuxtLink>
        <span v-else class="meta-offcanvas__item-link">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.meta-offcanvas {
  position: absolute;
  z-index: 1000;
  top: 100%;
  right: 0;
  width: 100%;
  box-shadow: 0 4px 30px 0 #0000001a;
  animation: slide-top 0.3s;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (min-width: 768px) {
    width: 340px;
  }

  &__item-wrapper {
    margin: 0;
    padding: 0;
    list-style: none;
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

    &:focus-visible {
      outline: -webkit-focus-ring-color auto 1px;
      outline-offset: -2px;
    }
  }
}
</style>
