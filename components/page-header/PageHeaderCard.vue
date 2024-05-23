<script setup lang="ts">
const props = defineProps({
  cardItem: {
    type: Object,
    required: false,
  },
});

const cardItem = ref(props.cardItem);
</script>

<template>
  <div class="page-header-card">
    <div class="page-header-card__item">
      <h4 class="page-header-card__title">{{ cardItem?.field_title }}</h4>
      <div class="page-header-card__description">
        {{ cardItem?.field_description }}
      </div>
      <div class="page-header-card__link" v-if="cardItem?.field_link.url">
        <NuxtLink :to="cardItem?.field_link.url">
          <NuxtIcon
            class="page-header-card__link--icon"
            name="arrow-right"
            filled
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page-header-card {
  color: var(--color-tertiary);
  border: 2px solid var(--color-primary-lighten-4);
  border-radius: 5px;
  height: 100%;

  &__item {
    background-color: var(--color-white);
    padding: 32px;
    height: 100%;
  }

  &__title {
    line-height: 28px;
  }

  &__description {
    font-weight: 400;
    line-height: 24px;
  }

  &__link {
    padding-top: 22px;

    &--icon {
      :deep(svg) {
        background-color: var(--color-secondary);
        border-radius: 50%;
        padding: 8px;
        height: 40px;
        width: 40px;

        path {
          stroke: var(--color-secondary-text);
        }
      }
    }
  }
}
</style>
