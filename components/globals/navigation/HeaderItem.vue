<script setup>
import { getMenuItemUrl, hasMenuChildren } from '~/utils/navigation';

const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const hasChildren = computed(() => hasMenuChildren(props.node));
</script>

<template>
  <li class="header-item">
    <NuxtLink
      v-if="getMenuItemUrl(node) && !hasChildren"
      :to="getMenuItemUrl(node)"
      :target="node?.url_options?.attributes?.target"
      class="header-item__link"
      :aria-label="'Gå til ' + node?.title"
    >
      <div class="header-item__item">
        <div class="header-item__icon" v-if="node.field_icon">
          <img :src="node?.field_icon" alt="" />
        </div>
        <div>
          {{ node?.title }}

          <p v-if="node?.field_description" class="header-item__description">
            {{ node?.field_description }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>

<style lang="postcss" scoped>
.header-item {
  list-style-type: none;

  &__item {
    display: flex;
    padding: 24px 12px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s;
    height: 100%;

    &:hover {
      border: 2px solid var(--color-primary-lighten-4);

      .header-item__link {
        color: var(--color-primary);
      }
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }

  &__link {
    display: block;
    height: 100%;
    color: var(--color-text);
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    text-decoration: none;

    &:focus-visible {
      outline: -webkit-focus-ring-color auto 1px;
      outline-offset: 2px;
    }
  }

  &__description {
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    font-weight: 400;
  }

  img {
    min-width: 32px;
    height: 32px;
    object-fit: cover;
  }
}
</style>
