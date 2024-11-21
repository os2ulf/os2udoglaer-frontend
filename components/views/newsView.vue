<script setup lang="ts">
import { filterGroups } from '~/utils/dataFilter';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const practicalInfoData = computed(() => {
  const data = [
    {
      group: [
        {
          type: 'content_author',
          title: props.data?.provider
            ? 'Udbyder'
            : props.data?.corporation
              ? 'Virksomhed'
              : '',
          content: props.data?.provider
            ? props.data?.provider?.link
            : props.data?.corporation
              ? props.data?.corporation?.link
              : '',
          author_name: props.data?.provider
            ? props.data?.provider?.field_name
            : props.data?.corporation
              ? props.data?.corporation?.field_name
              : '',
        },
        {
          title: 'Målgruppe',
          content: props.data?.field_audience,
        },
      ],
    },
  ];

  return filterGroups(data);
});
</script>

<template>
  <div class="news">
    <div class="news__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="news__tags-wrapper">
              <div class="news__tags-item" v-if="data?.bundle_label">
                <BaseTag
                  v-if="data?.bundle_label"
                  :data="{ label: data?.bundle_label }"
                  color="primary"
                />
              </div>

              <div class="news__tags-item" v-if="data?.field_theme?.label">
                <BaseTag
                  v-if="data?.field_theme?.label"
                  :data="{ label: data?.field_theme?.label }"
                  color="secondary"
                />
              </div>

              <div class="news__tags-item" v-if="data?.field_banner">
                <BaseTag
                  :data="{ label: data?.field_banner }"
                  color="secondary-lighten"
                />
              </div>
            </div>

            <div class="news__page-heading-wrapper">
              <h1 class="news__page-title">{{ data?.label }}</h1>
            </div>

            <div class="news__banner-image">
              <BaseImage v-if="data.field_image" :image="data.field_image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container news__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <BaseRte :content="data.body" />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation
            :data="practicalInfoData"
          ></PracticalInformation>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 news__divider">
          <BaseDivider />
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
          <ClientOnly>
            <VideoComponent
              v-if="
                data?.field_video_title ||
                data?.field_video_description ||
                data?.field_video?.length > 0
              "
              :data="{
                videoTitle: data?.field_video_title,
                videoDescription: data?.field_video_description,
                videoArr: data?.field_video,
              }"
              :layoutType="data.field_video.length > 1 ? 'carousel' : 'flex'"
            />
          </ClientOnly>
        </div>

        <!-- Section cards -->
        <div
          class="col-xs-12 col-sm-12 col-md-12 news__section"
          v-if="
            data.field_other_info.length > 1 ||
            data.field_other_info[0].field_literature_suggestion ||
            data.field_other_info[0].field_material_description ||
            data.field_other_info[0].field_material_title ||
            data.field_other_info[0].field_material_file ||
            data.field_other_info[0].field_material_url
          "
        >
          <div class="news__educational-cards">
            <EducationalCards
              :data="{
                field_materials: data.field_other_info,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.news {
  background-color: var(--color-tertiary-lighten-6);
  color: var(--color-text);
  margin-bottom: 24px;

  &__top-section {
    padding: 32px 0 @(--sm) 0 0 64px 0;
    background-color: var(--color-primary-lighten-5);
  }

  &__tags-wrapper {
    padding-top: 24px;
    display: grid @(--sm) flex;
    gap: 12px @(--sm) 16px;
    margin-bottom: 32px;
  }

  &__page-heading-wrapper {
    display: grid @(--md) flex;
    justify-content: space-between;
    margin-bottom: 48px;
    align-items: center;
  }

  &__page-title {
    font-weight: 700;
    word-break: break-word;
  }

  &__page-heading-button-container {
    margin-top: 10px @(--md) 0;
    display: grid @(--sm) flex;
    gap: 10px @(--sm) 0;

    .button {
      margin-left: 0 @(--md) 12px;
      white-space: normal @(--sm) nowrap;
    }
  }

  &__second-section {
    padding-top: 48px @(--md) 96px;
  }

  &__divider {
    padding-top: 43px @(--sm) 97px;
    margin-bottom: 43px @(--sm) 97px;
  }

  &__link {
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;

    &:hover {
      border-bottom: 1px solid var(--color-primary);
    }
  }

  &__section-video,
  &__section {
    padding-top: 48px @(--md) 96px;
  }
}
</style>
