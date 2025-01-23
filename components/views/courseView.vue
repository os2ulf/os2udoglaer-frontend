<script setup lang="ts">
import { filterGroups } from '~/utils/dataFilter';
import { scrollTo } from '~/utils/scrollTo';
import { Navigation, A11y, Autoplay, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useSettingsDataStore } from '~/stores/settingsData';
const settingsDataStore = useSettingsDataStore();

if (settingsDataStore.settingsData === null) {
  settingsDataStore.getSettingsData();
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

let freeCourseApplicationUrl = computed(
  () => settingsDataStore.settingsData?.free_course_application_reference,
);

if (freeCourseApplicationUrl.value) {
  freeCourseApplicationUrl =
    freeCourseApplicationUrl.value + '?course=' + props.data.id;

  if (props.data?.provider) {
    freeCourseApplicationUrl =
      freeCourseApplicationUrl + '&provider=' + props.data.provider.id;
  }
}

let transportApplicationUrl = computed(
  () => settingsDataStore.settingsData?.transport_pool_application_reference,
);

if (transportApplicationUrl.value) {
  transportApplicationUrl =
    transportApplicationUrl.value + '?course=' + props.data.id;
}

const modules = [Navigation, Scrollbar, A11y, Autoplay];
const breakpoints = {
  768: {
    slidesPerView: 1,
  },
  992: {
    slidesPerView: 2,
  },
};

const priceQuantityPeriodDescription = computed(() => {
  let description = '';
  if (props.data?.field_description_of_price) {
    description = description + props.data?.field_description_of_price;
  }
  if (props.data?.field_quantity_description) {
    description = description + props.data?.field_quantity_description;
  }
  if (props.data?.field_description_of_period) {
    description = description + props.data?.field_description_of_period;
  }
  return description;
});

const registrationData = computed(() => {
  return {
    bundle: props.data?.bundle,
    deadline: props.data?.field_registration_deadline,
    description: props.data?.field_registration_description,
    email: props.data?.field_registration_email,
    phone: props.data?.field_registration_phone,
    title: props.data?.field_registration_title,
    url: props.data?.field_registration_url,
    price: props.data?.field_price,
    price_description: props.data?.field_description_of_price,
    free: props.data?.field_is_free,
    event_shop_url: props.data?.event_shop_url,
    field_pretix_widget_type: props.data?.field_pretix_widget_type,
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
          title: 'Forløbstype',
          content: props.data?.field_course_type,
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
      ],
    },
    {
      group: [
        {
          type: 'price',
          title: 'Pris',
          content: props.data?.field_price[0].field_price
            ? props.data?.field_price
            : '',
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
          description: priceQuantityPeriodDescription.value
            ? priceQuantityPeriodDescription.value
            : '',
        },
      ],
    },
    {
      group: [
        {
          title: 'Varighed',
          content:
            props.data?.field_duration &&
            props.data?.field_duration_unit_taxonomy
              ? props.data?.field_duration +
                ' ' +
                props.data?.field_duration_unit_taxonomy
              : '',
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
                  :data="{ label: data?.field_target_group }"
                  color="primary"
                />
              </div>

              <div
                class="course__tags-item"
                v-if="data?.field_theme && !data?.field_banner"
              >
                <BaseTag
                  :data="{ label: data?.field_theme }"
                  color="primary-lighten"
                />
              </div>

              <div class="course__tags-item" v-if="data?.sales_banner">
                <BaseTag
                  :data="{
                    label: data?.sales_banner ? data?.sales_banner : '',
                  }"
                  color="secondary"
                />
              </div>

              <div class="course__tags-item" v-if="data?.field_banner">
                <BaseTag
                  :data="{ label: data?.field_banner }"
                  color="secondary-lighten"
                />
              </div>
            </div>
            <div class="course__page-heading-wrapper">
              <h1 class="course__page-title">{{ data?.label }}</h1>
              <div class="course__page-heading-button-container">
                <BaseButton
                  v-if="
                    data.field_registration_deadline ||
                    data.field_registration_description ||
                    data.field_registration_email ||
                    data.field_registration_phone ||
                    data.field_registration_title ||
                    data.field_registration_url
                  "
                  icon-after="arrow-right"
                  :button-data="{
                    title: 'Tilmelding',
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

            <div class="course__banner-image">
              <BaseImage v-if="data.field_image" :image="data.field_image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container course__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <h2>Beskrivelse</h2>
            <BaseRte :content="data.body" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_activities">
            <h4>Aktiviteter</h4>
            <BaseRte :content="data.field_activities" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_preparation">
            <h4>Forberedelse</h4>
            <BaseRte :content="data.field_preparation" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_post_processing">
            <h4>Efterbehandling</h4>
            <BaseRte :content="data.field_post_processing" />
          </div>

          <div class="course__paragraph-item" v-if="data.field_purpose">
            <h4>Formål</h4>
            <BaseRte :content="data.field_purpose" />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation
            :data="practicalInfoData"
            :isFree="data.field_is_free"
          />
          <div class="course__practical-buttons">
            <BaseButton
              v-if="
                data.field_registration_deadline ||
                data.field_registration_description ||
                data.field_registration_email ||
                data.field_registration_phone ||
                data.field_registration_title ||
                data.field_registration_url
              "
              :button-data="{
                title: 'Tilmeld dig forløbet',
              }"
              @click="scrollTo('course-registration')"
              icon-after="arrow-right"
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
              class="button button--ghost course__contact-button"
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
            <ClientOnly>
              <BaseButton
                v-if="
                  data.field_target_group === 'Grundskole' &&
                  data.field_practical_info_buttons?.includes(
                    'show_transport_request',
                  ) &&
                  transportApplicationUrl
                "
                class="button--primary"
                :button-data="{
                  title: 'Information om transport',
                  url: transportApplicationUrl,
                }"
                icon-after="ext-link"
                ghost
                role="button"
              />
              <BaseButton
                v-if="
                  data.field_target_group === 'Grundskole' &&
                  data.field_practical_info_buttons?.includes(
                    'show_free_course_request',
                  ) &&
                  freeCourseApplicationUrl
                "
                class="button--primary"
                :button-data="{
                  title: 'Ansøg om betaling af dette forløb!',
                  url: freeCourseApplicationUrl,
                }"
                icon-after="ext-link"
                ghost
                role="button"
              />
            </ClientOnly>
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

        <!-- Section registration -->
        <div
          v-if="
            data.field_registration_deadline ||
            data.field_registration_description ||
            data.field_registration_email ||
            data.field_registration_phone ||
            data.field_registration_title ||
            data.field_registration_url ||
            (data.event_shop_url && data.field_pretix_widget_type)
          "
          id="course-registration"
          class="col-xs-12 col-sm-12 col-md-12 course__section-registration"
        >
          <RegistrationSection :data="registrationData" />
        </div>

        <!-- Section related articles -->
        <div
          v-if="props.data.field_related_courses.length > 0"
          class="col-xs-12 col-sm-12 col-md-12 course__section-related-articles"
        >
          <div class="course__related-articles">
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
.course {
  color: var(--color-text);
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

  &__contact-button {
    color: var(--color-tertiary-text);
    border-color: var(--color-tertiary);

    &:hover {
      color: var(--color-tertiary-text) !important;
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
