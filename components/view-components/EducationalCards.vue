<script setup lang="ts">
const config = useRuntimeConfig().public;

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const determineIcon = (cardLink: string) => {
  if (!cardLink) {
    return 'link-download';
  } else if (cardLink.includes('http')) {
    return 'ext-link';
  } else {
    return 'link-download';
  }
};
</script>

<template>
  <div class="educational-materials">
    <div class="educational-materials__card-wrapper">
      <div class="row">
        <div
          v-for="card in data.field_materials"
          class="col-xs-12 col-sm-6 col-md-4 educational-materials__card-item-container"
        >
          <div class="educational-materials__card-item">
            <div class="educational-materials__card-item-title">
              <h4>{{ card?.field_material_title }}</h4>
            </div>
            <div class="educational-materials__card-item-description">
              <div
                v-if="card.field_material_description"
                v-html="card?.field_material_description"
              ></div>
              <div
                v-else-if="card.field_literature_suggestion"
                v-html="card?.field_literature_suggestion"
              ></div>
            </div>
            <div class="educational-materials__card-item-button">
              <NuxtLink
                v-if="card.field_material_file || card?.field_material_url?.url"
                aria-label="Link til download"
                class="educational-materials__card-link"
                :to="
                  card.field_material_file
                    ? card.field_material_file
                    : card?.field_material_url?.url
                "
                target="_blank"
              >
                <span class="educational-materials__card-link-text">
                  {{ card?.field_material_download_text }}
                </span>
                <NuxtIcon
                  class="educational-materials__card-item-button--icon"
                  :name="
                    determineIcon(
                      card.field_material_file
                        ? card.field_material_file
                        : card?.field_material_url?.url,
                    )
                  "
                  filled
                />
              </NuxtLink>

              <!-- icon -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.educational-materials {
  &__card-wrapper {
    .row {
      margin-right: -12px;
      margin-left: -12px;
    }
  }

  &__title {
    margin-bottom: 22px @(--md) 44px;
  }

  &__card-container-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  &__card-item-container {
    padding: 12px;
  }

  &__card-item {
    padding: 32px;
    background: var(--color-white);
    border: 2px solid var(--color-primary-lighten-4);
    border-radius: 4px;
    box-shadow: 0 4px 10px 4px #297f781a;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__card-item-button {
    display: flex;
    align-items: center;
    margin-top: auto;

    a {
      text-decoration: none;
      font-weight: 700;
      color: var(--color-tertiary-darken-1);
    }

    &--icon {
      margin-left: 8px;

      :deep(svg) {
        background-color: var(--color-secondary);
        border-radius: 50%;
        padding: 8px;
        height: 40px;
        width: 40px;

        path {
          stroke: var(--color-secondary-text);
        }
      }
    }
  }

  &__card-link:hover {
    .educational-materials__card-link-text {
      border-bottom: 1px solid currentColor;
    }
  }

  &__card-link-text {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;

    &:hover {
      border-bottom: 1px solid currentColor;
    }
  }
}
</style>
