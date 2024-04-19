<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    required: true,
    default: null,
  },
});
</script>
<template>
  <div class="article-recommendations">
    <div
      v-if="blockData.field_headline || blockData?.field_call_to_action"
      class="article-recommendations__heading"
    >
      <h2 class="article-recommendations__headline">
        {{ blockData?.field_headline }}
      </h2>
      <BaseButton
        v-if="blockData?.field_call_to_action"
        :button-data="blockData?.field_call_to_action"
        class="button button--ghost article-recommendations__cta"
        aria-label="CTA"
      />
    </div>

    <div class="article-recommendations__wrapper">
      <ClientOnly>
        <BaseArticle
          v-for="article in blockData.field_article_recommendations.entities"
          :key="article.id"
          :article="article"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.article-recommendations {
  &__heading {
    display: grid @(--sm) flex;
    align-items: center;
    justify-content: center @(--sm) space-between;
    margin-bottom: 20px;

    @media (--viewport-sm-max) {
      text-align: center;
    }
  }

  &__headline {
    @media (--viewport-sm-max) {
      margin-bottom: 20px;
    }
  }

  .article-recommendations__wrapper {
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
    }
  }

  :deep(.article) {
    @media (--viewport-ms-min) {
      margin-bottom: 0;
    }

    &__title {
      font-size: 16px @(--sm) 20px;
      text-align: start;
    }
  }
}
</style>
