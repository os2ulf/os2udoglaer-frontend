<template>
  <div class="label">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.label {
  border-radius: 4px;
  padding: 7px 16px;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  /* letter-spacing: 2px;  doesnt fit in a single line if 3 present */
  text-transform: uppercase;
  width: fit-content;

  &--green {
    color: var(--color-primary-darken-3);
    background-color: var(--color-primary-lighten-4);
    border: 2px solid var(--color-primary-lighten-4);
  }

  &--yellow {
    color: var(--color-secondary-text);
    background-color: var(--color-secondary);
    border: 2px solid var(--color-secondary);
  }

  &--light-yellow {
    color: var(--color-tertiary);
    background-color: var(--color-secondary-lighten-4);
    border: 2px solid var(--color-secondary-lighten-4);
  }
}
</style>
