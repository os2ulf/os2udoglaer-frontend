<script setup>
definePageMeta({
  layout: 'blank',
});

useHead({
  title: 'Maintenance',
  meta: [
    {
      name: 'description',
      content:
        'Vi beklager, vi udfører i øjeblikket vedligeholdelse. Kom venligst tilbage senere.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

// Attempt to redirect to homepage every 90s
setTimeout(() => {
  window.location.href = '/';
}, 90000);
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="maintenance__wrapper">
          <h1 class="maintenance__heading">Maintenance in Progress</h1>
          <p class="maintenance__subtext">
            Vi beklager, vi udfører i øjeblikket vedligeholdelse. Kom venligst
            tilbage senere.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.maintenance {
  color: var(--theme-color);

  &__wrapper {
    margin-top: 20px;
  }

  &__heading {
    min-height: 55px @(--sm) 144px;
    font-size: 48px @(--sm) 128px;
    font-weight: 200;
    font-family: var(--heading-font-family);
    text-align: center;
  }

  &__subtext {
    margin-top: 40px @(--sm) 50px;
    font-size: 21px @(--sm) 32px;
    font-weight: 200;
    font-family: var(--heading-font-family);
    padding-bottom: 20px;
    text-align: center;
  }
}
</style>
