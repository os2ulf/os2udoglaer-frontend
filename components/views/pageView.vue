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

const robots = ref(
  props.data?.field_meta_tags?.html_head?.robots?.attributes?.content,
);

const seoPageContent = ref(
  props.data?.field_meta_tags?.html_head?.description?.attributes?.content,
);

useHead({
  title: props?.data?.field_meta_tags?.html_head?.title?.attributes?.content,
  meta: [
    {
      name: 'description',
      content: seoPageContent.value,
    },
    {
      name: 'robots',
      content: robots.value,
    },
  ],
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
