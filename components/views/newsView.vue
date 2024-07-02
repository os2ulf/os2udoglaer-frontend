<script setup lang="ts">
import { filterGroups } from '~/utils/dataFilter';

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
      content: openGraph.value.og_url?.attributes?.content,
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
    { rel: 'canonical', href: openGraph.value.canonical_url?.attributes?.href },
    { rel: 'image_src', href: openGraph.value.image_src?.attributes?.href },
  ],
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
              <div class="news__tags-item" v-if="data?.bundle_label">
                <BaseTag
                  v-if="data?.bundle_label"
                  :data="{ label: data?.bundle_label }"
                  color="primary"
                />
              </div>
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
              </div>
            </div>

            <div class="news__banner-image">
              <BaseImage v-if="data.field_image" :image="data.field_image" />
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
  color: var(--color-text);

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
