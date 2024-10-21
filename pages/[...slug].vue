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

const openGraph = ref(viewData?.field_meta_tags?.html_head);

useHead({
  htmlAttrs: {
    lang: 'da',
  },

  title: openGraph?.value?.title?.attributes?.content ?? '',
  meta: [
    {
      name: 'description',
      content: openGraph?.value?.og_description?.attributes?.content ?? '',
    },
    {
      name: 'robots',
      content: openGraph?.value?.robots?.attributes?.content ?? '',
    },
    {
      name: 'abstract',
      content: openGraph?.value?.abstract?.attributes?.content ?? '',
    },
    {
      name: 'keywords',
      content: openGraph?.value?.keywords?.attributes?.content ?? '',
    },
    {
      property: 'og:description',
      content: openGraph?.value?.og_description?.attributes?.content ?? '',
    },
    {
      property: 'og:image',
      content: openGraph?.value?.og_image_0?.attributes?.content ?? '',
    },
    {
      property: 'og:site_name',
      content: openGraph?.value?.og_site_name?.attributes?.content ?? '',
    },
    {
      property: 'og:title',
      content: openGraph?.value?.og_title?.attributes?.content ?? '',
    },
    {
      property: 'og:url',
      content:
        useGetCurrentDomain() +
        removeBEdomain(openGraph?.value?.og_url?.attributes?.content ?? ''),
    },
    {
      property: 'og:type',
      content: openGraph?.value?.og_type?.attributes?.content ?? '',
    },
    {
      property: 'og:determiner',
      content: openGraph?.value?.og_determiner?.attributes?.content ?? '',
    },
    {
      property: 'article:author',
      content: openGraph?.value?.article_author_0?.attributes?.content ?? '',
    },
    {
      property: 'article:expiration_time',
      content:
        openGraph?.value?.article_expiration_time?.attributes?.content ?? '',
    },
    {
      property: 'article:modified_time',
      content:
        openGraph?.value?.article_modified_time?.attributes?.content ?? '',
    },
    {
      property: 'article:published_time',
      content:
        openGraph?.value?.article_published_time?.attributes?.content ?? '',
    },
    {
      property: 'article:publisher',
      content: openGraph?.value?.article_publisher?.attributes?.content ?? '',
    },
    {
      property: 'article:section',
      content: openGraph?.value?.article_section?.attributes?.content ?? '',
    },
    {
      property: 'article:tag',
      content: openGraph?.value?.article_tag_0?.attributes?.content ?? '',
    },
    {
      property: 'book:author',
      content: openGraph?.value?.book_author_0?.attributes?.content ?? '',
    },
    {
      property: 'book:isbn',
      content: openGraph?.value?.book_isbn?.attributes?.content ?? '',
    },
    {
      property: 'book:release_date',
      content: openGraph?.value?.book_release_date?.attributes?.content ?? '',
    },
    {
      property: 'book:tag',
      content: openGraph?.value?.book_tag_0?.attributes?.content ?? '',
    },
    {
      property: 'og:audio',
      content: openGraph?.value?.og_audio?.attributes?.content ?? '',
    },
    {
      property: 'og:audio:secure_url',
      content: openGraph?.value?.og_audio_secure_url?.attributes?.content ?? '',
    },
    {
      property: 'og:audio:type',
      content: openGraph?.value?.og_audio_type?.attributes?.content ?? '',
    },
    {
      property: 'og:country-name',
      content: openGraph?.value?.og_country_name?.attributes?.content ?? '',
    },
    {
      property: 'og:email',
      content: openGraph?.value?.og_email?.attributes?.content ?? '',
    },
    {
      property: 'og:fax_number',
      content: openGraph?.value?.og_fax_number?.attributes?.content ?? '',
    },
    {
      property: 'og:image:alt',
      content: openGraph?.value?.og_image_alt?.attributes?.content ?? '',
    },
    {
      property: 'og:image:height',
      content: openGraph?.value?.og_image_height?.attributes?.content ?? '',
    },
    {
      property: 'og:image:secure_url',
      content:
        openGraph?.value?.og_image_secure_url_0?.attributes?.content ?? '',
    },
    {
      property: 'og:image:type',
      content: openGraph?.value?.og_image_type?.attributes?.content ?? '',
    },
    {
      property: 'og:image:url',
      content: openGraph?.value?.og_image_url_0?.attributes?.content ?? '',
    },
    {
      property: 'og:image:width',
      content: openGraph?.value?.og_image_width?.attributes?.content ?? '',
    },
    {
      property: 'og:latitude',
      content: openGraph?.value?.og_latitude?.attributes?.content ?? '',
    },
    {
      property: 'og:locale',
      content: openGraph?.value?.og_locale?.attributes?.content ?? '',
    },
    {
      property: 'og:locale:alternative',
      content:
        openGraph?.value?.og_locale_alternative_0?.attributes?.content ?? '',
    },
    {
      property: 'og:locality',
      content: openGraph?.value?.og_locality?.attributes?.content ?? '',
    },
    {
      property: 'og:longitude',
      content: openGraph?.value?.og_longitude?.attributes?.content ?? '',
    },
    {
      property: 'og:phone_number',
      content: openGraph?.value?.og_phone_number?.attributes?.content ?? '',
    },
    {
      property: 'og:postal_code',
      content: openGraph?.value?.og_postal_code?.attributes?.content ?? '',
    },
    {
      property: 'og:region',
      content: openGraph?.value?.og_region?.attributes?.content ?? '',
    },
    {
      property: 'og:see_also',
      content: openGraph?.value?.og_see_also?.attributes?.content ?? '',
    },
    {
      property: 'og:street_address',
      content: openGraph?.value?.og_street_address?.attributes?.content ?? '',
    },
    {
      property: 'og:updated_time',
      content: openGraph?.value?.og_updated_time?.attributes?.content ?? '',
    },
    {
      property: 'og:video',
      content: openGraph?.value?.og_video_0?.attributes?.content ?? '',
    },
    {
      property: 'og:video:duration',
      content: openGraph?.value?.og_video_duration?.attributes?.content ?? '',
    },
    {
      property: 'og:video:height',
      content: openGraph?.value?.og_video_height?.attributes?.content ?? '',
    },
    {
      property: 'og:video:secure_url',
      content: openGraph?.value?.og_video_secure_url?.attributes?.content ?? '',
    },
    {
      property: 'og:video:type',
      content: openGraph?.value?.og_video_type?.attributes?.content ?? '',
    },
    {
      property: 'og:video:width',
      content: openGraph?.value?.og_video_width?.attributes?.content ?? '',
    },
    {
      property: 'profile:first_name',
      content: openGraph?.value?.profile_first_name?.attributes?.content ?? '',
    },
    {
      property: 'profile:gender',
      content: openGraph?.value?.profile_gender?.attributes?.content ?? '',
    },
    {
      property: 'profile:last_name',
      content: openGraph?.value?.profile_last_name?.attributes?.content ?? '',
    },
    {
      property: 'profile:username',
      content: openGraph?.value?.profile_username?.attributes?.content ?? '',
    },
    {
      property: 'video:actor',
      content: openGraph?.value?.video_actor_0?.attributes?.content ?? '',
    },
    {
      property: 'video:actor:role',
      content: openGraph?.value?.video_actor_role_0?.attributes?.content ?? '',
    },
    {
      property: 'video:director',
      content: openGraph?.value?.video_director_0?.attributes?.content ?? '',
    },
    {
      property: 'video:release_date',
      content: openGraph?.value?.video_release_date?.attributes?.content ?? '',
    },
    {
      property: 'video:series',
      content: openGraph?.value?.video_series?.attributes?.content ?? '',
    },
    {
      property: 'video:tag',
      content: openGraph?.value?.video_tag_0?.attributes?.content ?? '',
    },
    {
      property: 'video:writer',
      content: openGraph?.value?.video_writer_0?.attributes?.content ?? '',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: seoCanonicalUrlHandler(
        openGraph?.value?.canonical_url?.attributes?.href ?? '',
        viewData?.is_frontpage,
      ),
    },
    {
      rel: 'image_src',
      href: openGraph?.value?.image_src?.attributes?.href ?? '',
    },
  ],
});
</script>

<template>
  <main>
    <component
      :is="renderLayoutBlock(viewData.bundle)"
      v-if="viewData"
      :data="viewData"
      :page-header="pageBlockHeaderData"
    />
  </main>
</template>
