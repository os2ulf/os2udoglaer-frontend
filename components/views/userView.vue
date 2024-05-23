<script setup lang="ts">
import KontaktProvider from '../view-components/KontaktProvider.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

console.log('data', props.data);

useHead({
  title:
    props.data?.field_meta_tags?.html_head?.title?.atributes?.content ||
    props.data?.field_name,
});

const practicalInfoData = computed(() => {
  return [
    {
      type: 'divider',
    },
    {
      title: 'Udbyder',
      content: 'Object needed from BE',
    },
    {
      type: 'divider',
    },

    {
      title: 'Forløbstype',
      content: props.data?.field_course_type,
    },
  ];
});
</script>

<template>
  <div class="user">
    <div class="user__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="user__page-heading-wrapper">
              <h1 class="user__page-title">{{ data?.field_name }}</h1>
              <div class="user__page-heading-button-container">
                <!-- TODO: connect buttons -->
                <BaseButton
                  icon-after="arrow-right"
                  :button-data="{ title: 'Find forløb' }"
                  class="button button--secondary"
                />
                <button class="button button--secondary--ghost">
                  Kontakt udbyder
                </button>
              </div>
            </div>

            <div class="user__banner-image">
              <!-- TODO: Once BE has proper image styling, change this into img component -->
              <img
                :src="data.field_image.src"
                :alt="data.field_image.alt"
                :title="data.field_image.title"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container user__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <BaseRte :content="data.body" />
          </div>
          <!-- <div class="user__paragraph-item" v-if="data.field_purpose">
            <BaseRte :content="data.field_purpose" />
          </div> -->
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation :data="practicalInfoData" />
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-12"
          v-if="
            data.field_video_title ||
            data.field_video_description ||
            data.field_video_thumbnail ||
            data.field_video
          "
        >
          Video component goes here
          <!-- Broken now  -->
          <!-- <VideoComponent
            class="user__section-video"
            v-if="
              data.field_video_title ||
              data.field_video_description ||
              data.field_video_thumbnail ||
              data.field_video
            "
            :data="{
              field_video_title: data.field_video_title,
              field_video_description: data.field_video_description,
              field_video_thumbnail: data.field_video_thumbnail,
              field_video: data.field_video,
            }"
          /> -->
        </div>

        <!-- Section related articles -->
        <div
          class="col-xs-12 col-sm-12 col-md-12 user__section-related-articles"
        >
          <div class="user__related-articles">
            <h3>Relaterede forløb</h3>
            <div>article cards</div>
          </div>
        </div>

        <!-- Section kontakt -->
        <div class="col-xs-12 col-sm-12 col-md-12 user__section-contact">
          <div class="user__contact">
            <KontaktProvider :data="data" />
          </div>
        </div>

        <!-- Section information -->
        <div class="col-xs-12 col-sm-12 col-md-5 user__section-calendar">
          <div class="user__calendar">
            <h2>Kontakt Yderligere information om udbyder</h2>
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-5 col-md-offset-1 user__section-calendar"
        >
          <div class="user__calendar">
            <h3>tetx and buttons</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.user {
  background-color: var(--color-tertiary-lighten-6);
  color: var(--color-tertiary);

  &__top-section {
    padding: 32px 0 @(--sm) 64px 0;
    background-color: var(--color-primary-lighten-5);
  }

  &__tags-wrapper {
    padding-top: 24px;

    display: flex;
    margin-bottom: 32px;
  }

  &__tags-item {
    margin-right: 16px;
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
    display: flex;

    .button {
      margin-right: 12px @(--md) 0;
      margin-left: 0 @(--md) 12px;
    }
  }

  &__paragraph-item {
    padding-top: 32px;
    margin-bottom: 32px;
  }

  &__practical-buttons {
    margin-top: 24px;
    padding: 0 15px;
    display: grid;
    gap: 16px;
  }

  &__contact-button {
    color: var(--color-tertiary);
    border-color: var(--color-tertiary);

    &:hover {
      color: var(--color-white);
      background-color: var(--color-tertiary);
    }
  }

  &__second-section {
    padding-top: 48px @(--md) 96px;
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
