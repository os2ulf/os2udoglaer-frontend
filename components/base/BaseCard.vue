<script setup lang="ts">
import { stripHtmlFromString } from '~/utils/stripHtml';
import { truncateString } from '~/utils/truncateString';

const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

const providerData = ref(
  props.data?.provider || props.data?.corporation || null,
);

// The shit show begins. Since each content type, has diff fields, this is the handler to filter them out
const targetGroupFields = computed(() => {
  // IF NEWS CT
  if (props.data?.bundle === 'news' && props.data.field_audience) {
    if (typeof props.data.field_audience === 'string') {
      return {
        audience: [props.data.field_audience],
      };
    } else {
      return {
        audience: props?.data?.field_audience,
      };
    }
  }

  // IF Internship (Erhvervspraktik) CT
  if (props.data?.bundle === 'internship') {
    return {
      audience: props.data.field_areas_of_interest,
      subjectOrTheme: props.data.field_industry,
    };
  }

  // IF Educators CT
  if (props.data?.bundle === 'course_educators') {
    return {
      audience: props.data.field_educators_target_group,
      subjectOrTheme: props.data.field_curriculum_themes,
    };
  }

  // IF Exercise/Opgave CT
  else if (
    props.data?.bundle === 'exercise' ||
    props.data?.bundle === 'course'
  ) {
    if (props.data?.field_target_group === 'Dagtilbud') {
      return {
        audience: props.data.field_trgt_grp_daycare,
        subjectOrTheme: props.data.field_curriculum_themes,
      };
    } else if (props.data?.field_target_group === 'Grundskole') {
      return {
        audience: props.data.field_trgt_grp_primary_school,
        subjectOrTheme: props.data.field_primary_school_subject,
      };
    } else if (props.data?.field_target_group === 'Ungdomsuddannelse') {
      return {
        audience: props.data.field_trgt_grp_youth_education,
        subjectOrTheme: props.data.field_youth_education_subject,
      };
    }
  } else {
    // console.error('Unknown bundle:', props.data?.bundle);

    return null;
  }
});

const shortenClasses = (items) => {
  if (!items) {
    return null; // Return null if the input array is null or undefined.
  }

  // Initialize an empty array to store the final result.
  let result = [];

  // Initialize an empty array to temporarily store a sequence of classes or years.
  let tempSequence = [];

  // Function to check if a string matches the pattern of a class (e.g., "1. klasse").
  const isClass = (str) => /^\d+\. klasse$/.test(str);

  // Function to check if a string matches the pattern of a year (e.g., "1 år").
  const isYear = (str) => /^\d+ år$/.test(str);

  // Function to extract the numeric part from a class string (e.g., "1. klasse" -> 1).
  const getClassNumber = (str) => parseInt(str.split('.')[0], 10);

  // Function to extract the numeric part from a year string (e.g., "1 år" -> 1).
  const getYearNumber = (str) => parseInt(str.split(' ')[0], 10);

  // Iterate through each element in the input array.
  for (let i = 0; i < items.length; i++) {
    // If the current element matches the class pattern.
    if (isClass(items[i])) {
      // Add the current element to the temporary sequence array.
      tempSequence.push(items[i]);

      // Check if the current element is the last in the array,
      // or the next element does not match the class pattern,
      // or the next element is not the next consecutive class number.
      if (
        i + 1 === items.length ||
        !isClass(items[i + 1]) ||
        getClassNumber(items[i + 1]) !== getClassNumber(items[i]) + 1
      ) {
        // If the temporary sequence contains more than one class, create a shortened entry.
        if (tempSequence.length > 1) {
          result.push(
            `${getClassNumber(tempSequence[0])}. - ${getClassNumber(tempSequence[tempSequence.length - 1])}. klasse`,
          );
        } else {
          // If the temporary sequence contains only one class, add it as is.
          result.push(tempSequence[0]);
        }
        // Reset the temporary sequence array for the next potential sequence.
        tempSequence = [];
      }
      // If the current element matches the year pattern.
    } else if (isYear(items[i])) {
      // Add the current element to the temporary sequence array.
      tempSequence.push(items[i]);

      // Check if the current element is the last in the array,
      // or the next element does not match the year pattern,
      // or the next element is not the next consecutive year number.
      if (
        i + 1 === items.length ||
        !isYear(items[i + 1]) ||
        getYearNumber(items[i + 1]) !== getYearNumber(items[i]) + 1
      ) {
        // If the temporary sequence contains more than one year, create a shortened entry.
        if (tempSequence.length > 1) {
          result.push(
            `${getYearNumber(tempSequence[0])} - ${getYearNumber(tempSequence[tempSequence.length - 1])} år`,
          );
        } else {
          // If the temporary sequence contains only one year, add it as is.
          result.push(tempSequence[0]);
        }
        // Reset the temporary sequence array for the next potential sequence.
        tempSequence = [];
      }
    } else {
      // If the current element does not match the class or year pattern, add it to the result array.
      result.push(items[i]);
    }
  }

  // Return the final processed result array.
  return result;
};

const limitCharLengthAndConvertToString = (array, maxLength) => {
  if (!array) {
    return;
  }

  if (typeof array[0] === 'object') {
    // console.log('arr is a lie its actually an object now', array[0]);
    return array.label;
  }

  // incase BE pukes again - so we also get full html from one of the content types, we need to catch it and clean it up
  if (
    array.length === 1 &&
    typeof array[0] === 'string' &&
    array[0].startsWith('<')
  ) {
    // remove full html from the string
    array = array[0].replace(/(<([^>]+)>)/gi, '');

    if (array.length > maxLength) {
      array = array.slice(0, maxLength);
      array += '...';

      return array;
    }

    return array;
  }

  let str = array.join(', ');

  if (str.length > maxLength) {
    str = str.slice(0, maxLength);

    // Check if the truncated string ends with a comma and remove it
    if (str.endsWith(',')) {
      str = str.slice(0, -1);
    }
    str += '...';
  }

  return str;
};

const allAudienceArr = ref(targetGroupFields.value?.audience || null);
const shortenClassesAudienceArr = ref(shortenClasses(allAudienceArr.value));
const processedAudienceString = ref(
  limitCharLengthAndConvertToString(shortenClassesAudienceArr.value, 85),
);

const allSubjectOrThemeArr = ref(
  targetGroupFields.value?.subjectOrTheme || null,
);
const processedSubjectOrThemeString = ref(
  limitCharLengthAndConvertToString(allSubjectOrThemeArr.value, 85),
);

const cardBodyText: any = ref(stripHtmlFromString(props.data?.body) || '');
</script>

<template>
  <NuxtLink class="card__link" :to="data?.link" aria-label="Link til kort">
    <div class="card">
      <div class="card__image" v-if="data?.field_image">
        <BaseImage
          class="card__image-item"
          v-if="data?.field_image"
          :image="data?.field_image"
        />
        <div
          v-if="data?.bundle_label || data?.field_target_group"
          class="card__target-group"
        >
          <div v-if="data?.bundle === 'course'">
            {{ data?.field_target_group }}
          </div>

          <div v-else>
            {{ data?.bundle_label }}
          </div>
        </div>
      </div>
      <div
        class="card__content"
        :class="{ 'card__content--no-image': !data?.field_image }"
      >
        <div v-if="data?.label" class="card__title">
          <h4>{{ data?.label }}</h4>
        </div>

        <div v-if="data?.body" class="card__text">
          {{ truncateString(cardBodyText, 155) }}
        </div>
        <div class="card__icons" v-if="targetGroupFields || providerData">
          <div class="card__icon" v-if="providerData">
            <ClientOnly>
              <NuxtLink
                :to="providerData?.link"
                aria-label="Link til virksomhed"
                class="card__link-provider"
              >
                <div class="card__icon-group card__icon-group--provider">
                  <NuxtIcon name="home-alt" filled />
                  <div class="card__icon-text card__icon-text--provider">
                    {{ providerData?.label }}
                  </div>
                </div>
              </NuxtLink>
            </ClientOnly>
          </div>

          <div class="card__icon" v-if="processedAudienceString">
            <div class="card__icon-group">
              <NuxtIcon name="user" filled />
              <div class="card__icon-text">
                {{ processedAudienceString }}
              </div>
            </div>
          </div>

          <div class="card__icon" v-if="processedSubjectOrThemeString">
            <div class="card__icon-group">
              <NuxtIcon name="info" filled />
              <div class="card__icon-text">
                {{ processedSubjectOrThemeString }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="card__footer"
          v-if="data?.field_theme || data?.field_is_free"
        >
          <BaseLabel class="label--green" v-if="data?.field_theme?.label">
            {{ data?.field_theme?.label }}
          </BaseLabel>
          <BaseLabel class="label--yellow" v-if="data?.field_is_free">
            Gratis
          </BaseLabel>

          <!-- <BaseLabel class="label--light-yellow">Øvrige</BaseLabel> -->
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.card {
  display: flex;
  flex-flow: column @(--sm) row;
  background: var(--color-white);
  color: var(--color-text);
  border: 2px solid var(--color-primary-lighten-4);
  border-radius: 4px;
  height: 100%;
  box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.1);
  transition: all 0.3s ease-in-out;

  :deep(img) {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover {
    box-shadow: 0 4px 10px 10px rgba(var(--color-primary-rgb), 0.15);

    :deep(img) {
      opacity: 0.8;
    }
  }

  &__link {
    text-decoration: none;
  }

  &__link-provider {
    text-decoration: none;
    display: flex;
    width: fit-content;
  }

  &__image {
    width: 100% @(--sm) 50%;
    position: relative;

    :deep(figure),
    :deep(picture),
    :deep(img) {
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
    }
  }

  &__image-item {
    :deep(img) {
      border-radius: 3px 3px 0 0 @(--sm) 3px 0 0 3px;
    }
  }

  &__title {
    word-break: break-word;

    h4 {
      margin-bottom: 8px;
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
    display: flex;
    flex-flow: column;
    width: 100% @(--sm) 50%;
    padding: 24px @(--sm) 32px;

    &--no-image {
      width: 100% !important;
    }
  }

  &__text {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
  }

  &__icon-group {
    display: flex;
  }

  &__icon {
    padding-top: 8px;
    font-size: 20px;

    .nuxt-icon {
      padding-top: 2px;
      display: flex;
    }
  }

  &__icon-text {
    color: var(--color-text);
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    margin-left: 8px;
    padding-top: 2px;
  }

  &__icon-text--provider {
    color: var(--color-text);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--color-text);
      border-bottom: 1px solid var(--color-text);
    }
  }

  &__footer {
    display: flex;
    gap: 4px;
    margin-top: auto;
    padding-top: 24px;
    flex-wrap: wrap;
  }

  li {
    font-size: 14px;
  }
  ul {
    margin: 0;
  }
}
</style>
