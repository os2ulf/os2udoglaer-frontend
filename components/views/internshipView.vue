<script setup lang="ts">
import { filterGroups } from '~/utils/dataFilter';
import { scrollTo } from '~/utils/scrollTo';
import { Navigation, A11y, Autoplay, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';
import { removeBEdomain } from '~/utils/removeBEdomain';
import { seoCanonicalUrlHandler } from '~/utils/seoCanonicalUrlHandler';

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

const openGraph = ref(props.data?.field_meta_tags?.html_head);

useHead({
  title: openGraph.value.title?.attributes?.content,
  meta: [
    {
      name: 'description',
      content: openGraph.value.description?.attributes?.content,
    },
    { name: 'robots', content: openGraph.value.robots?.attributes?.content },
    {
      name: 'abstract',
      content: openGraph.value.abstract?.attributes?.content,
    },
    {
      name: 'keywords',
      content: openGraph.value.keywords?.attributes?.content,
    },
    {
      property: 'og:description',
      content: openGraph.value.og_description?.attributes?.content,
    },
    {
      property: 'og:image',
      content: openGraph.value.og_image_0?.attributes?.content,
    },
    {
      property: 'og:site_name',
      content: openGraph.value.og_site_name?.attributes?.content,
    },
    {
      property: 'og:title',
      content: openGraph.value.og_title?.attributes?.content,
    },
    {
      property: 'og:url',
      content:
        useGetCurrentDomain() +
        removeBEdomain(openGraph.value.og_url?.attributes?.content),
    },
    {
      property: 'og:type',
      content: openGraph.value.og_type?.attributes?.content,
    },
    {
      property: 'og:determiner',
      content: openGraph.value.og_determiner?.attributes?.content,
    },
    {
      property: 'article:author',
      content: openGraph.value.article_author_0?.attributes?.content,
    },
    {
      property: 'article:expiration_time',
      content: openGraph.value.article_expiration_time?.attributes?.content,
    },
    {
      property: 'article:modified_time',
      content: openGraph.value.article_modified_time?.attributes?.content,
    },
    {
      property: 'article:published_time',
      content: openGraph.value.article_published_time?.attributes?.content,
    },
    {
      property: 'article:publisher',
      content: openGraph.value.article_publisher?.attributes?.content,
    },
    {
      property: 'article:section',
      content: openGraph.value.article_section?.attributes?.content,
    },
    {
      property: 'article:tag',
      content: openGraph.value.article_tag_0?.attributes?.content,
    },
    {
      property: 'book:author',
      content: openGraph.value.book_author_0?.attributes?.content,
    },
    {
      property: 'book:isbn',
      content: openGraph.value.book_isbn?.attributes?.content,
    },
    {
      property: 'book:release_date',
      content: openGraph.value.book_release_date?.attributes?.content,
    },
    {
      property: 'book:tag',
      content: openGraph.value.book_tag_0?.attributes?.content,
    },
    {
      property: 'og:audio',
      content: openGraph.value.og_audio?.attributes?.content,
    },
    {
      property: 'og:audio:secure_url',
      content: openGraph.value.og_audio_secure_url?.attributes?.content,
    },
    {
      property: 'og:audio:type',
      content: openGraph.value.og_audio_type?.attributes?.content,
    },
    {
      property: 'og:country-name',
      content: openGraph.value.og_country_name?.attributes?.content,
    },
    {
      property: 'og:email',
      content: openGraph.value.og_email?.attributes?.content,
    },
    {
      property: 'og:fax_number',
      content: openGraph.value.og_fax_number?.attributes?.content,
    },
    {
      property: 'og:image:alt',
      content: openGraph.value.og_image_alt?.attributes?.content,
    },
    {
      property: 'og:image:height',
      content: openGraph.value.og_image_height?.attributes?.content,
    },
    {
      property: 'og:image:secure_url',
      content: openGraph.value.og_image_secure_url_0?.attributes?.content,
    },
    {
      property: 'og:image:type',
      content: openGraph.value.og_image_type?.attributes?.content,
    },
    {
      property: 'og:image:url',
      content: openGraph.value.og_image_url_0?.attributes?.content,
    },
    {
      property: 'og:image:width',
      content: openGraph.value.og_image_width?.attributes?.content,
    },
    {
      property: 'og:latitude',
      content: openGraph.value.og_latitude?.attributes?.content,
    },
    {
      property: 'og:locale',
      content: openGraph.value.og_locale?.attributes?.content,
    },
    {
      property: 'og:locale:alternative',
      content: openGraph.value.og_locale_alternative_0?.attributes?.content,
    },
    {
      property: 'og:locality',
      content: openGraph.value.og_locality?.attributes?.content,
    },
    {
      property: 'og:longitude',
      content: openGraph.value.og_longitude?.attributes?.content,
    },
    {
      property: 'og:phone_number',
      content: openGraph.value.og_phone_number?.attributes?.content,
    },
    {
      property: 'og:postal_code',
      content: openGraph.value.og_postal_code?.attributes?.content,
    },
    {
      property: 'og:region',
      content: openGraph.value.og_region?.attributes?.content,
    },
    {
      property: 'og:see_also',
      content: openGraph.value.og_see_also?.attributes?.content,
    },
    {
      property: 'og:street_address',
      content: openGraph.value.og_street_address?.attributes?.content,
    },
    {
      property: 'og:updated_time',
      content: openGraph.value.og_updated_time?.attributes?.content,
    },
    {
      property: 'og:video',
      content: openGraph.value.og_video_0?.attributes?.content,
    },
    {
      property: 'og:video:duration',
      content: openGraph.value.og_video_duration?.attributes?.content,
    },
    {
      property: 'og:video:height',
      content: openGraph.value.og_video_height?.attributes?.content,
    },
    {
      property: 'og:video:secure_url',
      content: openGraph.value.og_video_secure_url?.attributes?.content,
    },
    {
      property: 'og:video:type',
      content: openGraph.value.og_video_type?.attributes?.content,
    },
    {
      property: 'og:video:width',
      content: openGraph.value.og_video_width?.attributes?.content,
    },
    {
      property: 'profile:first_name',
      content: openGraph.value.profile_first_name?.attributes?.content,
    },
    {
      property: 'profile:gender',
      content: openGraph.value.profile_gender?.attributes?.content,
    },
    {
      property: 'profile:last_name',
      content: openGraph.value.profile_last_name?.attributes?.content,
    },
    {
      property: 'profile:username',
      content: openGraph.value.profile_username?.attributes?.content,
    },
    {
      property: 'video:actor',
      content: openGraph.value.video_actor_0?.attributes?.content,
    },
    {
      property: 'video:actor:role',
      content: openGraph.value.video_actor_role_0?.attributes?.content,
    },
    {
      property: 'video:director',
      content: openGraph.value.video_director_0?.attributes?.content,
    },
    {
      property: 'video:release_date',
      content: openGraph.value.video_release_date?.attributes?.content,
    },
    {
      property: 'video:series',
      content: openGraph.value.video_series?.attributes?.content,
    },
    {
      property: 'video:tag',
      content: openGraph.value.video_tag_0?.attributes?.content,
    },
    {
      property: 'video:writer',
      content: openGraph.value.video_writer_0?.attributes?.content,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: seoCanonicalUrlHandler(
        openGraph.value.canonical_url?.attributes?.href,
        props.data?.is_frontpage,
      ),
    },
    { rel: 'image_src', href: openGraph.value.image_src?.attributes?.href },
  ],
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

console.log('internshipView.vue', props.data);
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
                  v-if="data?.bundle_label"
                  :data="{ label: data?.bundle_label }"
                  color="primary"
                />
              </div>
              <div class="internship__tags-item" v-if="data?.field_theme">
                <BaseTag
                  v-if="data?.field_theme"
                  :data="{ label: data?.field_theme.label }"
                  color="secondary"
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
            />
            <BaseButton
              v-if="
                (data?.provider && data?.provider.link) ||
                (data?.corporation && data?.corporation.link)
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
        <ContactForm :contactPersonEmail="contactPersonEmail" />
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
