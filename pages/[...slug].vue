<script lang="ts" setup>
const { useContent } = useContentApi();

definePageMeta({
  layout: "default",
});

const router = useRouter();
const route = useRoute();
// const config = useRuntimeConfig().public;
const encodedPath = encodeURIComponent(route.path);

// // fetching page data
let error: any = null;
let redirectUrl = ref(null);

const { data } = await useAsyncData(encodedPath, () =>
  useContent(route.path)
    .then((res) => {
      if (res.type === "redirect") {
        redirectUrl.value = res.target;
      }

      return res;
    })
    .catch((err) => {
      error = err;
    })
);

if (error || !data.value) {
  if (!error || !error.statusCode) {
    navigateTo("/maintenance");
  }
  // if BE is down
  if (error.statusCode.toString().startsWith("5")) {
    navigateTo("/maintenance");
  }

  // if forbidden to see
  if (error.statusCode === 403) {
    navigateTo("/forbidden");
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
// SEO/META
const seoHeadLinkDataEN = ref(
  viewData?.field_meta_tags?.html_head?.alternate_en?.attributes
);
const seoHeadLinkDataDA = ref(
  viewData?.field_meta_tags?.html_head?.alternate_da?.attributes
);

// // Dynamically import components
const renderLayoutBlock = (viewName: string) => {
  return defineAsyncComponent(() =>
    import(`@/components/views/${viewName}View.vue`).catch((err) => {
      console.error("View not implemented", err);
    })
  );
};

useHead({
  title:
    viewData?.field_meta_tags?.html_head?.title?.attributes?.content ||
    viewData?.label ||
    "Page title",
  meta: [
    {
      name: "description",
      content:
        viewData?.field_meta_tags?.html_head?.description?.attributes
          ?.content || "Description",
    },
  ],
});

useHead({
  htmlAttrs: {
    lang: viewData?.langcode || "da",
  },
  title:
    viewData?.field_meta_tags?.html_head?.title?.attributes?.content ||
    viewData?.label ||
    "Title",
  meta: [
    {
      name: "description",
      content:
        viewData?.field_meta_tags?.html_head?.description?.attributes
          ?.content || "Description",
    },
    {
      name: "robots",
      content: "index, nofollow",
    },
  ],
  link: [
    {
      rel: seoHeadLinkDataEN?.value?.rel,
      href: seoHeadLinkDataEN?.value?.href,
      hreflang: seoHeadLinkDataEN?.value?.hreflang,
    },
    {
      rel: seoHeadLinkDataDA?.value?.rel,
      href: seoHeadLinkDataDA?.value?.href,
      hreflang: seoHeadLinkDataDA?.value?.hreflang,
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
