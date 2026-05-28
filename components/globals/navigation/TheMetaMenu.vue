<script setup>
import { useHeaderDataStore } from '~/stores/headerData';
import { useSettingsData } from '~/composables/useSettingsData'

const headerDataStore = useHeaderDataStore();
const { isHeaderFixed } = useSettingsData();

await useAsyncData('header', () => headerDataStore.getHeaderData());

const metaMenuData = computed(() => {
  const data = headerDataStore.headerData;
  if (!data) return null;

  const metaKey = Object.keys(data).find((key) =>
    key.includes('meta'),
  );

  return metaKey ? data[metaKey] : null;
});

const isOpen = ref(false);
const activeNavItem = ref(null);

const closeOffCanvas = () => {
  isOpen.value = false;
  activeNavItem.value = null;
};

const openOffCanvas = (metaItem) => {
  isOpen.value = true;
  activeNavItem.value = metaItem;
};

const handleNavigationItemClick = (metaItem) => {
  const hasChildren = metaItem?.below?.length > 0;

  if (!hasChildren) {
    closeOffCanvas();
    return;
  }

  if (isOpen.value && activeNavItem.value === metaItem) {
    closeOffCanvas();
  } else {
    openOffCanvas(metaItem);
  }
};

watch(
  isHeaderFixed,
  (val) => {
    if (val) closeOffCanvas();
  }
);

const route = useRoute();

watch(
  () => route.path,
  () => closeOffCanvas()
);
</script>

<template>
  <nav class="meta-menu" aria-label="meta-menu">
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
  </nav>
</template>

<style lang="postcss" scoped>
.meta-menu {
  position: relative;
  display: none;
  align-items: center;
  background: var(--color-gray-8);
  z-index: 11;

  @media (min-width: 992px) {
    display: flex;
  }

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
    color: var(--color-text);
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
