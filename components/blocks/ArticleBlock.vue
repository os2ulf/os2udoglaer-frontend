<script setup>
const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <BaseArticle :article="blockData.field_article" />
</template>

<style lang="postcss" scoped>
.layout-block--article {
  @media (--viewport-sm-max) {
    .col-md-4 & {
      .article {
        flex-direction: row;
        margin: 0;
        padding: 20px 0;
        border-top: 1px solid #9797973d;

        :deep(.article__image) {
          display: flex;
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }

        :deep(img) {
          width: 100px;
          height: 100px;
          object-fit: cover;
        }

        :deep(.article__header) {
          margin-bottom: 10px;
        }

        :deep(.article__content) {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 0 16px;

          & .label--light {
            display: none;
          }
        }
      }
    }
  }
}
</style>
