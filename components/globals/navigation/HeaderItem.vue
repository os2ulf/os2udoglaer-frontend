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

const config = useRuntimeConfig().public;
</script>

<template>
  <li class="header-item">
    <NuxtLink
      v-if="node?.link?.url && !hasChildren"
      :to="node?.link?.url"
      :target="node?.url_options?.attributes?.target"
      class="header-item__link"
      :aria-label="'Gå til' + node?.title"
    >
      <div class="header-item__item">
        <div class="header-item__icon" v-if="node.field_icon">
          <!-- TODO: The baseAPI part might need to change once BE delivers absolute paths -->
          <img :src="config.API_BASE_URL + node?.field_icon" />
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

  img {
    min-width: 32px;
    height: 32px;
    object-fit: cover;
  }
}
</style>
