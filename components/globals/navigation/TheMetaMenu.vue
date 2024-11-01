<script setup>
import { useHeaderDataStore } from '~/stores/headerData';
import { useSettingsDataStore } from '~/stores/settingsData';

const headerDataStore = useHeaderDataStore();
const settingsDataStore = useSettingsDataStore();

if (headerDataStore.headerData === null) {
  headerDataStore.getHeaderData();
}

const metaMenuData = computed(() => {
  const metaKey = Object.keys(headerDataStore?.headerData || {}).find((key) =>
    key.includes('meta'),
  );
  return metaKey ? headerDataStore?.headerData?.[metaKey] : null;
});

const isHeaderFixed = computed(() => settingsDataStore?.isHeaderFixed);

// Close the meta-menu offcanvas if the header is fixed (off screen)
watch(isHeaderFixed, () => {
  closeOffCanvas();
});

const route = useRoute();
watch(
  () => route.path,
  () => {
    closeOffCanvas();
  },
);

const isOpen = ref(false);
const activeNavItem = ref(null);
const handleNavigationItemClick = (metaItem) => {
  if (metaItem.below.length > 0) {
    if (isOpen.value && activeNavItem.value === metaItem) {
      // Close the canvas if the same metaItem is clicked again
      closeOffCanvas();
    } else {
      openOffCanvas(metaItem);
    }
  } else {
    if (isOpen.value) {
      closeOffCanvas();
    }
    // Closing the canvas if the metaItem has no children
    closeOffCanvas();
  }
};
const openOffCanvas = (metaItem) => {
  isOpen.value = true;
  activeNavItem.value = metaItem;
};

const closeOffCanvas = () => {
  isOpen.value = false;
  activeNavItem.value = null;
};
</script>

<template>
  <div class="meta-menu">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-xs-12 col-md-12">
          <div class="meta-menu__items-wrapper">
            <NuxtLink
              class="meta-menu__item"
              v-for="metaItem in metaMenuData?.items"
              :class="{
                'meta-menu__item--active': activeNavItem === metaItem,
              }"
              :key="metaItem.title"
              :to="
                metaItem.link.url && !metaItem.expanded
                  ? metaItem.link.url
                  : 'javascript:void(0)'
              "
              :aria-label="'Link til ' + metaItem?.title"
              :role="!metaItem.link.url ? 'button' : ''"
              @click="handleNavigationItemClick(metaItem)"
            >
              <div class="meta-menu__item-wrapper">
                {{ metaItem?.title }}
                <NuxtIcon
                  class="meta-menu__item--arrow"
                  filled
                  name="chevron-down"
                  v-if="metaItem.expanded"
                  :class="{
                    'meta-menu__item--rotate-arrow': activeNavItem === metaItem,
                  }"
                />

                <ClientOnly>
                  <Transition name="slide-top">
                    <TheOffCanvasMetaMenu
                      v-if="isOpen && activeNavItem === metaItem"
                      :nested-items="metaItem?.below"
                      class="meta-offcanvas"
                    />
                  </Transition>
                </ClientOnly>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.meta-menu {
  position: relative;
  display: none @(--md) flex;
  align-items: center;
  background: var(--color-tertiary-lighten-6);
  z-index: 11;

  .meta-menu__items-wrapper {
    height: var(--meta-navigation-bar-height);
    display: flex;
    justify-content: flex-end;

    :deep(svg) {
      font-size: 24px;
    }
  }

  &__item {
    position: relative;
    color: var(--color-tertiary);
    font-size: 14px;
    font-weight: 600;
    padding: 15px 24px;
    line-height: 18px;
    letter-spacing: 1px;
    text-decoration: none;
    transition: opacity 0.3s;
    display: inline-flex;
    align-items: center;

    &--active {
      color: var(--color-primary);
    }

    &--arrow {
      margin-left: 2px;

      :deep(svg) {
        transition: all 0.3s;
        transform: rotate(0deg);
      }
    }

    &--rotate-arrow {
      :deep(svg) {
        transition: all 0.3s;
        transform: rotate(180deg);
      }
    }

    &:last-child {
      padding-right: 0;
    }

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
