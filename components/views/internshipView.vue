<script setup lang="ts">
import { filterGroups } from '~/utils/dataFilter';
import { scrollTo } from '~/utils/scrollTo';
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

const registrationData = computed(() => {
  return {
    bundle: props.data?.bundle,
    deadline: props.data?.field_application_deadline,
    description: props.data?.field_desc_application_procedure,
    email: props.data?.field_application_email,
    phone: props.data?.field_application_phone,
    title: props.data?.field_application_title,
    url: props.data?.field_application_url,
    price: '',
    price_description: '',
    free: '',
  };
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
          title: 'Sted',
          content:
            props.data?.field_view_on_map !== 'hidden_on_map'
              ? [
                  props.data?.field_view_on_map == 'show_vendor_address' &&
                  props.data?.provider
                    ? props.data?.provider.field_location_name
                    : props.data?.field_location_name,
                  props.data?.field_view_on_map == 'show_vendor_address' &&
                  props.data?.provider
                    ? props.data?.provider.field_location_street
                    : props.data?.field_location_street,
                  props.data?.field_view_on_map == 'show_vendor_address' &&
                  props.data?.provider
                    ? `${props.data?.provider.field_location_zipcode || ''} ${props.data?.provider.field_location_city || ''}`.trim()
                    : `${props.data?.field_location_zipcode || ''} ${props.data?.field_location_city || ''}`.trim(),
                ]
              : [],
          description: props.data?.field_location_description
            ? props.data?.field_location_description
            : '',
        },
      ],
    },
    {
      group: [
        {
          title: 'Interesseområder',
          content: props.data?.field_areas_of_interest,
        },
        {
          title: 'Branche',
          content: props.data?.field_industry,
        },
        {
          title: 'Uddannelsesvej',
          content: props.data?.field_education_path,
        },
      ],
    },
    {
      group: [
        {
          title: 'Antal',
          content: props.data?.field_quantity,
        },
        {
          title: 'Periode',
          content: props.data?.field_description_of_period,
        },
        {
          title: 'Varighed',
          content: props.data?.field_duration_rte,
        },
        {
          title: 'Mødetider',
          content: props.data?.field_meeting_times,
        },
        {
          title: 'Huskeliste',
          content: props.data?.field_todo_list,
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
  <div class="internship">
    <div class="internship__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="internship__tags-wrapper">
              <div class="internship__tags-item" v-if="data?.bundle_label">
                <BaseTag
                  :data="{ label: data?.bundle_label }"
                  color="primary"
                />
              </div>

              <div
                class="educators__tags-item"
                v-if="data?.field_industry && !data?.field_banner"
              >
                <BaseTag
                  :data="{ label: data?.field_industry[0] }"
                  color="primary-lighten"
                />
              </div>

              <div class="internship__tags-item" v-if="data?.field_sold_out">
                <BaseTag
                  :data="{ label: 'Udsolgt' }"
                  color="secondary"
                />
              </div>

              <div
                class="educators__tags-item"
                v-if="data?.field_banner"
              >
                <BaseTag
                  :data="{ label: data?.field_banner }"
                  color="secondary-lighten"
                />
              </div>
            </div>

            <div class="internship__page-heading-wrapper">
              <h1 class="internship__page-title">{{ data?.label }}</h1>
              <div class="internship__page-heading-button-container">
                <BaseButton
                  v-if="
                    data?.field_application_deadline ||
                    data?.field_desc_application_procedure ||
                    data?.field_application_email ||
                    data?.field_application_phone ||
                    data?.field_application_title ||
                    data?.field_application_url
                  "
                  icon-after="arrow-right"
                  :button-data="{
                    title: 'Ansøgning',
                  }"
                  @click="scrollTo('course-registration')"
                  class="button button--secondary"
                  role="button"
                />
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
                  role="button"
                />
              </div>
            </div>

            <div class="internship__banner-image">
              <BaseImage v-if="data.field_image" :image="data.field_image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container internship__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <h2>Beskrivelse</h2>
            <BaseRte :content="data.body" />
          </div>

          <div
            class="internship__paragraph-item"
            v-if="data.field_purpose_internship"
          >
            <h4>Formål</h4>
            <BaseRte :content="data.field_purpose_internship" />
          </div>

          <div
            class="internship__paragraph-item"
            v-if="data.field_expectations"
          >
            <h4>Forventninger</h4>
            <BaseRte :content="data.field_expectations" />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation :data="practicalInfoData" />
          <div class="internship__practical-buttons">
            <BaseButton
              v-if="
                data.field_application_deadline ||
                data.field_desc_application_procedure ||
                data.field_application_email ||
                data.field_application_phone ||
                data.field_application_title ||
                data.field_application_url
              "
              icon-after="arrow-right"
              :button-data="{
                title: 'Ansøgning',
              }"
              @click="scrollTo('course-registration')"
              class="button button--secondary"
              role="button"
            />
            <BaseButton
              v-if="
                (data?.provider &&
                  data?.provider.link &&
                  !data?.field_hide_contact_form) ||
                (data?.corporation &&
                  data?.corporation.link &&
                  !data?.field_hide_contact_form)
              "
              class="button button--ghost internship__contact-button"
              :button-data="{
                title: props.data?.provider
                  ? 'Kontakt udbyder'
                  : props.data?.corporation
                    ? 'Kontakt virksomhed'
                    : '',
              }"
              @click="showModal = true"
              role="button"
            />
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-12 internship__section-video"
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
          class="col-xs-12 col-sm-12 col-md-12 internship__section-cards"
          v-if="
            data.field_materials.length > 1 ||
            data.field_materials[0].field_literature_suggestion ||
            data.field_materials[0].field_material_description ||
            data.field_materials[0].field_material_title ||
            data.field_materials[0].field_material_file ||
            data.field_materials[0].field_material_url
          "
        >
          <div class="internship__educational-cards">
            <EducationalCards
              :data="{
                field_materials: data.field_materials,
              }"
            />
          </div>
        </div>

        <!-- Section registration -->
        <div
          v-if="
            data.field_application_deadline ||
            data.field_desc_application_procedure ||
            data.field_application_email ||
            data.field_application_phone ||
            data.field_application_url
          "
          id="course-registration"
          class="col-xs-12 col-sm-12 col-md-12 internship__section-registration"
        >
          <RegistrationSection :data="registrationData" />
        </div>

        <!-- Section related articles -->
        <div
          class="col-xs-12 col-sm-12 col-md-12 internship__section-related-articles"
        >
          <div class="internship__related-articles">
            <h3>Relaterede forløb</h3>
            <ClientOnly>
              <Swiper
                :modules="modules"
                :breakpoints="breakpoints"
                :space-between="24"
                navigation
                :scrollbar="{ draggable: true }"
              >
                <SwiperSlide
                  v-for="item in data.field_related_courses"
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
.internship {
  background-color: var(--color-tertiary-lighten-5);
  color: var(--color-text);

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
    word-break: break-word;
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

  &__section-registration {
    padding-top: 24px @(--md) 48px;
    padding-bottom: 24px @(--md) 48px;
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
