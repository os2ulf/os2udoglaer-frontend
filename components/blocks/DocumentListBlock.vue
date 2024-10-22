<script setup>
const props = defineProps({
  blockData: Object,
});
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
        v-for="item in props.blockData.field_material_paragraph"
      >
        <NuxtLink
          v-if="item.field_material_file || item.field_material_url?.url"
          class="document-list__card-item-button"
          aria-label="Link til download"
          :to="
            item.field_material_file
              ? item.field_material_file
              : item?.field_material_url?.url
          "
          :target="!item?.field_material_file ? '_blank' : ''"
        >
          <NuxtIcon
            class="document-list__card-item-button--icon"
            :name="item.field_material_file ? 'link-download' : item.field_literature_suggestion ? 'book-opened' : 'ext-link'"
            filled
          />
          <div>
            <div class="document-list__card-link">
              <span class="document-list__card-link-text" v-text="item.field_literature_suggestion ? item.field_literature_suggestion : item.field_material_download_text ? item.field_material_download_text : item.field_material_title">
              </span>
            </div>
            <div
              v-if="item.field_material_description"
              class="document-list__card-item-description"
              v-html="item.field_material_description"
            ></div>
          </div>
        </NuxtLink>
        <div v-else class="document-list__card-item-button">
          <NuxtIcon
            class="document-list__card-item-button--icon"
            :name="item.field_material_file ? 'link-download' : item.field_literature_suggestion ? 'book-opened' : 'ext-link'"
            filled
          />
          <div>
            <div class="document-list__card-link">
              <span class="document-list__card-link-text" v-text="item.field_literature_suggestion ? item.field_literature_suggestion : item.field_material_download_text ? item.field_material_download_text : item.field_material_title">
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
    text-decoration: none;
    font-weight: 700;
    color: var(--color-text);

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
  }

  a:hover {
    .document-list__card-link-text {
      border-bottom: 1px solid currentColor;
    }
  }

  &__card-link-text {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
    word-break: break-all;
  }

  &__card-item-description {
    :deep(p) {
      font-weight: 300;
      font-size: 14px;
      margin: 0;
    }
  }
}
</style>
