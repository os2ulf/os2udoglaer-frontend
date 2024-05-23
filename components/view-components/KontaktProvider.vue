<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: null,
  },
});

console.log('data kontakt block', props.data);
</script>

<template>
  <div class="contact">
    <h3 class="contact__title">Kontakt udbyder</h3>
    <div class="contact__item-container">
      <BaseDivider />
      <div class="contact__item-section">
        <h4>
          {{ props.data?.field_contact_title }} -
          {{ data.field_contact_name }}
        </h4>

        <div class="contact__button-wrapper">
          <a
            :href="'mailto:' + data.field_contact_email"
            class="button button--primary contact__button"
          >
            <NuxtIcon class="contact__icon" name="envelope-alt" filled />
            {{ data.field_contact_email }}
          </a>
          <a
            :href="'tel:' + data.field_contact_phone"
            class="button button--primary contact__button"
          >
            <NuxtIcon class="contact__icon" name="phone" filled />
            {{ data.field_contact_phone }}
          </a>
          <NuxtLink
            :to="data.field_contact_homepage"
            class="button button--primary contact__button"
          >
            {{ data.field_contact_homepage }}
          </NuxtLink>
        </div>
      </div>
      <BaseDivider />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.contact {
  background-color: var(--color-tertiary-lighten-5);
  padding: 96px 168px;
  color: var(--color-tertiary);
  box-shadow: 0px 4px 10px 15px #40362e1a;

  &__title {
    margin-bottom: 32px;
  }

  &__item-section {
    padding: 58px 0;
    display: grid @(--md) flex;
    align-items: center;
    justify-content: space-between;
  }

  &__button-wrapper {
    display: grid @(--md) flex;
  }

  &__button {
    margin: 20px @(--md) 0 16px 0 0;

    &:last-child {
      margin-right: 0;
    }
  }

  &__icon {
    margin-right: 10px;
  }
}
</style>
