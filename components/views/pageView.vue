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
</script>

<template>
  <div>
    <PageHeader v-if="pageHeader" :page-block-header-data="pageHeader" />

    <div class="page-title-wrapper" v-else>
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <h1 class="page-title">{{ data?.label }}</h1>
          </div>
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
.page-title-wrapper {
  background-color: var(--theme-background-color);
}

.page-title {
  padding-top: 48px @(--md) 96px;
  margin-bottom: 32px @(--md) 64px;
  word-break: break-word;
}
</style>
