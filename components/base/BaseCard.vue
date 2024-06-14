<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

console.log('card item', props.data);
</script>
<template>
  <NuxtLink class="card__link" to="/" aria-label="Link til kort">
    <div class="card">
      <div class="card__image" v-if="data?.field_image">
        <!-- TODO: use base img once img styles are done and prolly tweak condition above-->
        <img :src="data?.field_image?.src" :alt="data?.field_image?.alt" />
        <div v-if="data?.field_target_group" class="card__target-group">
          {{ data?.field_target_group }}
        </div>
      </div>
      <div class="card__content">
        <div v-if="data?.label" class="card__title">
          <h4>{{ data?.label }}</h4>
        </div>
        <div v-if="data?.body" class="card__text" v-html="data?.body"></div>
        <div class="card__icons">
          <div class="card__icon">
            <NuxtIcon name="home-alt" filled />
            Udbyder
          </div>
          <div class="card__icon">
            <NuxtIcon name="user" filled />
            Målgruppe
          </div>
          <div class="card__icon">
            <NuxtIcon name="info" filled />

            Fag/læreplanstema
          </div>
        </div>
        <div class="card__footer">
          <BaseLabel class="label--green">Tematikker</BaseLabel>
          <BaseLabel class="label--yellow">gratis</BaseLabel>
          <BaseLabel class="label--light-yellow">Øvrige</BaseLabel>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.card {
  display: flex;
  color: var(--color-text);
  border: 2px solid var(--color-primary-lighten-4);
  border-radius: 4px;
  height: 100%;
  transition: all 0.3s ease-in-out;

  /* TODO: USE rgb w. opacity */
  box-shadow: 0px 4px 10px 7px #297f781a;

  &:hover {
    box-shadow: 0 4px 10px 10px #297f781a;

    img {
      opacity: 0.8;
    }
  }

  &__link {
    text-decoration: none;
  }

  &__image {
    width: 50%;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
      border-radius: 4px 0 0 4px;
    }
  }

  &__target-group {
    position: absolute;
    bottom: 0;
    right: 0;
    color: var(--color-white);
    background-color: var(--color-primary);
    padding: 7px 0;
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 0 0 0 4px;
  }

  &__content {
    display: grid;
    width: 50%;
    padding: 32px;
  }

  &__title {
    margin-bottom: 16px;
  }

  &__text {
    :deep(p) {
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__icon {
    padding-top: 8px;
  }

  &__footer {
    display: flex;
    gap: 4px;
    align-items: end;
    padding-top: 24px;
    flex-wrap: wrap;
  }
}
</style>
