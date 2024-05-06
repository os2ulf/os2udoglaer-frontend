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
                  :button-data="{ title: 'Find forløb' }"
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
        <div class="col-xs-12 col-sm-12 col-md-6">
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
        <div class="col-xs-12 col-sm-12 col-md-4 col-md-offset-2">
          <SharePage />
          <PracticalInformation
            :data="{
              field_author: 'Object needed from BE',
              field_location_description: data?.field_location_description,
              field_location_name: data?.field_location_name,
              field_location_street: data?.field_location_street,
              field_location_zipcode: data?.field_location_zipcode,
              field_location_city: data?.field_location_city,
              field_quantity: data?.field_quantity,
              field_quantity_description: data?.field_quantity_description,
              field_price: data?.field_price,
              field_all_year: data?.field_all_year,
              field_description_of_price: data?.field_description_of_price,
              field_period: data?.field_period,
              field_description_of_period: data?.field_description_of_period,
              field_duration: data?.field_duration,
              field_duration_unit: data?.field_duration_unit,
              field_description_of_duration:
                data?.field_description_of_duration,
              field_course_type: data?.field_course_type,
              field_trgt_grp_primary_school:
                data?.field_trgt_grp_primary_school,
              field_subject: data?.field_subject,
              field_faciliteter: data?.field_faciliteter,
              field_primary_school_subject: data?.field_primary_school_subject,
              field_sustainability_goals: data?.field_sustainability_goals,
              field_sustainability_goals_desc:
                data?.field_sustainability_goals_desc,
              field_facilities_description: data?.field_facilities_description,
              field_is_free: data?.field_is_free,
              field_target_group: data?.field_target_group,
              field_curriculum_themes: data?.field_curriculum_themes,
              field_trgt_grp_daycare: data?.field_trgt_grp_daycare,
              field_youth_education_subject:
                data?.field_youth_education_subject,
              field_trgt_grp_youth_education:
                data?.field_trgt_grp_youth_education,
            }"
          />
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
            class="course__section-video"
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
  /* TODO: bg var */
  background-color: #f5f5f5;

  &__top-section {
    /* TODO: set var */
    background-color: #eaf2f2;
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
