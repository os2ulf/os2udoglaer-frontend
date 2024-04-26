<script setup lang="ts"></script>

<template>
  <div class="practical-information">
    <h3 class="practical-information__title">Praktisk information</h3>
    <BaseDivider class="practical-information__divider" />

    <div class="practical-information__provider-container">
      <span>Udbyder</span>

      <NuxtLink class="practical-information__provider-value" to="/"
        >Value is needed</NuxtLink
      >
    </div>

    <BaseDivider class="practical-information__divider" />

    <div>hi</div>
  </div>
</template>

<style lang="postcss" scoped>
.practical-information {
  padding: 48px 32px;
  background-color: var(--color-white);
  /* TODO: use a var for this color accent? */
  box-shadow: 0px 4px 10px 15px #297f781a;

  &__title {
    margin: 0;
  }

  &__divider {
    margin: 22px 0;
    /* TODO: use var */
    color: #d1cfcd;
  }

  &__provider-container {
    font-weight: 700;
    display: flex;
    justify-content: space-between;
  }

  &__provider-value {
    /* TODO: use var */
    color: #297f78;
    border-bottom: 1px solid transparent;
    font-weight: 400;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
    line-height: 24px;

    &:hover {
      opacity: 0.8;
      /* TODO: use var */
      border-bottom: 1px solid #297f78;
    }
  }
}
</style>
