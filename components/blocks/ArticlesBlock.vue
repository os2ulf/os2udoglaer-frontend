<script setup>
const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="articles">
    <BaseArticle
      v-for="article in blockData.articles"
      :key="article.id"
      :article="article"
    />
  </div>
</template>

<style lang="postcss" scoped>
.articles {
  display: block;

  @media (--viewport-ms-min) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (--viewport-sm-min) {
    grid-template-columns: 1fr 1fr;
    gap: 44px;
  }

  @media (--viewport-md-min) {
    grid-template-columns: 1fr 1fr 1fr;

    .column-widths--50-50 & {
      grid-template-columns: 1fr 1fr;
    }

    .column-widths--33-33-33 & {
      display: block;
    }
  }

  :deep(.article) {
    @media (--viewport-ms-min) {
      margin-bottom: 0;
    }
  }
}
</style>
