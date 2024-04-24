<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div ref="header" class="header__wrapper">
    <div class="header">
      <div class="header__content">
        <NuxtLink to="/" aria-label="Gå til forsiden">
          <BaseLogo class="header__logo" />
        </NuxtLink>

        <nav class="header__right" v-if="data">
          <NuxtLink
            v-for="(item, index) in data.items"
            :key="index"
            :to="item.url"
            class="header__button header__button--left"
            aria-label="Gå til forsiden"
          >
            {{ item.title }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.mobile-search-dropdown-menu,
.login-modal--wrapper--mobile {
  @media (--viewport-sm-max) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 100%;
    height: 100%;

    :deep(.login) {
      height: 100%;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-11);
  transform: translateY(0%);
  transition:
    height 0.4s,
    transform 0.4s;
  will-change: height;

  &__wrapper {
    position: sticky;
    top: -1px;
    z-index: 100;
    width: 100%;
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__right {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;

    @media (--viewport-sm-min) {
      flex: 1;
    }
  }

  &__left {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    @media (--viewport-sm-min) {
      flex: 1;
    }
  }

  &__button {
    padding: 15px;
    color: var(--color-text);
    font-size: 16px;
    white-space: nowrap;
    text-decoration: none;
    background: none;
    border: none;

    @media (max-width: 360px) {
      padding: 15px 8px;
    }

    span {
      font-size: 20px;
    }

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
