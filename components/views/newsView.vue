<script setup lang="ts">
import { filterGroups } from '~/utils/dataFilter';

const props = defineProps({
  data: {
    type: Object,
    required: true,
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
  title:
    props?.data?.field_meta_tags?.html_head?.title?.attributes?.content ||
    props.data?.field_name,
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

const practicalInfoData = computed(() => {
  const data = [
    {
      group: [
        {
          title: props.data?.provider ? 'Udbyder' : props.data?.corporation ? 'Virksomhed' : '',
          content: props.data?.provider ? '<a href="' + props.data?.provider?.link + '">' + props.data?.provider?.field_name + '</a>' : props.data?.corporation ? '<a href="' + props.data?.corporation?.link + '">' + props.data?.corporation?.field_name + '</a>' : '',
        },
      ],
    },
    {
      group: [
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
              <div class="news__tags-item" v-if="data?.field_theme?.label">
                <BaseTag
                  v-if="data?.field_theme?.label"
                  :data="{ label: data?.field_theme?.label }"
                  color="secondary"
                />
              </div>
            </div>

            <div class="news__page-heading-wrapper">
              <h1 class="news__page-title">{{ data?.label }}</h1>
              <div class="news__page-heading-button-container">
                <!-- TODO: connect buttons -->
                <BaseButton
                  icon-after="arrow-right"
                  :button-data="{ title: 'Find forløb' }"
                  class="button button--secondary"
                />
                <BaseButton
                  v-if="data?.provider && data?.provider.link || data?.corporation && data?.corporation.link"
                  class="button button--secondary--ghost"
                  :button-data="{
                    title: props.data?.provider ? 'Kontakt udbyder' : props.data?.corporation ? 'Kontakt virksomhed' : '',
                    url: props.data?.provider ? data.provider.link : props.data?.corporation ? data.corporation.link : '',
                    target: '_blank'
                  }"
                />
              </div>
            </div>

            <div class="news__banner-image">
              <BaseImage
                v-if="data.field_image"
                :image="data.field_image"
              />
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
  color: var(--color-tertiary);

  &__top-section {
    padding: 32px 0 @(--sm) 0 0 64px 0;
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
