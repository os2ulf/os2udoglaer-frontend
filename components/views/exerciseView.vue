<script setup lang="ts">
import { filterGroups } from '~/utils/dataFilter';
import { Navigation, A11y, Autoplay, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const modules = [Navigation, Scrollbar, A11y, Autoplay];
const breakpoints = {
  768: {
    slidesPerView: 1,
  },
  992: {
    slidesPerView: 2,
  },
};

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const placesToVisit = computed(() => {
  return props.data.field_related_user;
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
              ? props.data?.field_trgt_grp_primary_school
              : props.data?.field_target_group === 'Dagtilbud'
                ? props.data?.field_trgt_grp_daycare
                : props.data?.field_target_group === 'Ungdomsuddannelse'
                  ? props.data?.field_trgt_grp_youth_education
                  : '',
        },
        {
          title:
            props.data?.field_target_group === 'Dagtilbud'
              ? 'Læreplanstemaer'
              : 'Fag',
          content:
            props.data?.field_target_group === 'Grundskole'
              ? props.data?.field_primary_school_subject
              : props.data?.field_target_group === 'Dagtilbud'
                ? props.data?.field_curriculum_themes
                : props.data?.field_target_group === 'Ungdomsuddannelse'
                  ? props.data?.field_youth_education_subject
                  : '',
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
    {
      group: [
        {
          type: 'places_to_visit',
          title: 'Besøgssteder',
          content: placesToVisit.value,
        },
      ],
    },
  ];

  return filterGroups(data);
});

const showModal = ref(false);
const contactPersonEmail = ref(
  props.data?.provider?.field_mail ||
    props.data?.corporation?.field_mail ||
    null,
);

// Get the complete URL for the current page.
const currentUrl = computed(() => {
  return process.client ? window.location.href : '';
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
                v-if="data?.bundle_label"
              >
                <BaseTag
                  :data="{ label: data?.bundle_label }"
                  color="primary"
                />
              </div>

              <div
                class="exercise__tags-item"
                v-if="data?.field_focus && !data?.field_banner"
              >
                <BaseTag
                  :data="{ label: data?.field_focus[0] }"
                  color="primary-lighten"
                />
              </div>

              <div class="exercise__tags-item" v-if="data?.field_banner">
                <BaseTag
                  :data="{ label: data?.field_banner }"
                  color="secondary-lighten"
                />
              </div>
            </div>
            <div class="exercise__page-heading-wrapper">
              <h1 class="exercise__page-title">{{ data?.label }}</h1>
              <div class="exercise__page-heading-button-container">
                <BaseButton
                  v-if="
                    (data?.provider &&
                      data?.provider.link &&
                      !data?.field_hide_contact_form) ||
                    (data?.corporation &&
                      data?.corporation.link &&
                      !data?.field_hide_contact_form)
                  "
                  class="button button--secondary--ghost"
                  :button-data="{
                    title: props.data?.provider
                      ? 'Kontakt udbyder'
                      : props.data?.corporation
                        ? 'Kontakt virksomhed'
                        : '',
                  }"
                  @click="showModal = true"
                  @keydown.enter="showModal = true"
                  role="button"
                />
              </div>
            </div>

            <div class="exercise__banner-image">
              <BaseImage v-if="data.field_image" :image="data.field_image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container exercise__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <h2>Beskrivelse</h2>
            <BaseRte :content="data.body" />
          </div>

          <div
            class="exercise__paragraph-item"
            v-if="data.field_purpose_exercise"
          >
            <h4>Mål</h4>
            <BaseRte :content="data.field_purpose_exercise" />
          </div>

          <div class="exercise__paragraph-item" v-if="data.field_preparation">
            <h4>Forberedelse</h4>
            <BaseRte :content="data.field_preparation" />
          </div>

          <div class="exercise__paragraph-item" v-if="data.field_how_to">
            <h4>Sådan gør du</h4>
            <BaseRte :content="data.field_how_to" />
          </div>

          <!-- Thats a misspell from the BE, ha! -->
          <div
            class="exercise__paragraph-item"
            v-if="data.field_ackground_knowledge"
          >
            <h4>Før besøget</h4>
            <BaseRte :content="data.field_ackground_knowledge" />
          </div>

          <div class="exercise__paragraph-item" v-if="data.field_activities">
            <h4>Under besøget</h4>
            <BaseRte :content="data.field_activities" />
          </div>

          <div
            class="exercise__paragraph-item"
            v-if="data.field_post_processing"
          >
            <h4>Efter besøget</h4>
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
              v-if="
                (data?.provider &&
                  data?.provider.link &&
                  !data?.field_hide_contact_form) ||
                (data?.corporation &&
                  data?.corporation.link &&
                  !data?.field_hide_contact_form)
              "
              class="button button--secondary--ghost"
              :button-data="{
                title: props.data?.provider
                  ? 'Kontakt udbyder'
                  : props.data?.corporation
                    ? 'Kontakt virksomhed'
                    : '',
              }"
              @click="showModal = true"
              @keydown.enter="showModal = true"
              role="button"
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

        <!-- Section related articles -->
        <div
          v-if="props.data.field_related_excercises.length > 0"
          class="col-xs-12 col-sm-12 col-md-12 exercise__section-related-articles"
        >
          <div class="exercise__related-articles">
            <h3>Kan suppleres med følgende opgaver</h3>
            <ClientOnly>
              <Swiper
                :modules="modules"
                :breakpoints="breakpoints"
                :space-between="24"
                navigation
                :scrollbar="{ draggable: true }"
              >
                <SwiperSlide
                  v-for="item in data.field_related_excercises"
                  :key="item.id"
                >
                  <BaseCard :data="item" />
                </SwiperSlide>
              </Swiper>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <TheSlotModal
        v-if="showModal"
        :isOpen="showModal"
        @update:isOpen="showModal = $event"
      >
        <ContactForm
          :contactPersonEmail="contactPersonEmail"
          :currentUrl="currentUrl"
          :currentTitle="props.data?.label"
          :contactPersonName="
            props.data?.provider
              ? props.data?.provider?.field_name
              : props.data?.corporation
                ? props.data?.corporation?.field_name
                : ''
          "
        />
      </TheSlotModal>
    </Transition>
  </div>
</template>

<style lang="postcss" scoped>
.exercise {
  background-color: var(--color-gray-8);

  &__top-section {
    background-color: var(--color-primary-lighten-5);
    padding-bottom: 64px;
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

  &__related-articles {
    h3 {
      margin-bottom: 0;
      padding-right: 120px;
    }

    :deep(.swiper) {
      padding-top: 24px @(--sm) 44px;
      padding-bottom: 44px @(--sm) 70px;
      overflow: clip;
      overflow-y: visible;
    }

    :deep(.swiper-button-next),
    :deep(.swiper-button-prev) {
      top: -32px @(--sm) -36px;
      margin-bottom: 0;
    }

    :deep(.swiper-horizontal > .swiper-scrollbar) {
      width: 100%;
      max-width: 100%;
    }
  }
}
</style>
