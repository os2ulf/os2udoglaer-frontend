<script setup lang="ts">
import { useHeaderDataStore } from '~/stores/headerData';
const headerDataStore = useHeaderDataStore();

if (headerDataStore.headerData === null) {
  headerDataStore.getHeaderData();
}
</script>

<template>
  <div class="header-parent">
    <TheHeader :data="headerDataStore.headerData" />
  </div>
</template>

<style lang="postcss" scoped>
.header-parent {
  height: var(--navigation-bar-height);
}
</style>
