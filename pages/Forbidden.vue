<script setup>
definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Forbidden',
  meta: [
    {
      name: 'description',
      content: 'Du har ikke tilladelse til at tilgå denne side.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="forbidden__wrapper">
          <h1 class="forbidden__heading">Forbidden</h1>
          <p class="forbidden__subtext">
            Du har ikke tilladelse til at få adgang til denne side.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.forbidden {
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
