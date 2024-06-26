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
          title: 'Emneområde',
          content: props.data?.field_subject,
        },
        {
          title: 'Målgruppe',
          content:
            props.data?.field_target_group === 'Grundskole'
              ? props.data?.field_trgt_grp_primary_school.concat(
                  props.data?.field_primary_school_subject,
                )
              : props.data?.field_target_group === 'Dagtilbud'
                ? props.data?.field_trgt_grp_daycare.concat(
                    props.data?.field_curriculum_themes,
                  )
                : props.data?.field_target_group === 'Ungdomsuddannelse'
                  ? props.data?.field_trgt_grp_youth_education.concat(
                      props.data?.field_youth_education_subject,
                    )
                  : 'Object needed from BE',
        },
        {
          title: 'Aktivitet',
          content: props.data?.field_activity_select,
        },
      ],
    },
    {
      group: [
        {
          title: 'Varighed',
          content: props.data?.field_duration_select,
          description: props.data?.field_duration_description,
        },
        {
          title: 'Periode',
          content: props.data?.field_period_select,
          description: props.data?.field_description_of_period,
        },
      ],
    },
    {
      group: [
        {
          type: 'sustainability_goals',
          title: 'Verdensmål',
          content: props.data?.field_sustainability_goals,
          description: props.data?.field_sustainability_goals_desc,
        },
      ],
    },
  ];

  return filterGroups(data);
});
</script>

<template>
  <div class="exercise">
    <div class="exercise__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="exercise__tags-wrapper">
              <div
                class="exercise__tags-item exercise__tags-item--main"
                v-if="data?.field_target_group"
              >
                <BaseTag
                  v-if="data?.field_target_group"
                  :data="{ label: data?.field_target_group }"
                  color="primary"
                />
              </div>
            </div>
            <div class="exercise__page-heading-wrapper">
              <h1 class="exercise__page-title">{{ data?.label }}</h1>
              <div class="exercise__page-heading-button-container">
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

            <div class="exercise__banner-image">
              <BaseImage
                v-if="data.field_image"
                :image="data.field_image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container exercise__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <BaseRte :content="data.body" />
          </div>

          <div
            class="exercise__paragraph-item"
            v-if="data.field_purpose_exercise"
          >
            <BaseRte :content="data.field_purpose_exercise" />
          </div>

          <div class="exercise__paragraph-item" v-if="data.field_preparation">
            <BaseRte :content="data.field_preparation" />
          </div>

          <div class="exercise__paragraph-item" v-if="data.field_how_to">
            <BaseRte :content="data.field_how_to" />
          </div>

          <!-- Thats a misspell from the BE, ha! -->
          <div
            class="exercise__paragraph-item"
            v-if="data.field_ackground_knowledge"
          >
            <BaseRte :content="data.field_ackground_knowledge" />
          </div>

          <div class="exercise__paragraph-item" v-if="data.field_activities">
            <BaseRte :content="data.field_activities" />
          </div>

          <div
            class="exercise__paragraph-item"
            v-if="data.field_post_processing"
          >
            <BaseRte :content="data.field_post_processing" />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation :data="practicalInfoData" />
          <div class="exercise__practical-buttons">
            <BaseButton
              v-if="data?.provider && data?.provider.link || data?.corporation && data?.corporation.link"
              class="button button--ghost exercise__contact-button"
              :button-data="{
                title: props.data?.provider ? 'Kontakt udbyder' : props.data?.corporation ? 'Kontakt virksomhed' : '',
                url: props.data?.provider ? data.provider.link : props.data?.corporation ? data.corporation.link : '',
                target: '_blank'
              }"
            />
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-12 exercise__section-video"
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
          class="col-xs-12 col-sm-12 col-md-12 exercise__section-cards"
          v-if="
            data.field_work_documents?.length > 1 ||
            data.field_work_documents[0]?.field_literature_suggestion ||
            data.field_work_documents[0]?.field_material_description ||
            data.field_work_documents[0]?.field_material_title ||
            data.field_work_documents[0]?.field_material_file ||
            data.field_work_documents[0]?.field_material_url
          "
        >
          <div class="exercise__educational-cards">
            <EducationalCards
              :data="{
                field_materials: data.field_work_documents,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.exercise {
  background-color: var(--color-tertiary-lighten-5);

  &__top-section {
    background-color: var(--color-primary-lighten-5);
    padding-bottom: 64px;
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
      color: var(--color-white) !important;
      background-color: var(--color-tertiary);
    }
  }

  &__second-section {
    padding-top: 48px @(--md) 96px;
  }

  &__section-cards {
    padding-top: 24px @(--md) 48px;
    padding-bottom: 24px @(--md) 48px;
  }

  &__section-video {
    padding-top: 48px @(--md) 96px;
    padding-bottom: 24px @(--md) 48px;
  }

  &__section-related-articles {
    padding-top: 24px @(--md) 48px;
    padding-bottom: 48px @(--md) 96px;
  }
}
</style>
