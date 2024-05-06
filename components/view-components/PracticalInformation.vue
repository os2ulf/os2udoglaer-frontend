<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const showLocationDetails = ref(false);
const showPriceDetails = ref(false);
const showPeriodDetails = ref(false);
const showDurationDetails = ref(false);
const showFacilitiesDetails = ref(false);
const showSDGDetails = ref(false);
const showPriceSpecialDetails = ref(false);
const showQuantityDetails = ref(false);
const toggleAccordionContent = (contentType: string) => {
  if (contentType === 'location') {
    showLocationDetails.value = !showLocationDetails.value;
  } else if (contentType === 'price') {
    showPriceDetails.value = !showPriceDetails.value;
  } else if (contentType === 'period') {
    showPeriodDetails.value = !showPeriodDetails.value;
  } else if (contentType === 'duration') {
    showDurationDetails.value = !showDurationDetails.value;
  } else if (contentType === 'facilities') {
    showFacilitiesDetails.value = !showFacilitiesDetails.value;
  } else if (contentType === 'sdg') {
    showSDGDetails.value = !showSDGDetails.value;
  } else if (contentType === 'price-description') {
    showPriceSpecialDetails.value = !showPriceSpecialDetails.value;
  } else if (contentType === 'quantity-description') {
    showQuantityDetails.value = !showQuantityDetails.value;
  }
};
</script>

<template>
  <div class="practical-information">
    <h3 class="practical-information__title">Praktisk information</h3>
    <BaseDivider class="practical-information__divider" />

    <div class="practical-information__section-container">
      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Udbyder</span>

        <NuxtLink class="practical-information__item-value" to="#"
          ><span class="practical-information__item-value--link">
            {{ data?.field_author }}
          </span></NuxtLink
        >
      </div>
    </div>

    <div
      class="practical-information__section-container"
      v-if="
        data.field_location_description ||
        data.field_location_name ||
        data.field_location_street ||
        data.field_location_zipcode ||
        data.field_location_city
      "
    >
      <BaseDivider class="practical-information__divider" />
      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Sted</span>
        <span
          class="practical-information__item-value"
          v-if="data?.field_location_description"
          v-html="data?.field_location_description"
        >
        </span>
      </div>

      <div
        class="practical-information__accordion-container"
        v-show="
          data?.field_location_name ||
          data?.field_location_street ||
          data?.field_location_zipcode ||
          data?.field_location_city
        "
      >
        <button
          class="practical-information__accordion-container--cta"
          @click="toggleAccordionContent('location')"
        >
          <p class="practical-information__see-more-cta">
            {{ !showLocationDetails ? ' Se flere detaljer' : 'Skjul detaljer' }}
          </p>
          <NuxtIcon
            class="practical-information__accordion-icon"
            :name="!showLocationDetails ? 'plus' : 'minus'"
          />
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="practical-information__accordion-content"
          v-if="showLocationDetails"
        >
          <span
            >{{ data?.field_location_name }}
            {{ data?.field_location_street }}
            {{ data?.field_location_zipcode }}
            {{ data?.field_location_city }}
          </span>
        </div>
      </Transition>
      <BaseDivider class="practical-information__divider" />
    </div>

    <div class="practical-information__section-container">
      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Forløbstype</span>
        <div class="practical-information__item-value">
          <span class="practical-information__item-value">
            <div v-for="courseType in data.field_course_type" :key="courseType">
              {{ courseType }}
            </div>
          </span>
        </div>
      </div>
      <div
        class="practical-information__item-container"
        v-if="
          data.field_target_group &&
          (data.field_curriculum_themes.length > 0 ||
            data.field_trgt_grp_daycare.length > 0 ||
            data.field_trgt_grp_primary_school.length > 0 ||
            data.field_trgt_grp_youth_education.length > 0)
        "
      >
        <span class="practical-information__item-heading">Målgruppe</span>
        <div class="practical-information__item-value">
          <span class="practical-information__item-value">
            <div v-if="data.field_target_group == 'Dagtilbud'">
              <div
                v-for="curriculumSubject in data.field_curriculum_themes"
                :key="curriculumSubject"
              >
                {{ curriculumSubject }}
              </div>
              <div
                v-for="daycare in data.field_trgt_grp_daycare"
                :key="daycare"
              >
                {{ daycare }}
              </div>
            </div>
            <div
              v-else-if="
                data.field_target_group === 'Grundskole' &&
                data?.field_trgt_grp_primary_school.length > 0
              "
            >
              <div
                v-for="schoolClass in data.field_trgt_grp_primary_school"
                :key="schoolClass"
              >
                {{ schoolClass }}
              </div>
            </div>
            <div
              v-else-if="
                data.field_target_group === 'Ungdomsuddannelse' &&
                data?.field_trgt_grp_youth_education.length > 0
              "
            >
              <div
                v-for="schoolEduSubject in data.field_trgt_grp_youth_education"
                :key="schoolEduSubject"
              >
                {{ schoolEduSubject }}
              </div>
            </div>
          </span>
        </div>
      </div>
      <BaseDivider class="practical-information__divider" />
    </div>

    <div class="practical-information__section-container">
      <div
        class="practical-information__item-container"
        v-if="
          data?.field_is_free ||
          data?.field_price.length > 1 ||
          data?.field_description_of_price ||
          data?.field_price[0].field_price ||
          data?.field_price[0].field_price_settlement_unit ||
          data?.field_price[0].field_price_vat
        "
      >
        <span class="practical-information__item-heading">Pris</span>
        <div class="practical-information__item-value">
          <span class="practical-information__item-value">
            <span class="practical-information__tag" v-if="data?.field_is_free"
              ><BaseTag
                v-if="data?.field_is_free"
                :data="{ label: 'Gratis' }"
                color="secondary"
            /></span>
            <div v-else-if="data?.field_price && !data?.field_is_free">
              <div
                class="practical-information__prices"
                v-for="price in data.field_price"
                :key="price"
              >
                {{ price?.field_price }}
                {{ price?.field_price_settlement_unit?.label }}
                {{ price?.field_price_vat?.label }}
              </div>
            </div>
          </span>
        </div>
      </div>

      <div
        class="practical-information__accordion-container practical-information__accordion-container--mid-section"
        v-show="data?.field_description_of_price"
      >
        <button
          class="practical-information__accordion-container--cta"
          @click="toggleAccordionContent('price-description')"
        >
          <p class="practical-information__see-more-cta">
            {{
              !showPriceSpecialDetails ? ' Se flere detaljer' : 'Skjul detaljer'
            }}
          </p>
          <NuxtIcon
            class="practical-information__accordion-icon"
            :name="!showPriceSpecialDetails ? 'plus' : 'minus'"
          />
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="practical-information__accordion-content"
          v-if="showPriceSpecialDetails"
        >
          <span v-html="data?.field_description_of_price"> </span>
          <BaseDivider class="practical-information__divider" />
        </div>
      </Transition>

      <div
        class="practical-information__item-container"
        v-if="data?.field_quantity || data?.field_quantity_description"
      >
        <span class="practical-information__item-heading">Antal</span>
        <div class="practical-information__item-value">
          <span class="practical-information__item-value">
            {{ data?.field_quantity }}
          </span>
        </div>
      </div>

      <div
        class="practical-information__accordion-container practical-information__accordion-container--mid-section"
        v-show="data?.field_quantity_description"
      >
        <button
          class="practical-information__accordion-container--cta"
          @click="toggleAccordionContent('quantity-description')"
        >
          <p class="practical-information__see-more-cta">
            {{ !showQuantityDetails ? ' Se flere detaljer' : 'Skjul detaljer' }}
          </p>
          <NuxtIcon
            class="practical-information__accordion-icon"
            :name="!showQuantityDetails ? 'plus' : 'minus'"
          />
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="practical-information__accordion-content"
          v-if="showQuantityDetails"
        >
          <span v-html="data?.field_quantity_description"> </span>
          <BaseDivider class="practical-information__divider" />
        </div>
      </Transition>

      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Periode</span>
        <div class="practical-information__item-value">
          <span class="practical-information__item-value">
            {{
              data?.field_all_year
                ? 'Hele året'
                : data?.field_period?.start_date +
                  ' - ' +
                  data?.field_period?.end_date
            }}
          </span>
        </div>
      </div>

      <div
        class="practical-information__accordion-container"
        v-show="data?.field_description_of_period"
      >
        <button
          class="practical-information__accordion-container--cta"
          @click="toggleAccordionContent('period')"
        >
          <p class="practical-information__see-more-cta">
            {{ !showPeriodDetails ? ' Se flere detaljer' : 'Skjul detaljer' }}
          </p>
          <NuxtIcon
            class="practical-information__accordion-icon"
            :name="!showPeriodDetails ? 'plus' : 'minus'"
          />
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="practical-information__accordion-content"
          v-if="showPeriodDetails"
        >
          <span v-html="data?.field_description_of_period"> </span>
        </div>
      </Transition>

      <BaseDivider
        class="practical-information__divider"
        v-if="
          data?.field_duration ||
          data?.field_duration_unit ||
          data?.field_description_of_duration
        "
      />
      <div
        class="practical-information__item-container"
        v-if="
          data?.field_duration ||
          data?.field_duration_unit ||
          data?.field_description_of_duration
        "
      >
        <span class="practical-information__item-heading">Varighed</span>
        <div class="practical-information__item-value">
          <span class="practical-information__item-value">
            {{ data?.field_duration }} {{ data?.field_duration_unit }}
          </span>
        </div>
      </div>

      <div
        class="practical-information__accordion-container"
        v-show="data?.field_description_of_duration"
      >
        <button
          class="practical-information__accordion-container--cta"
          @click="toggleAccordionContent('duration')"
        >
          <p class="practical-information__see-more-cta">
            {{ !showDurationDetails ? ' Se flere detaljer' : 'Skjul detaljer' }}
          </p>
          <NuxtIcon
            class="practical-information__accordion-icon"
            :name="!showDurationDetails ? 'plus' : 'minus'"
          />
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="practical-information__accordion-content"
          v-if="showDurationDetails"
        >
          <span v-html="data?.field_description_of_duration"></span>
        </div>
      </Transition>

      <BaseDivider class="practical-information__divider" />
    </div>

    <div class="practical-information__section-container">
      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Emneområde</span>
        <div class="practical-information__item-value">
          <span class="practical-information__item-value">
            <div v-for="subject in data.field_subject" :key="subject">
              {{ subject }}
            </div>
          </span>
        </div>
      </div>
      <BaseDivider
        class="practical-information__divider"
        v-if="
          data.field_target_group === 'Grundskole' &&
          data?.field_primary_school_subject.length > 0
        "
      />
    </div>

    <div
      class="practical-information__section-container"
      v-if="
        (data.field_target_group === 'Grundskole' &&
          data?.field_primary_school_subject.length > 0) ||
        (data.field_target_group === 'Ungdomsuddannelse' &&
          data?.field_youth_education_subject.length > 0)
      "
    >
      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Fag</span>
        <div
          class="practical-information__item-value"
          v-if="
            data.field_target_group === 'Grundskole' &&
            data?.field_primary_school_subject.length > 0
          "
        >
          <span class="practical-information__item-value">
            <div
              v-for="schoolSubject in data.field_primary_school_subject"
              :key="schoolSubject"
            >
              {{ schoolSubject }}
            </div>
          </span>
        </div>

        <div
          class="practical-information__item-value"
          v-else-if="
            data.field_target_group === 'Ungdomsuddannelse' &&
            data?.field_youth_education_subject.length > 0
          "
        >
          <span class="practical-information__item-value">
            <div
              v-for="schoolYouthSubject in data.field_youth_education_subject"
              :key="schoolYouthSubject"
            >
              {{ schoolYouthSubject }}
            </div>
          </span>
        </div>
      </div>
      <BaseDivider class="practical-information__divider" />
    </div>

    <div
      class="practical-information__section-container"
      v-if="
        data?.field_faciliteter.length > 0 || data?.field_facilities_description
      "
    >
      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Faciliteter</span>
      </div>
      <div v-for="facility in data.field_faciliteter" :key="facility">
        {{ facility }}
      </div>

      <div
        class="practical-information__accordion-container"
        v-show="data?.field_facilities_description"
      >
        <button
          class="practical-information__accordion-container--cta"
          @click="toggleAccordionContent('facilities')"
        >
          <p class="practical-information__see-more-cta">
            {{
              !showFacilitiesDetails ? ' Se flere detaljer' : 'Skjul detaljer'
            }}
          </p>
          <NuxtIcon
            class="practical-information__accordion-icon"
            :name="!showFacilitiesDetails ? 'plus' : 'minus'"
          />
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="practical-information__accordion-content"
          v-if="showFacilitiesDetails"
        >
          <span v-html="data?.field_facilities_description"></span>
        </div>
      </Transition>

      <BaseDivider class="practical-information__divider" />
    </div>

    <div
      class="practical-information__section-container"
      v-if="
        data?.field_sustainability_goals_desc ||
        data?.field_sustainability_goals.length > 0
      "
    >
      <div class="practical-information__item-container">
        <span class="practical-information__item-heading">Verdensmål</span>
      </div>
      <div class="practical-information__sdg-wrapper">
        <div
          class="practical-information__sdgs"
          v-for="goals in data.field_sustainability_goals"
          :key="goals"
        >
          <NuxtLink :to="goals?.field_link?.url" target="_blank">
            <img :src="goals?.field_logo?.src" alt="SDG" />
          </NuxtLink>
        </div>
      </div>

      <div
        class="practical-information__accordion-container"
        v-show="data?.field_sustainability_goals_desc"
      >
        <button
          class="practical-information__accordion-container--cta"
          @click="toggleAccordionContent('sdg')"
        >
          <p class="practical-information__see-more-cta">
            {{ !showSDGDetails ? ' Se flere detaljer' : 'Skjul detaljer' }}
          </p>
          <NuxtIcon
            class="practical-information__accordion-icon"
            :name="!showSDGDetails ? 'plus' : 'minus'"
          />
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div
          class="practical-information__accordion-content"
          v-if="showSDGDetails"
        >
          <span v-html="data?.field_sustainability_goals_desc"></span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.practical-information {
  padding: 48px 32px;
  background-color: var(--color-white);
  /* TODO: use a var for this color accent? */
  box-shadow: 0px 5px 10px 4px #297f781a;
  border: 1px solid #cce0df;
  color: #40362e;

  &__title {
    margin: 0;
  }

  &__divider {
    margin: 22px 0 14px 0;
    /* TODO: use var */
    color: #d1cfcd;
  }

  &__item-heading {
    width: 50%;
  }

  &__item-container {
    padding-top: 8px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
  }

  &__item-value {
    font-weight: 400;
    text-decoration: none;
    line-height: 24px;
    width: 50%;

    &--link {
      /* TODO: use var */
      color: var(--color-primary);
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease-in-out;

      &:hover {
        opacity: 0.8;
        /* TODO: use var */
        border-bottom: 1px solid var(--color-primary);
      }
    }
  }

  &__accordion-container {
    padding-top: 15px;

    &--mid-section {
      padding-top: 15px;
      margin-bottom: 15px;
    }

    &--cta {
      width: 100%;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      margin: 0;
      justify-content: space-between;
    }

    p {
      margin: 0;
    }
  }

  &__accordion-icon {
    color: var(--color-primary);
  }

  &__accordion-content {
    padding-top: 16px;
    font-size: 16px;
  }

  &__prices {
    &:not(:first-child) {
      padding-top: 8px;
    }
  }

  &__sdg-wrapper {
    padding-top: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: left @(--md) space-between;
  }
  &__sdgs {
    width: 90px;
    height: 90px;
    margin-bottom: 12px;
    margin-right: 24px @(--md) 0;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
