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

const periodPriceDurationDescription = computed(() => {
  let description = '';
  if (props.data?.field_description_of_period) {
    description = description + props.data?.field_description_of_period;
  }
  if (props.data?.field_description_of_price) {
    description = description + props.data?.field_description_of_price;
  }
  if (props.data?.field_description_of_duration) {
    description = description + props.data?.field_description_of_duration;
  }
  return description;
});

const registrationData = computed(() => {
  return {
    deadline: props.data?.field_registration_deadline,
    description: props.data?.field_registration_procedure,
    email: props.data?.field_registration_email,
    phone: props.data?.field_registration_phone,
    title: props.data?.field_registration_title,
    url: props.data?.field_registration_url,
    price: props.data?.field_price,
    price_description: props.data?.field_description_of_price,
    free: props.data?.field_is_free,
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
          content: [
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
              ? props.data?.provider.field_location_zipcode +
                ' ' +
                props.data?.provider.field_location_city
              : props.data?.field_location_zipcode +
                ' ' +
                props.data?.field_location_city,
          ],
          description: props.data?.field_location_description
            ? props.data?.field_location_description
            : '',
        },
      ],
    },

    {
      group: [
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
      ],
    },
    {
      group: [
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
          content: props.data?.field_price[0].field_price
            ? props.data?.field_price
            : '',
          free: props.data?.field_is_free,
        },
        {
          title: 'Varighed',
          content:
            props.data?.field_duration &&
            props.data?.field_duration_unit_taxonomy?.label
              ? props.data?.field_duration +
                ' ' +
                props.data?.field_duration_unit_taxonomy?.label
              : '',
        },
        {
          description: periodPriceDurationDescription.value
            ? periodPriceDurationDescription.value
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
      ],
    },
    {
      group: [
        {
          title: 'Forplejning',
          content: props.data?.field_food_service,
        },
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

console.log('course_educatorsView.vue', props.data);
</script>

<template>
  <div class="educators">
    <div class="educators__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="educators__tags-wrapper">
              <div class="educators__tags-item" v-if="data?.bundle_label">
                <BaseTag
                  v-if="data?.bundle_label"
                  :data="{ label: data?.bundle_label }"
                  color="primary"
                />
              </div>

              <div class="educators__tags-item" if="data?.field_theme">
                <BaseTag
                  v-if="data?.field_theme"
                  :data="{ label: data?.field_theme }"
                  color="primary-lighten"
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
                />
                <BaseButton
                  v-if="
                    (data?.provider && data?.provider.link) ||
                    (data?.corporation && data?.corporation.link)
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
                />
              </div>
            </div>

            <div class="educators__banner-image">
              <BaseImage v-if="data.field_image" :image="data.field_image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container educators__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.body">
            <h2>Beskrivelse</h2>
            <BaseRte :content="data.body" />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation :data="practicalInfoData" />
          <div class="educators__practical-buttons">
            <BaseButton
              v-if="
                data.field_registration_deadline ||
                data.field_registration_procedure ||
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
            />
            <BaseButton
              v-if="
                (data?.provider && data?.provider.link) ||
                (data?.corporation && data?.corporation.link)
              "
              class="button button--ghost educators__contact-button"
              :button-data="{
                title: props.data?.provider
                  ? 'Kontakt udbyder'
                  : props.data?.corporation
                    ? 'Kontakt virksomhed'
                    : '',
              }"
              @click="showModal = true"
            />
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-12 educators__section-video"
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

        <!-- Section registration -->
        <div
          v-if="
            data.field_registration_deadline ||
            data.field_registration_procedure ||
            data.field_registration_email ||
            data.field_registration_phone ||
            data.field_registration_title ||
            data.field_registration_url
          "
          id="course-registration"
          class="col-xs-12 col-sm-12 col-md-12 educators__section-registration"
        >
          <RegistrationSection :data="registrationData" />
        </div>

        <!-- Section related articles -->
        <div
          v-if="props.data.field_related_courses.length > 0"
          class="col-xs-12 col-sm-12 col-md-12 educators__section-related-articles"
        >
          <div class="educators__related-articles">
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
        <ContactForm :contactPersonEmail="contactPersonEmail" />
      </TheSlotModal>
    </Transition>
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
