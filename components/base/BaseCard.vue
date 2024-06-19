<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

// The shit show begins.
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
      label1: 'Interesseområder',
      audience: props.data.field_areas_of_interest,
      label2: 'Branche',
      subjectOrTheme: props.data.field_industry,
    };
  }

  // IF Educators CT
  if (props.data?.bundle === 'course_educators') {
    return {
      audience: props.data.field_educators_target_group,
      label2: 'Læreplanstemaer',
      subjectOrTheme: props.data.field_curriculum_themes,
    };
  }

  // IF Exercise/Opgave CT
  if (props.data?.bundle === 'exercise') {
    // filter malgrupe by target group
    if (props.data?.field_target_group.label === 'Grundskole') {
      const school = ref(props.data?.field_trgt_grp_primary_school);
      const subject = ref(props.data?.field_primary_school_subject);

      if (school.value || subject.value) {
        let schoolLabels: any = [];
        let subjectLabels: any = [];

        // Check if school array exists and is an array
        if (Array.isArray(school.value)) {
          // Loop through school array and grab the .label from each object
          schoolLabels = schoolLabels.concat(
            school.value.map((item) => item.label),
          );
        }

        // Check if subject array exists and is an array
        if (Array.isArray(subject.value)) {
          // Loop through subject array and grab the .label from each object
          subjectLabels = subjectLabels.concat(
            subject.value.map((item) => item.label),
          );
        }

        return {
          audience: schoolLabels,
          subjectOrTheme: subjectLabels,
        };
      }
    } else if (props.data?.field_target_group.label === 'Dagtilbud') {
      const daycare = ref(props.data?.field_trgt_grp_daycare);
      const themes = ref(props.data?.field_curriculum_themes);

      if (daycare.value || themes.value) {
        let dayCareLabels: any = [];
        let themeLabels: any = [];

        // Check if daycare array exists and is an array
        if (Array.isArray(daycare.value)) {
          // Loop through daycare array and grab the .label from each object
          dayCareLabels = dayCareLabels.concat(
            daycare.value.map((item) => item.label),
          );
        }

        // Check if themes array exists and is an array
        if (Array.isArray(themes.value)) {
          // Loop through themes array and grab the .label from each object
          themeLabels = themeLabels.concat(
            themes.value.map((item) => item.label),
          );
        }

        return {
          audience: dayCareLabels,
          label2: 'Læreplanstemaer',
          subjectOrTheme: themeLabels,
        };
      }
    } else if (props.data?.field_target_group.label === 'Ungdomsuddannelse') {
      const youth = ref(props.data?.field_trgt_grp_youth_education);
      const subject = ref(props.data?.field_youth_education_subject);

      if (youth.value || subject.value) {
        let youngLabels: any = [];
        let subjectLabels: any = [];

        // Check if youth array exists and is an array
        if (Array.isArray(youth.value)) {
          // Loop through youth array and grab the .label from each object
          youngLabels = youngLabels.concat(
            youth.value.map((item) => item.label),
          );
        }

        // Check if subject array exists and is an array
        if (Array.isArray(subject.value)) {
          // Loop through subject array and grab the .label from each object
          subjectLabels = subjectLabels.concat(
            subject.value.map((item) => item.label),
          );
        }

        return {
          audience: youngLabels,
          subjectOrTheme: subjectLabels,
        };
      }
    }
  } else if (
    props.data?.bundle === 'exercise' ||
    props.data?.bundle === 'course'
  ) {
    if (props.data?.field_target_group === 'Dagtilbud') {
      return {
        audience: props.data.field_trgt_grp_daycare,
        subjectOrTheme: props.data.field_curriculum_themes,
        label: 'Læreplanstemaer',
      };
    } else if (props.data?.field_target_group === 'Grundskole') {
      return {
        audience: props.data.field_trgt_grp_primary_school,
        subjectOrTheme: props.data.field_primary_school_subject,
        label: 'Fag',
      };
    } else if (props.data?.field_target_group === 'Ungdomsuddannelse') {
      return {
        audience: props.data.field_trgt_grp_youth_education,
        subjectOrTheme: props.data.field_youth_education_subject,
        label: 'Fag',
      };
    }
  } else {
    return null;
  }
});

const providerData = ref(
  props.data?.provider || props.data?.corporation || null,
);
</script>

<template>
  <NuxtLink class="card__link" :to="data?.link" aria-label="Link til kort">
    <div class="card">
      <div class="card__image" v-if="data?.field_image">
        <BaseImage
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
      <div class="card__content">
        <div v-if="data?.label" class="card__title">
          <h4>{{ data?.label }}</h4>
        </div>

        <div v-if="data?.body" class="card__text" v-html="data?.body"></div>
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

          <div class="card__icon" v-if="targetGroupFields?.audience.length > 0">
            <div class="card__icon-group">
              <NuxtIcon name="user" filled />
              <div class="card__icon-text">
                {{
                  targetGroupFields?.label1
                    ? targetGroupFields?.label1
                    : 'Målgruppe'
                }}
              </div>
            </div>
            <ul>
              <li
                v-for="item in targetGroupFields?.audience"
                :key="item"
                v-html="item"
              ></li>
            </ul>
          </div>

          <div
            class="card__icon"
            v-if="targetGroupFields?.subjectOrTheme?.length > 0"
          >
            <div class="card__icon-group">
              <NuxtIcon name="info" filled />
              <div class="card__icon-text">
                {{
                  targetGroupFields?.label2 ? targetGroupFields?.label2 : 'Fag'
                }}
              </div>
            </div>
            <ul>
              <li v-for="item in targetGroupFields?.subjectOrTheme" :key="item">
                {{ item }}
              </li>
            </ul>
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

          <!-- TODO: Figure out use-case -->
          <!-- <BaseLabel class="label--light-yellow">Øvrige</BaseLabel> -->
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.card {
  display: grid @(--sm) flex;
  color: var(--color-text);
  border: 2px solid var(--color-primary-lighten-4);
  border-radius: 4px;
  height: 100%;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.1);

  &:hover {
    box-shadow: 0 4px 10px 10px rgba(var(--color-primary-rgb), 0.15);

    img {
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

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
      border-radius: 3px 0 0 3px;
    }
  }

  &__title {
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
    display: block;
    width: 100% @(--sm) 50%;
    padding: 24px @(--sm) 32px;
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

  &__icon-group {
    display: flex;
  }

  &__icon {
    padding-top: 8px;

    font-size: 20px;
    align-items: center;

    &:first-child {
      margin-bottom: 8px;
    }

    .nuxt-icon {
      align-items: center;
      display: flex;
    }
  }

  &__icon-text {
    color: var(--color-text);
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    margin-left: 8px;
  }

  &__icon-text--provider {
    color: var(--color-text);
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--color-primary);
      border-bottom: 1px solid var(--color-primary);
    }
  }

  &__footer {
    display: flex;
    gap: 4px;
    align-items: end;
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
