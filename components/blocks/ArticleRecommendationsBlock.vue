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
    display: grid;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    @media (min-width: 768px) {
      display: flex;
      justify-content: space-between;
    }

    @media (max-width: 991px) {
      text-align: center;
    }
  }

  &__headline {
    @media (max-width: 991px) {
      margin-bottom: 20px;
    }
  }

  .article-recommendations__wrapper {
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
    }
  }

  :deep(.article) {
    @media (min-width: 481px) {
      margin-bottom: 0;
    }

    &__title {
      font-size: 16px;
      text-align: start;
      word-break: break-word;

      @media (min-width: 768px) {
        font-size: 20px;
      }
    }
  }
}
</style>
