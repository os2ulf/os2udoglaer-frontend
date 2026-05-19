<script lang="ts" setup>
const { useContent } = useContentApi();
import { seoCanonicalUrlHandler } from '~/utils/seoCanonicalUrlHandler';
import useGetCurrentDomain from '~/composables/useGetCurrentDomain';
import { removeBEdomain } from '~/utils/removeBEdomain';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const encodedPath = encodeURIComponent(route.path);

// fetching page data
let error: any = null;
let redirectUrl = ref(null);

const { data } = await useAsyncData(encodedPath, () =>
  useContent(route.path)
    .then((res) => {
      if (res.type === 'redirect') {
        redirectUrl.value = res.target;
      }

      return res;
    })
    .catch((err) => {
      error = err;
    }),
);

if (error || !data.value) {
  if (!error || !error.statusCode) {
    navigateTo('/maintenance');
  }
  // if BE is down
  if (error.statusCode.toString().startsWith('5')) {
    navigateTo('/maintenance');
  }

  // if forbidden to see
  if (error.statusCode === 403) {
    navigateTo('/forbidden');
    window.location.reload();
  }

  // stop code from executing further
  throw createError({
    statusCode: error.statusCode,
    statusMessage: error.message,
  });
}

const viewData = data.value.content;

const isPreview = ref(false);

if (route.params.slug[0] == 'transform' && route.params.slug[1] == 'preview' && viewData.bundle) {
  isPreview.value = true;
}

// redirect
if (redirectUrl.value) {
  await navigateTo(redirectUrl.value);
}

const pageBlockHeaderData = viewData?.field_header;

// // Dynamically import components
const renderLayoutBlock = (viewName: string) => {
  return defineAsyncComponent(() =>
    import(`@/components/views/${viewName}View.vue`).catch((err) => {
      console.error('View not implemented', err);
    }),
  );
};

const openGraph = computed(() => viewData?.field_meta_tags?.html_head ?? {});
const seo = computed(() => openGraph.value || {});

const canonicalUrl = computed(() => {
  return seoCanonicalUrlHandler(
    openGraph?.value?.canonical_url?.attributes?.href ?? '',
    viewData?.is_frontpage,
  );
});

useHead({
  htmlAttrs: {
    lang: 'da',
  },

  title: seo.value?.title?.attributes?.content ?? '',
  meta: [
    {
      name: 'description',
      content: seo.value?.og_description?.attributes?.content ?? '',
    },
    {
      name: 'robots',
      content: seo.value?.robots?.attributes?.content ?? '',
    },
    {
      name: 'abstract',
      content: seo.value?.abstract?.attributes?.content ?? '',
    },
    {
      name: 'keywords',
      content: seo.value?.keywords?.attributes?.content ?? '',
    },
    {
      property: 'og:description',
      content: seo.value?.og_description?.attributes?.content ?? '',
    },
    {
      property: 'og:image',
      content: seo.value?.og_image_0?.attributes?.content ?? '',
    },
    {
      property: 'og:site_name',
      content: seo.value?.og_site_name?.attributes?.content ?? '',
    },
    {
      property: 'og:title',
      content: seo.value?.og_title?.attributes?.content ?? '',
    },
    {
      property: 'og:url',
      content:
        useGetCurrentDomain() +
        removeBEdomain(seo.value?.og_url?.attributes?.content ?? ''),
    },
    {
      property: 'og:type',
      content: seo.value?.og_type?.attributes?.content ?? '',
    },
    {
      property: 'og:determiner',
      content: seo.value?.og_determiner?.attributes?.content ?? '',
    },
    {
      property: 'article:author',
      content: seo.value?.article_author_0?.attributes?.content ?? '',
    },
    {
      property: 'article:expiration_time',
      content:
        seo.value?.article_expiration_time?.attributes?.content ?? '',
    },
    {
      property: 'article:modified_time',
      content:
        seo.value?.article_modified_time?.attributes?.content ?? '',
    },
    {
      property: 'article:published_time',
      content:
        seo.value?.article_published_time?.attributes?.content ?? '',
    },
    {
      property: 'article:publisher',
      content: seo.value?.article_publisher?.attributes?.content ?? '',
    },
    {
      property: 'article:section',
      content: seo.value?.article_section?.attributes?.content ?? '',
    },
    {
      property: 'article:tag',
      content: seo.value?.article_tag_0?.attributes?.content ?? '',
    },
    {
      property: 'book:author',
      content: seo.value?.book_author_0?.attributes?.content ?? '',
    },
    {
      property: 'book:isbn',
      content: seo.value?.book_isbn?.attributes?.content ?? '',
    },
    {
      property: 'book:release_date',
      content: seo.value?.book_release_date?.attributes?.content ?? '',
    },
    {
      property: 'book:tag',
      content: seo.value?.book_tag_0?.attributes?.content ?? '',
    },
    {
      property: 'og:audio',
      content: seo.value?.og_audio?.attributes?.content ?? '',
    },
    {
      property: 'og:audio:secure_url',
      content: seo.value?.og_audio_secure_url?.attributes?.content ?? '',
    },
    {
      property: 'og:audio:type',
      content: seo.value?.og_audio_type?.attributes?.content ?? '',
    },
    {
      property: 'og:country-name',
      content: seo.value?.og_country_name?.attributes?.content ?? '',
    },
    {
      property: 'og:email',
      content: seo.value?.og_email?.attributes?.content ?? '',
    },
    {
      property: 'og:fax_number',
      content: seo.value?.og_fax_number?.attributes?.content ?? '',
    },
    {
      property: 'og:image:alt',
      content: seo.value?.og_image_alt?.attributes?.content ?? '',
    },
    {
      property: 'og:image:height',
      content: seo.value?.og_image_height?.attributes?.content ?? '',
    },
    {
      property: 'og:image:secure_url',
      content:
        seo.value?.og_image_secure_url_0?.attributes?.content ?? '',
    },
    {
      property: 'og:image:type',
      content: seo.value?.og_image_type?.attributes?.content ?? '',
    },
    {
      property: 'og:image:url',
      content: seo.value?.og_image_url_0?.attributes?.content ?? '',
    },
    {
      property: 'og:image:width',
      content: seo.value?.og_image_width?.attributes?.content ?? '',
    },
    {
      property: 'og:latitude',
      content: seo.value?.og_latitude?.attributes?.content ?? '',
    },
    {
      property: 'og:locale',
      content: seo.value?.og_locale?.attributes?.content ?? '',
    },
    {
      property: 'og:locale:alternative',
      content:
        seo.value?.og_locale_alternative_0?.attributes?.content ?? '',
    },
    {
      property: 'og:locality',
      content: seo.value?.og_locality?.attributes?.content ?? '',
    },
    {
      property: 'og:longitude',
      content: seo.value?.og_longitude?.attributes?.content ?? '',
    },
    {
      property: 'og:phone_number',
      content: seo.value?.og_phone_number?.attributes?.content ?? '',
    },
    {
      property: 'og:postal_code',
      content: seo.value?.og_postal_code?.attributes?.content ?? '',
    },
    {
      property: 'og:region',
      content: seo.value?.og_region?.attributes?.content ?? '',
    },
    {
      property: 'og:see_also',
      content: seo.value?.og_see_also?.attributes?.content ?? '',
    },
    {
      property: 'og:street_address',
      content: seo.value?.og_street_address?.attributes?.content ?? '',
    },
    {
      property: 'og:updated_time',
      content: seo.value?.og_updated_time?.attributes?.content ?? '',
    },
    {
      property: 'og:video',
      content: seo.value?.og_video_0?.attributes?.content ?? '',
    },
    {
      property: 'og:video:duration',
      content: seo.value?.og_video_duration?.attributes?.content ?? '',
    },
    {
      property: 'og:video:height',
      content: seo.value?.og_video_height?.attributes?.content ?? '',
    },
    {
      property: 'og:video:secure_url',
      content: seo.value?.og_video_secure_url?.attributes?.content ?? '',
    },
    {
      property: 'og:video:type',
      content: seo.value?.og_video_type?.attributes?.content ?? '',
    },
    {
      property: 'og:video:width',
      content: seo.value?.og_video_width?.attributes?.content ?? '',
    },
    {
      property: 'profile:first_name',
      content: seo.value?.profile_first_name?.attributes?.content ?? '',
    },
    {
      property: 'profile:gender',
      content: seo.value?.profile_gender?.attributes?.content ?? '',
    },
    {
      property: 'profile:last_name',
      content: seo.value?.profile_last_name?.attributes?.content ?? '',
    },
    {
      property: 'profile:username',
      content: seo.value?.profile_username?.attributes?.content ?? '',
    },
    {
      property: 'video:actor',
      content: seo.value?.video_actor_0?.attributes?.content ?? '',
    },
    {
      property: 'video:actor:role',
      content: seo.value?.video_actor_role_0?.attributes?.content ?? '',
    },
    {
      property: 'video:director',
      content: seo.value?.video_director_0?.attributes?.content ?? '',
    },
    {
      property: 'video:release_date',
      content: seo.value?.video_release_date?.attributes?.content ?? '',
    },
    {
      property: 'video:series',
      content: seo.value?.video_series?.attributes?.content ?? '',
    },
    {
      property: 'video:tag',
      content: seo.value?.video_tag_0?.attributes?.content ?? '',
    },
    {
      property: 'video:writer',
      content: seo.value?.video_writer_0?.attributes?.content ?? '',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
    {
      rel: 'image_src',
      href: seo.value?.image_src?.attributes?.href ?? '',
    },
  ],
});
</script>

<template>
  <div>
    <main>
      <PreviewRibbon v-if="isPreview"></PreviewRibbon>
      <component
        :is="renderLayoutBlock(viewData.bundle)"
        v-if="viewData"
        :data="viewData"
        :page-header="pageBlockHeaderData"
      />
    </main>
  </div>
</template>
