<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

useHead({
  title: props.data?.field_meta_tags?.html_head?.title?.atributes?.content,
});

console.log('data content-type', props.data);
</script>

<template>
  <div class="course">
    <div class="course__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="course__breadcrumbs-wrapper">
              La place for breadcrumbs
            </div>
            <div class="course__tags-wrapper">
              <div class="course__tags-item" v-if="data?.field_target_group">
                {{ data?.field_target_group }}
              </div>
              <div class="course__tags-item">tag</div>
            </div>
            <div class="course__page-heading-wrapper">
              <h1 class="course__page-title">{{ data?.label }}</h1>
              <div class="course__page-heading-button-container">
                <BaseButton
                  icon-after="arrow-right"
                  :button-data="{ title: 'Button' }"
                />
                <button class="button button--ghost">button</button>
              </div>
            </div>

            <div class="course__banner-image">
              <span>IMAGINE A BIG-ASS IMAGE BANNER HERE</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container course__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <BaseRte :content="data.body" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-md-offset-2">
          <SharePage />
          <PracticalInformation />
          <div class="course__practical-buttons">
            <BaseButton
              :button-data="{ title: 'Tilmeld dig forløbet' }"
              icon-after="arrow-right"
            />
            <button class="button button--ghost course__contact-button">
              Kontakt udbyder
            </button>
            <BaseButton
              :button-data="{ title: 'Information om transport' }"
              icon-after="ext-link"
              ghost
            />
          </div>
        </div>

        <!-- video part -->
        <div class="col-xs-12 col-sm-12 col-md-6 course__section-video">
          <div class="course__video-text-wrapper">
            <h3 class="course__video-text">video part title</h3>
            <p>video part description</p>
          </div>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6 course__section-video">
          <div class="course__video-player">
            <p>image and a link + icon goes here</p>
          </div>
        </div>

        <!-- Section cards -->
        <div class="col-xs-12 col-sm-12 col-md-12 course__section-cards">
          <div class="course__cards">
            <h3>Undervisnings- og inspirationsmateriale</h3>
            <div>card component/place</div>
          </div>
        </div>

        <!-- Section calendar -->
        <div class="col-xs-12 col-sm-12 col-md-12 course__section-calendar">
          <div class="course__calendar">
            <h3>Tilmelding</h3>
            <p>calendar integration goes here</p>
          </div>
        </div>

        <!-- Section related articles -->
        <div
          class="col-xs-12 col-sm-12 col-md-12 course__section-related-articles"
        >
          <div class="course__related-articles">
            <h3>Relaterede forløb</h3>
            <div>article cards</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.course {
  /* TODO: bg var */
  background-color: #f5f5f5;

  &__top-section {
    /* TODO: set var */
    background-color: #eaf2f2;
    padding-bottom: 64px;
  }

  &__breadcrumbs-wrapper {
    padding-top: 24px;
    margin-bottom: 64px;
  }

  &__tags-wrapper {
    display: flex;
    margin-bottom: 32px;
  }

  &__tags-item {
    margin-right: 12px;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
    padding: 7px 16px;
    border-radius: 4px;

    /* TODO: bg color (1-2-3 tags) and text color (differs) */
    background-color: orange;
  }

  &__page-heading-wrapper {
    display: grid @(--md) flex;
    justify-content: space-between;
    margin-bottom: 48px;
    align-items: center;
  }

  &__page-title {
    font-weight: 700;
  }

  &__page-heading-button-container {
    margin-top: 10px @(--md) 0;

    .button {
      margin-right: 12px @(--md) 0;
      margin-left: 0 @(--md) 12px;
    }
  }

  &__practical-buttons {
    margin-top: 24px;
    display: grid;
    gap: 16px;
  }

  &__contact-button {
    /* TODO: use vars */
    color: #40362e;
    border-color: #40362e;

    &:hover {
      /* TODO: use vars */
      color: #fff;
      background-color: #40362e;
    }
  }

  &__second-section {
    padding-top: 48px @(--md) 96px;
  }

  &__video-text {
    line-height: 38px;
  }

  &__section-video,
  &__section-cards,
  &__section-calendar,
  &__section-related-articles {
    padding-top: 48px @(--md) 96px;
  }

  &__section-related-articles {
    padding-bottom: 48px @(--md) 96px;
  }
}
</style>
