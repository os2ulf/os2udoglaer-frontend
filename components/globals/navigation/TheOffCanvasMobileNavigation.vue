<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { NuxtLink } from '#components';
import { useHeaderData } from '~/composables/useHeaderData';
import {
  getFocusableElements,
  getMenuChildren,
  getMenuItems,
  getMenuItemUrl,
  hasMenuChildren,
} from '~/utils/navigation';
import type { NavigationItem } from '~/utils/navigation';

const emit = defineEmits<{
  close: [restoreFocus: boolean];
  exit: [];
}>();
const { headerData, getHeaderData } = useHeaderData();
await getHeaderData();

const menuEntries = computed(() => {
  const data = headerData.value;
  const keys = Object.keys(data ?? {});
  const mainKey = keys.find((key) => key.includes('main'));
  const metaKey = keys.find((key) => key.includes('meta'));
  return [
    ...getMenuItems(mainKey ? data[mainKey]?.items : null).map((item) => ({
      item,
      isMeta: false,
    })),
    ...getMenuItems(metaKey ? data[metaKey]?.items : null).map((item) => ({
      item,
      isMeta: true,
    })),
  ];
});

const mobileMenu = ref<HTMLElement | null>(null);
const topLevel = ref<HTMLElement | null>(null);
const submenu = ref<HTMLElement | null>(null);
const selectedIndex = ref<number | null>(null);
const showSubItems = computed(() => selectedIndex.value !== null);
const selectedParent = computed(() =>
  selectedIndex.value === null
    ? null
    : menuEntries.value[selectedIndex.value]?.item,
);
const subItems = computed(() => getMenuChildren(selectedParent.value));
let previousBodyOverflow = '';

const handleItemClick = async (item: NavigationItem, index: number) => {
  if (!hasMenuChildren(item)) return;
  selectedIndex.value = index;
  await nextTick();
  getFocusableElements(submenu.value)[0]?.focus();
};

const goBack = async (index = selectedIndex.value) => {
  selectedIndex.value = null;
  await nextTick();
  topLevel.value
    ?.querySelector<HTMLElement>('[data-mobile-menu-index="' + index + '"]')
    ?.focus();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    if (showSubItems.value) goBack();
    else emit('close', true);
    return;
  }

  if (event.key !== 'Tab') return;
  const focusable = getFocusableElements(mobileMenu.value);
  const target = document.activeElement;

  if (event.shiftKey && target === focusable[0]) {
    event.preventDefault();
    if (showSubItems.value) goBack();
    else emit('close', true);
  } else if (!event.shiftKey && target === focusable[focusable.length - 1]) {
    event.preventDefault();
    const parentIndex = selectedIndex.value;
    const nextIndex =
      parentIndex === null
        ? -1
        : menuEntries.value.findIndex(
            ({ item }, index) =>
              index > parentIndex &&
              (hasMenuChildren(item) || getMenuItemUrl(item)),
          );
    if (nextIndex !== -1) goBack(nextIndex);
    else emit('exit');
  }
};

onMounted(async () => {
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  await nextTick();
  (getFocusableElements(topLevel.value)[0] ?? mobileMenu.value)?.focus();
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow;
  // The slide-out transition keeps the DOM briefly after the menu is closed.
  mobileMenu.value?.setAttribute('inert', '');
});
</script>

<template>
  <nav
    id="mobile-menu"
    ref="mobileMenu"
    class="offcanvas-mobile"
    aria-label="Menu"
    tabindex="-1"
    @keydown="handleKeydown"
  >
    <div
      class="offcanvas-mobile__menu-wrapper"
      :class="{ 'offcanvas-mobile__menu-wrapper--white-bg': showSubItems }"
    >
      <div class="container">
        <div class="row">
          <ul
            v-if="!showSubItems"
            ref="topLevel"
            class="offcanvas-mobile__top-level"
          >
            <li
              v-for="({ item, isMeta }, index) in menuEntries"
              :key="index"
              class="offcanvas-mobile__items-wrapper"
              :class="{ 'offcanvas-mobile__items-wrapper--meta-menu': isMeta }"
            >
              <component
                :is="
                  hasMenuChildren(item)
                    ? 'button'
                    : getMenuItemUrl(item)
                      ? NuxtLink
                      : 'span'
                "
                :type="hasMenuChildren(item) ? 'button' : undefined"
                :to="hasMenuChildren(item) ? undefined : getMenuItemUrl(item)"
                :data-mobile-menu-index="index"
                class="offcanvas-mobile__item-link"
                :class="{ 'offcanvas-mobile__item-link--meta-menu': isMeta }"
                :aria-expanded="hasMenuChildren(item) ? false : undefined"
                :aria-controls="
                  hasMenuChildren(item)
                    ? 'mobile-menu-submenu-' + index
                    : undefined
                "
                @click="handleItemClick(item, index)"
              >
                {{ item.title }}
                <span v-if="hasMenuChildren(item)" aria-hidden="true">
                  <NuxtIcon filled name="chevron-right" />
                </span>
              </component>
            </li>
          </ul>
          <div
            v-else
            :id="'mobile-menu-submenu-' + selectedIndex"
            ref="submenu"
            class="offcanvas-mobile__menu-wrapper--subitems"
          >
            <button
              type="button"
              class="offcanvas-mobile__back-button"
              aria-label="Tilbage til menuen"
              @click="goBack()"
            >
              <span
                class="offcanvas-mobile__back-button--icon"
                aria-hidden="true"
              >
                <NuxtIcon filled name="chevron-left" />
              </span>
              <span class="offcanvas-mobile__back-button--text">
                {{ selectedParent?.title }}
              </span>
            </button>
            <ul
              class="offcanvas-mobile__menu-items--subitems"
              :aria-label="selectedParent?.title"
            >
              <li
                v-for="(item, index) in subItems"
                :key="item.id ?? index"
                class="offcanvas-mobile__items-wrapper--subitems"
              >
                <NuxtLink
                  v-if="getMenuItemUrl(item)"
                  :to="getMenuItemUrl(item)"
                  class="offcanvas-mobile__item-link--subitems"
                >
                  {{ item.title }}
                </NuxtLink>
                <span v-else>{{ item.title }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
.offcanvas-mobile {
  position: fixed;
  top: var(--navigation-bar-height);
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: var(--color-white);
  text-transform: uppercase;

  &__top-level {
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item-link:focus-visible,
  &__item-link--subitems:focus-visible,
  &__back-button:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
    outline-offset: -2px;
  }

  &__item-link--subitems:focus-visible {
    outline-offset: 2px;
  }

  &__menu-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--color-gray-8);
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
    border: none;
    background: var(--color-white);
    text-transform: inherit;
    color: var(--color-text);
    font-family: var(--body-font-family);
    text-decoration: none;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    cursor: pointer;
    padding: 16px 24px;
    width: 100%;
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) 24px;
    column-gap: 8px;
    align-items: center;

    :deep(svg) {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    &--icon {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
    }

    &--text {
      grid-column: 2;
      min-width: 0;
      text-align: center;
      overflow-wrap: anywhere;
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
        color: var(--color-text);
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

    & + & .offcanvas-mobile__item-link {
      border-top: 1px solid var(--color-gray-20);
    }

    &--meta-menu {
      background: var(--color-gray-8);
      text-transform: none;
    }

    &--subitems {
      border-top: 1px solid var(--color-gray-20);
      padding: 16px 24px;
    }
  }

  &__item-link {
    border: none;
    text-align: left;
    text-transform: inherit;
    color: var(--color-text);
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

    &--meta-menu {
      letter-spacing: 1px;
      font-size: 14px;
      line-height: 18px;
      background-color: var(--color-gray-8);

      &:first-child {
        border-top: 1px solid var(--color-gray-20);
      }
    }
  }
}
</style>
