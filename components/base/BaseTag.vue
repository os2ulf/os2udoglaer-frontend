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
    letter-spacing: 2px;
    font-size: 14px;
  }
  &--primary {
    /* TODO: vars */
    background-color: #297f78;
    color: var(--color-white);
  }

  &--secondary {
    /* TODO: vars */
    background-color: #fbd800;
    color: #232323;
  }
}
</style>
