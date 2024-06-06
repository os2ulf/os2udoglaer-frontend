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
          :to="item.url"
          class="meta-offcanvas__item-link"
        >
          {{ item.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup></script>

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
    border-bottom: 1px solid var(--color-tertiary-lighten-6);
    transition: all 0.2s;

    a {
      text-decoration: none;
      color: var(--color-tertiary);
    }

    &:hover {
      background-color: var(--color-tertiary-lighten-5);
    }
  }

  &__item-link {
    padding: 16px 24px;
    color: var(--color-tertiary);
    width: 100%;
    display: block;

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
