<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

console.log('card item', props.data);

// if field_target_group === Dagtilbud
// then show Målgruppe: field_trgt_grp_daycare and Læreplanstemaer: field_curriculum_themes

// if field_target_group === GRUNDSKOLE
// then Målgruppe: field_trgt_grp_primary_school and Fag: field_primary_school_subject

// if field_target_group === Ungdomsuddannelse
// then Målgruppe: field_trgt_grp_youth_education AND Fag: field_youth_education_subject

const targetGroupFields = computed(() => {
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
  } else {
    return null;
  }
});
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
        <div class="card__icons" v-if="targetGroupFields">
          <div class="card__icon">
            <div class="card__icon-group">
              <NuxtIcon name="home-alt" filled />
              <div class="card__icon-text">Udbyder</div>
            </div>
          </div>

          <div class="card__icon" v-if="targetGroupFields.audience.length > 0">
            <div class="card__icon-group">
              <NuxtIcon name="user" filled />
              <div class="card__icon-text">Målgruppe</div>
            </div>
            <ul>
              <li v-for="item in targetGroupFields.audience" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>

          <div
            class="card__icon"
            v-if="targetGroupFields.subjectOrTheme.length > 0"
          >
            <div class="card__icon-group">
              <NuxtIcon name="info" filled />
              <div class="card__icon-text">{{ targetGroupFields.label }}</div>
            </div>
            <ul>
              <li v-for="item in targetGroupFields.subjectOrTheme" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <div class="card__footer">
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
    display: grid;
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
    padding-left: 8px;
    color: var(--color-text);
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
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
