<script setup lang="ts">
import { useFooterDataStore } from '~/stores/footerData';
const footerDataStore = useFooterDataStore();

if (footerDataStore.footerData === null) {
  footerDataStore.getFooterData();
}
</script>

<template>
  <footer class="footer-parent" v-if="footerDataStore.footerData">
    <TheFooter :data="footerDataStore.footerData" />
  </footer>
</template>
