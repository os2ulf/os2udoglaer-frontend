<script setup>
const props = defineProps({
  places: Array,
});
</script>

<template>
  <div class="places-to-visit">
    <ul>
      <li
        v-for="place in props.places"
        :key="place.id"
        class="places-to-visit__place"
      >
        <NuxtLink aria-label="Link til besøgssted" :to="place.link">{{
          place.label
        }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.places-to-visit {
  ul {
    list-style-type: none;
    padding: 12px 0 0 0;
    margin: 0;
  }

  &__place {
    margin-bottom: 5px;

    a {
      color: var(--color-primary);
      border-bottom: 1px solid var(--color-primary);
      opacity: 1;
      transition: opacity 0.3s;

      &:hover {
        opacity: 0.8;
        text-decoration: none !important;
      }
    }
  }
}
</style>
