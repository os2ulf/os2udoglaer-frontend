<script setup lang="ts">
import { useHeaderDataStore } from '~/stores/headerData';
const headerDataStore = useHeaderDataStore();

if (headerDataStore.headerData === null) {
  headerDataStore.getHeaderData();
}

const mainMenuData = computed(() => {
  const mainKey = Object.keys(headerDataStore?.headerData || {}).find(key => key.includes('main'));
  return mainKey ? headerDataStore?.headerData?.[mainKey] : null;
});
</script>

<template>
  <div class="header-parent">
    <a
      href="#main-content"
      class="skip-link"
    >
      Hop til primært indhold
    </a>
    <TheHeader v-if="mainMenuData" :data="mainMenuData" />
  </div>
</template>

<style lang="postcss" scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  z-index: 100;
  transition: top 0.3s;
  outline: none;
}

.skip-link:focus {
  top: 0;
}

.skip-link:focus-visible {
  outline: 2px solid #fff;
}

.header-parent {
  height: var(--navigation-bar-height);
  background-color: var(--color-white);
}
</style>
