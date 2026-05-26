<script setup lang="ts">
const { hasPrimaryButtonColors } = useButtonColors()
const props = defineProps({
  data: {
    type: Array,
    required: false,
    default: null,
  },
  type: {
    type: String,
    required: false,
    default: '',
  },
});
</script>

<template>
  <div class="contact">
    <h3 class="contact__title">Kontakt {{ props.type }}</h3>
    <div class="contact__item-container">
      <div
        class="contact__item-section"
        v-for="person in props.data"
        :key="person"
      >
        <div class="contact__heading-wrapper">
          <div class="contact__person-heading">
            <h4 v-if="person?.field_title || person?.field_name">
              {{ person?.field_title ? person?.field_title + ' - ' : '' }}
              {{ person?.field_name }}
            </h4>
            <div
              class="contact__contact-hours"
              v-if="person?.field_office_availability_text"
            >
              Træffetid:
              {{ person?.field_office_availability_text }}
            </div>
          </div>

          <div class="contact__button-wrapper">
            <a
              v-if="person?.field_email"
              :href="'mailto:' + person?.field_email"
              class="button button--primary contact__button"
              :class="{'button--course' : hasPrimaryButtonColors}"
            >
              <NuxtIcon class="contact__icon" name="envelope-alt" filled />
              {{ person?.field_email }}
            </a>
            <a
              v-if="person?.field_phone"
              :href="'tel:' + person?.field_phone"
              class="button button--primary contact__button"
              :class="{'button--course' : hasPrimaryButtonColors}"
            >
              <NuxtIcon class="contact__icon" name="phone" filled />
              {{ person?.field_phone }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.contact {
  color: var(--color-text);
  background-color: var(--color-gray-20);
  padding: 20px 20px;
  box-shadow: 0px 4px 10px 15px #40362e1a;

  @media (min-width: 768px) {
    padding: 96px 168px;
  }

  &__title {
    margin-bottom: 32px;
    text-align: center;
    word-break: break-word;

    @media (min-width: 768px) {
      text-align: left;
    }
  }

  &__item-section {
    padding: 27px 0;
    border-top: 1px solid var(--color-base-divider);

    @media (min-width: 768px) {
      padding: 58px 0;
    }
  }

  &__heading-wrapper {
    display: grid;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 991px) {
      justify-content: center;
    }

    @media (min-width: 992px) {
      display: flex;
    }
  }

  &__person-heading {
    padding-right: 0;

    @media (min-width: 992px) {
      padding-right: 20px;
    }

    @media (max-width: 991px) {
      text-align: center;
    }
  }

  &__button-wrapper {
    display: flex;
    flex-direction: column;

    @media (max-width: 991px) {
      justify-content: center;
    }

    @media (min-width: 1200px) {
      flex-direction: row;
    }
  }

  &__button {
    margin: 10px 0;
    width: 100%;
    word-break: auto-phrase;
    white-space: nowrap;

    @media (min-width: 768px) {
      width: inherit;
    }

    @media (max-width: 1399px) {
      margin: 0 16px 0 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  &__icon {
    margin-right: 10px;

    :deep(svg) {
      height: 24px;
      width: 24px;
    }
  }

  &__contact-hours {
    font-weight: 400;

    @media (max-width: 991px) {
      text-align: center;
    }
  }
}
</style>
