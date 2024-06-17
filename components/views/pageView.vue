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

    <div class="container" v-else>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <h1 class="page-title">{{ data?.label }}</h1>
        </div>
      </div>
    </div>

    <Sections
      v-if="data && data.layout_builder__layout"
      :sections="data.layout_builder__layout"
    />
  </div>
</template>

<style lang="postcss" scoped>
.page-title {
  padding-top: 48px @(--md) 96px;
  margin-bottom: 32px @(--md) 64px;
}
</style>
