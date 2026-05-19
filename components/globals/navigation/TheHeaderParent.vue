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
  <header class="header-parent">
    <TheHeader v-if="mainMenuData" :data="mainMenuData" />
  </header>
</template>

<style lang="postcss" scoped>
.header-parent {
  height: var(--navigation-bar-height);
  background-color: var(--color-white);
}
</style>
