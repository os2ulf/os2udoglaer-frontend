<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

useHead({
  title: props.data.label || '',
});
// test deployment
</script>

<template>
  <div class="tags-view">
    <Sections
      v-if="data && data.layout_builder__layout"
      :sections="data.layout_builder__layout"
    />
  </div>
</template>
