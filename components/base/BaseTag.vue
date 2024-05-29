<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
});
</script>

<template>
  <div class="base-tag">
    <span
      class="base-tag__text"
      :class="props.color ? `base-tag--${props.color}` : ''"
      >{{ data.label }}</span
    >
  </div>
</template>

<style lang="postcss" scoped>
.base-tag {
  &__text {
    padding: 7px 16px;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 500;
    font-family: var(--heading-font-family);
    letter-spacing: 2px;
    font-size: 14px;
  }
  &--primary {
    background-color: var(--color-primary);
    color: var(--color-primary-text);
  }

  &--secondary {
    background-color: var(--color-secondary);
    color: var(--color-secondary-text);
  }
}
</style>
