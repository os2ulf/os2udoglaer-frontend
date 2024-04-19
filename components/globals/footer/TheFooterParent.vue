<script setup lang="ts">
import { useFooterDataStore } from '~/stores/footerData';
const footerDataStore = useFooterDataStore();

if (footerDataStore.footerData === null) {
  footerDataStore.getFooterData();
}
</script>

<template>
  <div class="footer-parent">
    <TheFooter :data="footerDataStore.footerData" />
  </div>
</template>
