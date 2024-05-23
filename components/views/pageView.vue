<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
  pageHeader: {
    type: Object,
    required: false,
    default: null,
  },
});

useHead({
  title: props?.data?.field_meta_tags?.html_head?.title?.atributes?.content,
});
</script>

<template>
  <div>
    <PageHeader v-if="pageHeader" :page-block-header-data="pageHeader" />

    <Sections
      v-if="data && data.layout_builder__layout"
      :sections="data.layout_builder__layout"
    />
  </div>
</template>
