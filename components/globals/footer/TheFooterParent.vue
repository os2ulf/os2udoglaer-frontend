<script setup lang="ts">
import { useFooterDataStore } from '~/stores/footerData';
const footerDataStore = useFooterDataStore();

import { useApiRouteStore } from '~/stores/apiRouteEndpoint';
const apiRouteStore = useApiRouteStore();

const computedApiRoute = computed(() => {
  return apiRouteStore.apiRouteEndpoint;
});

// console.log('Footer: api Route Endpoint', apiRouteStore.apiRouteEndpoint);

if (footerDataStore.footerData === null) {
  footerDataStore.getFooterData();
}
</script>

<template>
  here: {{ computedApiRoute }}
  <div class="footer-parent" v-if="footerDataStore.footerData">
    <TheFooter :data="footerDataStore.footerData" />
  </div>
</template>
