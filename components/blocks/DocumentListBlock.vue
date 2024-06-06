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
        <div class="document-list__card-item-button">
          <!-- icon -->
          <NuxtIcon
            class="document-list__card-item-button--icon"
            :name="item.field_material_file ? 'link-download' : 'ext-link'"
            filled
          />
          <div>
            <NuxtLink
              class="document-list__card-link"
              :to="
                item.field_material_file
                  ? item.field_material_file
                  : item?.field_material_url?.url
              "
              :target="!item?.field_material_file ? '_blank' : ''"
            >
              <span class="document-list__card-link-text">
                {{ item?.field_material_download_text }}
              </span>
            </NuxtLink>
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
  color: var(--color-tertiary);

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

    a {
      text-decoration: none;
      font-weight: 700;
      color: var(--color-tertiary-darken-1);
    }

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

  &__card-link:hover {
    .educational-materials__card-link-text {
      border-bottom: 1px solid currentColor;
    }
  }

  &__card-link-text {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
    word-break: break-all;

    &:hover {
      border-bottom: 1px solid currentColor;
    }
  }

  &__card-item-description {
    :deep(p) {
      padding-top: 5px;
      font-weight: 300;
      font-size: 14px;
      margin: 0;
    }
  }
}
</style>
