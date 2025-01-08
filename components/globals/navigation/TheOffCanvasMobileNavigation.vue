<script setup lang="ts">
import { useHeaderDataStore } from '~/stores/headerData';
const headerDataStore = useHeaderDataStore();

const navigationMenuData = computed(() => {
  const mainKey = Object.keys(headerDataStore?.headerData || {}).find((key) =>
    key.includes('main'),
  );
  return mainKey ? headerDataStore?.headerData?.[mainKey] : null;
});

const metaMenuData = computed(() => {
  const metaKey = Object.keys(headerDataStore?.headerData || {}).find((key) =>
    key.includes('meta'),
  );
  return metaKey ? headerDataStore?.headerData?.[metaKey] : null;
});

const showSubItems = ref(false);
const subItems = ref([]);
const selectedParentItem = ref(null);

const handleItemClick = (node: any) => {
  if (node.below.length > 0) {
    subItems.value = node.below;

    selectedParentItem.value = node;
    showSubItems.value = true;

    if (showSubItems.value) {
      const offcanvasMobileMenuWrapper = document.querySelector(
        '.offcanvas-mobile__menu-wrapper',
      );
      offcanvasMobileMenuWrapper?.classList.add(
        'offcanvas-mobile__menu-wrapper--white-bg',
      );
    }
  }
};

const goBack = () => {
  showSubItems.value = false;
  subItems.value = [];
  selectedParentItem.value = null;

  if (!showSubItems.value) {
    const offcanvasMobileMenuWrapper = document.querySelector(
      '.offcanvas-mobile__menu-wrapper',
    );
    offcanvasMobileMenuWrapper?.classList.remove(
      'offcanvas-mobile__menu-wrapper--white-bg',
    );
  }
};

const backButtonLabel = computed(() => {
  return `${selectedParentItem?.value?.title}`;
});

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  // enable scroll on body
  document.body.style.overflow = 'auto';
});
</script>

<template>
  <div class="offcanvas-mobile">
    <div class="offcanvas-mobile__menu-wrapper">
      <div class="container">
        <div class="row">
          <!-- primary nav -->
          <Transition name="slide-right">
            <div v-if="!showSubItems" class="offcanvas-mobile__menu-wrapper">
              <li class="offcanvas-mobile__items-wrapper">
                <NuxtLink
                  v-for="node in navigationMenuData.items"
                  :key="node.id"
                  class="offcanvas-mobile__item-link"
                  @click="handleItemClick(node)"
                  :to="
                    node.link.url && node.below.length === 0
                      ? node.link.url
                      : 'javascript:void(0)'
                  "
                  :aria-label="'Link til ' + node?.title"
                >
                  {{ node?.title }}
                  <span v-if="node.below.length > 0">
                    <NuxtIcon filled name="chevron-right"
                  /></span>
                </NuxtLink>
              </li>

              <!-- Meta menu mobile -->
              <li
                class="offcanvas-mobile__items-wrapper offcanvas-mobile__items-wrapper--meta-menu"
              >
                <NuxtLink
                  v-for="metaItem in metaMenuData.items"
                  :key="metaItem.title"
                  class="offcanvas-mobile__item-link offcanvas-mobile__item-link--meta-menu"
                  @click="handleItemClick(metaItem)"
                  :to="metaItem?.link?.url"
                  :aria-label="'Link til ' + metaItem?.title"
                >
                  {{ metaItem?.title }}
                  <span v-if="metaItem.below.length > 0">
                    <NuxtIcon filled name="chevron-right" />
                  </span>
                </NuxtLink>
              </li>
            </div>
          </Transition>

          <!-- level 2 -->
          <Transition name="slide">
            <div
              v-if="showSubItems"
              class="offcanvas-mobile__menu-wrapper--subitems"
            >
              <NuxtLink
                class="offcanvas-mobile__back-button"
                @click="goBack"
                aria-label="Tilbage"
              >
                <span class="offcanvas-movile__back-button--icon">
                  <NuxtIcon filled name="chevron-left" />
                </span>
                <span class="offcanvas-mobile__back-button--text">
                  {{ backButtonLabel }}
                </span>
              </NuxtLink>

              <ul class="offcanvas-mobile__menu-items--subitems">
                <li
                  v-for="subNode in subItems"
                  :key="subNode.id"
                  class="offcanvas-mobile__items-wrapper--subitems"
                >
                  <NuxtLink
                    v-if="subNode.url"
                    :to="subNode?.url"
                    class="offcanvas-mobile__item-link--subitems"
                    :aria-label="'Link til ' + subNode?.title"
                  >
                    {{ subNode?.title }}
                  </NuxtLink>

                  <NuxtLink
                    v-else
                    :to="subNode?.link?.url"
                    class="offcanvas-mobile__item-link--subitems"
                    :aria-label="'Link til ' + subNode?.title"
                  >
                    {{ subNode?.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.offcanvas-mobile {
  position: fixed;
  margin-top: var(--navigation-bar-height);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: var(--color-white);
  text-transform: uppercase;

  &__menu-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--color-tertiary-lighten-6);
    transition: background-color 0.3s ease-in-out;
    padding-bottom: 62px;

    &--white-bg {
      background-color: var(--color-white);
    }

    &--subitems {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  &__back-button {
    color: var(--color-tertiary);
    font-family: var(--body-font-family);
    text-decoration: none;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    width: fit-content;
    cursor: pointer;
    padding: 16px 24px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      font-size: 24px;
    }

    &--icon {
      margin-right: auto;
    }

    &--text {
      margin: 0 auto;
    }
  }

  &__menu-items {
    padding-left: 19px;
    margin-top: 30px;

    &--subitems {
      margin: 0;
      padding: 0;
      list-style: none;

      a {
        color: var(--color-tertiary);
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        width: fit-content;
        line-height: 18px;
        letter-spacing: 1px;
        text-transform: none;
        width: 100%;
        display: block;
      }
    }
  }

  &__items-wrapper {
    display: grid;

    &--meta-menu {
      background: var(--color-tertiary-lighten-6);
      text-transform: none;
    }

    &--subitems {
      border-top: 1px solid var(--color-tertiary-lighten-4);
      padding: 16px 24px;
    }
  }

  &__item-link {
    color: var(--color-tertiary);
    background-color: var(--color-white);
    font-family: var(--body-font-family);
    text-decoration: none;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    width: fit-content;
    cursor: pointer;
    padding: 16px 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    :deep(svg) {
      font-size: 24px;
    }

    &:not(:first-child) {
      border-top: 1px solid var(--color-tertiary-lighten-4);
    }

    &--meta-menu {
      letter-spacing: 1px;
      font-size: 14px;
      line-height: 18px;
      background-color: var(--color-tertiary-lighten-6);

      &:first-child {
        border-top: 1px solid var(--color-tertiary-lighten-4);
      }
    }
  }
}
</style>
