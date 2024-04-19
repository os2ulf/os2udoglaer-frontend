<template>
  <div class="loading">
    <div class="loading__inner">Loading</div>
  </div>
</template>

<style lang="postcss" scoped>
.loading {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 40px 0;

  &__inner {
    width: 100px @(--sm) 150px;
    height: 100px @(--sm) 150px;
  }
}
</style>
