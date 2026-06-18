<script setup lang="ts">
const { footerData } = useFooterData();
</script>

<template>
  <div class="footer-parent" v-if="footerData">
    <TheFooter :data="footerData" />
  </div>
</template>