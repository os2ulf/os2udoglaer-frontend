<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

console.log('Kursus', props.data);

useHead({
  title: props.data?.field_meta_tags?.html_head?.title?.atributes?.content,
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
      title: 'Målgruppe',
      content: props.data?.field_educators_target_group,
    },
    {
      title: 'Læreplanstemaer',
      content: props.data?.field_curriculum_themes,
    },
    {
      title: 'Fag - Grundskole',
      content: props.data?.field_primary_school_subject,
    },
    {
      title: 'Fag - Ungdomsuddannelse',
      content: props.data?.field_youth_education_subject,
    },
    {
      title: 'Antal',
      content: props.data?.field_quantity,
      description: props.data?.field_quantity_description,
    },
    {
      type: 'divider',
    },
    {
      title: 'Periode',
      content: props.data?.field_all_year
        ? 'Hele året'
        : props.data?.field_period?.start_date +
          props.data?.field_period?.separator +
          props.data?.field_period?.end_date,
    },
    {
      type: 'price',
      title: 'Pris',
      content: props.data?.field_price,
      free: props.data?.field_is_free,
    },
    {
      title: 'Varighed',
      content:
        props.data?.field_duration +
        ' ' +
        props.data?.field_duration_unit_taxonomy.label,
    },
    {
      description:
        props.data?.field_description_of_period +
        props.data?.field_description_of_price +
        props.data?.field_description_of_duration,
    },
    {
      type: 'divider',
    },
    {
      title: 'Emneområde',
      content: props.data?.field_subject,
    },
    {
      type: 'sustainability_goals',
      title: 'Verdensmål',
      content: props.data?.field_sustainability_goals,
      description: props.data?.field_sustainability_goals_desc,
    },
    {
      type: 'divider',
    },
    {
      title: 'Forplejning',
      description: props.data?.field_food_service,
    },
    {
      type: 'divider',
    },
    {
      title: 'Sted',
      content: [
        props.data?.field_location_name,
        props.data?.field_location_street,
        props.data?.field_location_zipcode,
        props.data?.field_location_city,
      ],
    },
    {
      title: 'Faciliteter',
      content: props.data?.field_faciliteter,
      description: props.data?.field_facilities_description,
    },
    {
      description: props.data?.field_location_description,
    },
  ];
});
</script>

<template>
  <div class="educators">
    <div class="educators__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="educators__tags-wrapper">
              <div class="educators__tags-item" v-if="data?.field_theme">
                <BaseTag
                  v-if="data?.field_theme"
                  :data="{ label: data?.field_theme }"
                  color="secondary"
                />
              </div>

              <div class="educators__tags-item" v-if="data?.field_is_free">
                <BaseTag
                  v-if="data?.field_is_free"
                  :data="{ label: 'Gratis' }"
                  color="secondary"
                />
              </div>
            </div>
            <div class="educators__page-heading-wrapper">
              <h1 class="educators__page-title">{{ data?.label }}</h1>
              <div class="educators__page-heading-button-container">
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

            <div class="educators__banner-image">
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

    <div class="container educators__second-section">
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
          <PracticalInformation :data="practicalInfoData" />
          <div class="educators__practical-buttons">
            <button class="button button--ghost educators__contact-button">
              Kontakt udbyder
            </button>
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
            class="educators__section-video"
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
          class="col-xs-12 col-sm-12 col-md-12 educators__section-cards"
          v-if="
            data.field_materials.length > 1 ||
            data.field_materials[0].field_literature_suggestion ||
            data.field_materials[0].field_material_description ||
            data.field_materials[0].field_material_title ||
            data.field_materials[0].field_material_file ||
            data.field_materials[0].field_material_url
          "
        >
          <div class="educators__educational-cards">
            <EducationalCards
              :data="{
                field_materials: data.field_materials,
              }"
            />
          </div>
        </div>

        <!-- Section calendar -->
        <div class="col-xs-12 col-sm-12 col-md-12 educators__section-calendar">
          <div class="educators__calendar">
            <h3>Tilmelding</h3>
            <p>calendar integration goes here</p>
          </div>
        </div>

        <!-- Section related articles -->
        <div
          class="col-xs-12 col-sm-12 col-md-12 educators__section-related-articles"
        >
          <div class="educators__related-articles">
            <h3>Relaterede forløb</h3>
            <div>article cards</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.educators {
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
