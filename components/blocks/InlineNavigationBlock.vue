<script lang="ts" setup>
const props = defineProps({
  blockData: Object,
});

const inlineNavigationItems = ref(props.blockData.field_inline_nav_paragraphs);

const isCompactStyle = ref(props.blockData.field_compact_view);
</script>

<template>
  <div class="inline-navigation">
    <div class="inline-navigation__card-wrapper" v-if="!isCompactStyle">
      <NuxtLink
        class="inline-navigation__card-link"
        v-for="item in inlineNavigationItems"
        :key="item"
        :to="item?.field_inline_navigation_pages?.url"
        :aria-label="`Link til ${item?.field_inline_navigation_pages?.label}`"
      >
        <div class="inline-navigation__card-item">
          <div
            class="inline-navigation__card-image"
            v-if="item.field_inline_navigation_pages.field_list_media"
          >
            <BaseImage
              v-if="item.field_inline_navigation_pages.field_list_media"
              :image="item.field_inline_navigation_pages.field_list_media"
            />
          </div>
          <div class="inline-navigation__card-content">
            <h4
              class="inline-navigation__card-title"
              v-if="item.field_inline_navigation_pages.label"
            >
              {{ item?.field_inline_navigation_pages?.label }}
            </h4>
            <p
              class="inline-navigation__card-description"
              v-if="item.field_inline_navigation_pages.field_description"
            >
              {{ item?.field_inline_navigation_pages?.field_description }}
            </p>
          </div>
          <div class="inline-navigation__card-link">
            <NuxtIcon
              class="inline-navigation__card-button-icon"
              name="arrow-right"
              filled
            ></NuxtIcon>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Compact Style -->
    <div v-else class="inline-navigation__card-compact-wrapper">
      <NuxtLink
        class="inline-navigation__card-compact-link inline-navigation__card-link"
        v-for="item in inlineNavigationItems"
        :key="item"
        :to="item?.field_inline_navigation_pages?.url"
        :aria-label="`Link til ${item?.field_inline_navigation_pages?.label}`"
      >
        <div class="inline-navigation__card-compact-item">
          <div class="inline-navigation__card-compact-container">
            <div class="inline-navigation__card-compact-icon-container">
              <NuxtIcon
                class="inline-navigation__card-compact-icon"
                name="document"
                filled
              ></NuxtIcon>
            </div>
            <div class="inline-navigation__card-compact-content">
              <h4
                class="inline-navigation__card-compact-title"
                v-if="item?.field_inline_navigation_pages?.label"
              >
                {{ item?.field_inline_navigation_pages?.label }}
              </h4>
            </div>
          </div>

          <div
            class="inline-navigation__card-link inline-navigation__card-compact-button"
          >
            <NuxtIcon
              class="inline-navigation__card-button-icon"
              name="arrow-right"
              filled
            ></NuxtIcon>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.inline-navigation {
  color: var(--theme-color);

  &__card-wrapper {
    display: grid;
    grid-template-columns: repeat(1, 1fr) @(--sm) repeat(2, 1fr) @(--md) repeat(
        3,
        1fr
      );
    gap: 22px;
  }

  &__card-link {
    text-decoration: none;
    color: var(--theme-color);
  }

  &__card-item {
    height: 100%;
    padding: 32px;
    border: 2px solid var(--color-primary-lighten-4);
    border-radius: 4px;
    box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.1);
    transition: all 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 4px 10px 10px rgba(var(--color-primary-rgb), 0.15);

      :deep(img) {
        opacity: 0.8;
      }
    }

    :deep(img) {
      transition: all 0.3s ease-in-out;
      opacity: 1;
    }
  }

  &__card-content {
    padding: 22px 0;
  }

  &__card-description {
    line-height: 24px;
    font-weight: 400;
    margin-bottom: 0;
  }

  &__card-button-icon {
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

  /* Compact Style */
  &__card-compact-wrapper {
    display: grid;
    grid-template-columns:
      repeat(1, 1fr) @(--sm) repeat(2, 1fr) @(--md) repeat(3, 1fr)
      @(--lg) repeat(4, 1fr);
    gap: 22px;
  }

  &__card-compact-button {
    padding-left: 10px;
  }

  &__card-compact-item {
    color: var(--theme-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px @(--sm) 32px;
    border: 2px solid var(--color-primary-lighten-4);
    border-radius: 4px;
    box-shadow: 0px 4px 10px 7px rgba(var(--color-primary-rgb), 0.1);
    transition: all 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 4px 10px 10px rgba(var(--color-primary-rgb), 0.15);
    }
  }

  &__card-compact-container {
    display: flex;
    align-items: center;
  }

  &__card-compact-title {
    margin-bottom: 0;
    line-height: 28px;
  }

  &__card-compact-icon-container {
    margin-right: 8px;
    font-size: 30px;
  }

  &__card-compact-icon {
    display: flex;

    :deep(path:first-child) {
      stroke: var(--theme-color);
    }

    :deep(path:last-child) {
      stroke: var(--theme-color);
    }
  }
}
</style>
