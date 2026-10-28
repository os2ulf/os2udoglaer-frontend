<script setup>
defineProps({
  footerMenuData: {
    type: Object,
    required: true,
  },
});
</script>

<template v-if="footerMenuData.items">
  <FooterItem
    v-for="(footerItem, index) in footerMenuData.items"
    :key="index"
    :node="footerItem"
  />
</template>
