<script setup lang="ts">
defineProps({
  error: { type: Object, required: true },
});

useHead({
  title: 'Der skete desværre en fejl',
  meta: [
    {
      name: 'description',
      content: 'Vi kunne desværre ikke finde den side, du ledte efter.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});
</script>

<template>
  <div id="app">
    <TheHeaderParent />
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-12 col-sm-12">
          <h1>Page Not Found</h1>
          <p>We're sorry, we couldn't find the page you requested.</p>
          {{ error }}
        </div>
      </div>
    </div>
    <TheFooterParent />
  </div>
</template>

<style lang="postcss">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
