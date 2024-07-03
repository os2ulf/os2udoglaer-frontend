<script lang="ts" setup>
const { useContent } = useContentApi();

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

useHead({
  htmlAttrs: {
    lang: 'da',
  },
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
