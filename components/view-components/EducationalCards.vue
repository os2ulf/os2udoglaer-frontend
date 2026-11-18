<script setup lang="ts">
defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const getLinkText = (card: {
  field_material_download_text?: string | null;
  field_material_title?: string;
  field_material_file?: string | null;
}) =>
  card.field_material_download_text?.trim() ||
  `${card.field_material_file ? 'Hent' : 'Gå til'}: ${card.field_material_title}`;
</script>

<template>
  <div class="educational-materials">
    <div class="educational-materials__card-wrapper">
      <div class="row">
        <div
          v-for="(card, index) in data.field_materials"
          :key="card.id ?? index"
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
            </div>
            <div class="educational-materials__card-item-button">
              <div
                v-if="card.field_literature_suggestion"
                class="educational-materials__card-link educational-materials__card-link--placeholder"
              >
                <span class="educational-materials__card-link-text">
                  {{ card?.field_literature_suggestion }}
                </span>
                <NuxtIcon
                  class="educational-materials__card-item-button--icon"
                  name="book-opened"
                  filled
                />
              </div>
              <NuxtLink
                v-else-if="
                  card.field_material_file || card?.field_material_url?.url
                "
                class="educational-materials__card-link"
                :to="
                  card.field_material_file
                    ? card.field_material_file
                    : card?.field_material_url?.url
                "
                target="_blank"
              >
                <span class="educational-materials__card-link-text">
                  {{ getLinkText(card) }}
                </span>
                <span
                  class="educational-materials__card-item-button--icon educational-materials__card-item-button--icon-link"
                  :class="
                    card.field_material_file
                      ? 'educational-materials__card-item-button--icon-download'
                      : 'educational-materials__card-item-button--icon-external'
                  "
                  aria-hidden="true"
                ></span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.educational-materials {
  color: var(--color-text);

  &__card-wrapper {
    .row {
      margin-right: -12px;
      margin-left: -12px;
    }
  }

  &__title {
    margin-bottom: 22px;
    word-break: break-word;

    @media (min-width: 992px) {
      margin-bottom: 44px;
    }
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
    box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), 0.1);

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

    &--icon-link {
      display: inline-flex;
      vertical-align: middle;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-secondary);
      align-items: center;
      justify-content: center;

      &::before {
        content: '';
        width: 24px;
        height: 24px;
        background-color: var(--color-secondary-text);
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: contain;
      }
    }

    &--icon-download::before {
      mask-image: url('~/assets/icons/link-download.svg');
    }

    &--icon-external::before {
      mask-image: url('~/assets/icons/ext-link.svg');
    }
  }

  &__card-link:hover:not(.educational-materials__card-link--placeholder) {
    .educational-materials__card-link-text {
      border-bottom: 1px solid currentColor;
    }
  }

  &__card-link--placeholder {
    font-weight: 700;
  }

  &__card-link-text {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
    color: var(--color-text);
  }
}
</style>
