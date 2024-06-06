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
          title: 'Udbyder',
          content: 'Object needed from BE',
        },
      ],
    },
    {
      group: [
        {
          title: 'Sted',
          content: [
            props.data?.field_location_name,
            props.data?.field_location_street,
            props.data?.field_location_zipcode,
            props.data?.field_location_city,
          ],
          description: props.data?.field_location_description,
        },
      ],
    },
    {
      group: [
        {
          title: 'Forløbstype',
          content: props.data?.field_course_type,
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
      ],
    },
    {
      group: [
        {
          type: 'price',
          title: 'Pris',
          content: props.data?.field_price,
          free: props.data?.field_is_free,
        },
        {
          title: 'Antal',
          content: props.data?.field_quantity,
        },
        {
          title: 'Periode',
          content: props.data?.field_all_year
            ? 'Hele året'
            : props.data?.field_period?.start_date +
              props.data?.field_period?.separator +
              props.data?.field_period?.end_date,
          description:
            props.data?.field_description_of_price +
            props.data?.field_quantity_description +
            props.data?.field_description_of_period,
        },
      ],
    },
    {
      group: [
        {
          title: 'Varighed',
          content:
            props.data?.field_duration_unit != null
              ? props.data?.field_duration +
                ' ' +
                props.data?.field_duration_unit
              : props.data?.field_duration,
          description: props.data?.field_description_of_duration,
        },
      ],
    },
    {
      group: [
        {
          title: 'Emneområde',
          content: props.data?.field_subject,
        },
      ],
    },
    {
      group: [
        {
          title: 'Faciliteter',
          content: props.data?.field_faciliteter,
          description: props.data?.field_facilities_description,
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

console.log('courseView', props.data);
</script>

<template>
  <div class="course">
    <div class="course__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="course__tags-wrapper">
              <div
                class="course__tags-item course__tags-item--main"
                v-if="data?.field_target_group"
              >
                <BaseTag
                  v-if="data?.field_target_group"
                  :data="{ label: data?.field_target_group }"
                  color="primary"
                />
              </div>

              <div class="course__tags-item" v-if="data?.field_theme">
                <BaseTag
                  v-if="data?.field_theme"
                  :data="{ label: data?.field_theme }"
                  color="secondary"
                />
              </div>

              <div class="course__tags-item" v-if="data?.field_is_free">
                <BaseTag
                  v-if="data?.field_is_free"
                  :data="{ label: 'Gratis' }"
                  color="secondary"
                />
              </div>
            </div>
            <div class="course__page-heading-wrapper">
              <h1 class="course__page-title">{{ data?.label }}</h1>
              <div class="course__page-heading-button-container">
                <!-- TODO: connect buttons -->
                <BaseButton
                  icon-after="arrow-right"
                  :button-data="{ title: 'Tilmelding' }"
                  class="button button--secondary"
                />
                <button class="button button--secondary--ghost">
                  Kontakt udbyder
                </button>
              </div>
            </div>

            <div class="course__banner-image">
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

    <div class="container course__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <BaseRte :content="data.body" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_activities">
            <BaseRte :content="data.field_activities" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_preparation">
            <BaseRte :content="data.field_preparation" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_post_processing">
            <BaseRte :content="data.field_post_processing" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_purpose">
            <BaseRte :content="data.field_purpose" />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation :data="practicalInfoData" />
          <div class="course__practical-buttons">
            <BaseButton
              v-if="
                data.field_target_group === 'Grundskole' &&
                data.field_practical_info_buttons?.includes(
                  'show_free_course_request',
                )
              "
              :button-data="{ title: 'Tilmeld dig forløbet' }"
              icon-after="arrow-right"
              class="button--secondary"
            />
            <button class="button button--ghost course__contact-button">
              Kontakt udbyder
            </button>
            <BaseButton
              v-if="
                data.field_target_group === 'Grundskole' &&
                data.field_practical_info_buttons?.includes(
                  'show_transport_request',
                )
              "
              class="button--primary"
              :button-data="{ title: 'Information om transport' }"
              icon-after="ext-link"
              ghost
            />
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-12 course__section-video"
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
          class="col-xs-12 col-sm-12 col-md-12 course__section-cards"
          v-if="
            data.field_materials.length > 1 ||
            data.field_materials[0].field_literature_suggestion ||
            data.field_materials[0].field_material_description ||
            data.field_materials[0].field_material_title ||
            data.field_materials[0].field_material_file ||
            data.field_materials[0].field_material_url
          "
        >
          <div class="course__educational-cards">
            <EducationalCards
              :data="{
                field_materials: data.field_materials,
              }"
            />
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
