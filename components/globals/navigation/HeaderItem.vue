<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const hasChildren = computed(() => {
  const { below } = props.node;

  if (below.length === 0) {
    return false;
  } else if (below.length > 0) {
    return true;
  }
});
</script>

<template>
  <li class="header-item">
    <div class="header-item__item">
      <div class="header-item__icon">Icon</div>
      <NuxtLink
        v-if="node?.url && !hasChildren"
        :to="node?.url"
        :target="node?.url_options?.attributes?.target"
        class="header-item__link"
        :aria-label="'Gå til' + node?.title"
      >
        {{ node?.title }}
        <p class="header-item__description">
          Få overblik over alle forløb til grundskole og søg efter relevante
          forløb for dig
        </p>
      </NuxtLink>
    </div>
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
    color: var(--color-secondary-text);
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    text-decoration: none;
  }

  &__description {
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    font-weight: 400;
  }
}
</style>
