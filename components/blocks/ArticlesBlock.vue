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

  @media (min-width: 481px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 44px;
  }

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr 1fr;

    .column-widths--50-50 & {
      grid-template-columns: 1fr 1fr;
    }

    .column-widths--33-33-33 & {
      display: block;
    }
  }

  :deep(.article) {
    @media (min-width: 481px) {
      margin-bottom: 0;
    }
  }
}
</style>
