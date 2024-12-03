<script setup lang="ts">
const props = defineProps({
  logo: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="base-logo">
    <img :src="logo" alt="logo" />
  </div>
</template>

<style lang="postcss" scoped>
.base-logo {
  img {
    max-height: 70px;
    height: max-content;
    object-fit: contain;
  }
}
</style>
