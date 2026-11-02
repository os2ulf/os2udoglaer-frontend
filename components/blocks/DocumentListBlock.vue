<script setup>
import { stripHtmlFromString } from '~/utils/stripHtml';

const props = defineProps({
  blockData: Object,
});

const getLinkText = (item) =>
  item.field_material_download_text?.trim() || item.field_material_title;

const getDescriptionText = (description) =>
  stripHtmlFromString(description?.replace(/<br\s*\/?>/gi, ' '))
    ?.replace(/\s+/g, ' ')
    .trim() || '';
</script>

<template>
  <div class="document-list">
    <div
      class="document-list__heading-wrapper"
      v-if="props.blockData.field_title || props.blockData.body"
    >
      <h4 class="document-list__title" v-if="props.blockData.field_title">
        {{ props.blockData.field_title }}
      </h4>
      <div
        class="document-list__body"
        v-if="props.blockData.body"
        v-html="props.blockData.body"
      ></div>
    </div>

    <div
      class="document-list__items-container"
      v-if="blockData.field_material_paragraph.length > 0"
    >
      <div
        class="document-list__card-item"
        v-for="(item, index) in props.blockData.field_material_paragraph"
        :key="item.id ?? index"
      >
        <NuxtLink
          v-if="item.field_material_file || item.field_material_url?.url"
          class="document-list__card-item-button"
          :to="
            item.field_material_file
              ? item.field_material_file
              : item?.field_material_url?.url
          "
          :target="!item?.field_material_file ? '_blank' : ''"
        >
          <span
            class="document-list__card-item-button--icon document-list__card-item-button--icon-link"
            :class="
              item.field_material_file
                ? 'document-list__card-item-button--icon-download'
                : item.field_literature_suggestion
                  ? 'document-list__card-item-button--icon-book'
                  : 'document-list__card-item-button--icon-external'
            "
            aria-hidden="true"
          ></span>
          <span class="document-list__card-link">
            <span class="document-list__card-link-text">
              <span
                v-if="!item.field_material_download_text?.trim()"
                class="sr-only"
                >{{ item.field_material_file ? 'Hent: ' : 'Gå til: ' }}</span
              >{{ getLinkText(item)
              }}<span v-if="!getLinkText(item)?.endsWith('.')" class="sr-only"
                >.</span
              >
            </span>
            {{ ' ' }}
            <span
              v-if="item.field_material_description"
              class="document-list__card-item-description"
              >{{ getDescriptionText(item.field_material_description) }}</span
            >
          </span>
        </NuxtLink>
        <div v-else class="document-list__card-item-button">
          <NuxtIcon
            class="document-list__card-item-button--icon"
            :name="
              item.field_material_file
                ? 'link-download'
                : item.field_literature_suggestion
                  ? 'book-opened'
                  : 'ext-link'
            "
            filled
          />
          <div>
            <div class="document-list__card-link">
              <span
                class="document-list__card-link-text"
                v-text="
                  item.field_literature_suggestion
                    ? item.field_literature_suggestion
                    : item.field_material_download_text
                      ? item.field_material_download_text
                      : item.field_material_title
                "
              >
              </span>
            </div>
            <div
              v-if="item.field_material_description"
              class="document-list__card-item-description"
              v-html="item.field_material_description"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.document-list {
  color: var(--theme-color);

  &__title {
    word-break: break-word;
  }

  &__heading-wrapper {
    margin-bottom: 24px;
  }

  &__body {
    font-weight: 400;
    line-height: 24px;

    :deep(p) {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__item {
    display: grid;
  }

  &__card-item {
    background: transparent;
    padding-bottom: 12px;

    &:last-child {
      padding-bottom: 0;
    }
  }

  &__card-item-button {
    display: flex;
    align-items: center;
    width: fit-content;
    text-decoration: none;
    font-weight: 700;
    color: var(--theme-color);

    &--icon {
      margin-right: 12px;

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
      flex: 0 0 40px;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-secondary);

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

    &--icon-book::before {
      mask-image: url('~/assets/icons/book-opened.svg');
    }

    &--icon-external::before {
      mask-image: url('~/assets/icons/ext-link.svg');
    }
  }

  a:hover {
    .document-list__card-link-text {
      border-bottom: 1px solid currentColor;
    }
  }

  &__card-link-text {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
  }

  &__card-item-description {
    display: block;
    font-weight: 300;
    font-size: 14px;
    margin: 0;

    :deep(p) {
      font-weight: 300;
      font-size: 14px;
      margin: 0;
    }
  }
}
</style>
