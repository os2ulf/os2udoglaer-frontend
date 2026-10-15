<script setup>
import {
  computed,
  nextTick,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import { useRoute } from 'vue-router';
import { NuxtLink } from '#components';
import { useSettingsData } from '~/composables/useSettingsData';
import { useNavigationDisclosure } from '~/composables/useNavigationDisclosure';
import {
  getFocusableElements,
  getMenuChildren,
  getMenuItems,
  getMenuItemUrl,
  hasMenuChildren,
} from '~/utils/navigation';

const props = defineProps({
  data: { type: Object, required: true },
});

const { settingsData, getSettingsData, setIsHeaderFixed } = useSettingsData();
if (!settingsData.value) await getSettingsData();

const siteLogo = computed(() => settingsData.value?.logo);
const mainMenuItems = computed(() => getMenuItems(props.data?.items));
const header = ref(null);
const mainNavigation = ref(null);
const mobileToggle = ref(null);
const {
  activeIndex,
  isOpen,
  toggle,
  close: closeOffCanvas,
  handleKeydown,
  handleFocusOut,
} = useNavigationDisclosure(mainNavigation);

const isDesktop = ref(true);
const isHeaderStuck = ref(false);
const isHeaderFixed = ref(false);
const hasHeaderFocus = ref(false);
const lastScrollPosition = ref(0);
const showMobileNavigation = ref(false);
let scrollTimer;
let documentFocusOutTimer;
let lastFocusedMenuElement;

const keepHeaderVisible = computed(
  () =>
    isHeaderFixed.value ||
    hasHeaderFocus.value ||
    isOpen.value ||
    showMobileNavigation.value,
);
const initialHeaderClass = computed(() =>
  !isDesktop.value || isHeaderStuck.value
    ? 'header--fixed'
    : 'header--relative',
);
const getMobileMenu = () => document.getElementById('mobile-menu');

const handleScroll = () => {
  const currentPosition = document.documentElement.scrollTop;
  const difference = lastScrollPosition.value - currentPosition;
  const threshold = isDesktop.value ? 40 : 20;
  isHeaderStuck.value = currentPosition >= (isDesktop.value ? 50 : 0);
  setIsHeaderFixed(isHeaderStuck.value);
  lastScrollPosition.value = currentPosition;
  clearTimeout(scrollTimer);

  if (isOpen.value || showMobileNavigation.value || hasHeaderFocus.value) {
    isHeaderFixed.value = true;
    return;
  }

  if (Math.abs(difference) > threshold) {
    scrollTimer = setTimeout(() => {
      isHeaderFixed.value = difference > 0;
    }, 100);
  }
};

const closeMobileNavigation = async (restoreFocus = false) => {
  showMobileNavigation.value = false;
  if (restoreFocus) {
    await nextTick();
    mobileToggle.value?.focus();
  }
};

const handleMobileNavigation = () => {
  if (showMobileNavigation.value) {
    closeMobileNavigation(true);
  } else {
    closeOffCanvas();
    showMobileNavigation.value = true;
  }
};

const handleMobileToggleTab = (event) => {
  if (!event.shiftKey && showMobileNavigation.value) {
    const firstItem = getFocusableElements(getMobileMenu())[0];
    if (firstItem) {
      event.preventDefault();
      firstItem.focus();
    }
  }
};

const handleMobileMenuExit = async () => {
  const menu = getMobileMenu();
  const focusable = getFocusableElements(document);
  const toggleIndex = focusable.indexOf(mobileToggle.value);
  const nextElement = focusable
    .slice(toggleIndex + 1)
    .find((element) => !menu?.contains(element));
  await closeMobileNavigation();
  await nextTick();
  (nextElement ?? document.getElementById('main-content'))?.focus();
};

const updateHeaderFocus = (target) => {
  const menu = getMobileMenu();
  hasHeaderFocus.value = Boolean(
    header.value?.contains(target) || menu?.contains(target),
  );

  if (
    showMobileNavigation.value &&
    !menu?.contains(target) &&
    target !== mobileToggle.value
  ) {
    closeMobileNavigation();
  }
};

const handleDocumentFocus = () => {
  clearTimeout(documentFocusOutTimer);
  const target = document.activeElement;

  // CSS can hide a focused desktop control before the resize event fires.
  if (
    target !== document.body ||
    lastFocusedMenuElement?.getClientRects().length
  ) {
    lastFocusedMenuElement =
      mainNavigation.value?.contains(target) ||
      document.querySelector('.meta-menu')?.contains(target) ||
      getMobileMenu()?.contains(target) ||
      mobileToggle.value?.contains(target)
        ? target
        : null;
  }

  updateHeaderFocus(target);
};

const handleDocumentFocusOut = (event) => {
  clearTimeout(documentFocusOutTimer);

  if (event.relatedTarget instanceof Node) {
    updateHeaderFocus(event.relatedTarget);
    return;
  }

  documentFocusOutTimer = setTimeout(handleDocumentFocus, 0);
};

const handleOutsidePointerDown = (event) => {
  if (
    !mainNavigation.value?.contains(event.target) &&
    !document.querySelector('.meta-menu')?.contains(event.target) &&
    !getMobileMenu()?.contains(event.target) &&
    !mobileToggle.value?.contains(event.target)
  ) {
    lastFocusedMenuElement = null;
  }

  if (
    showMobileNavigation.value &&
    !getMobileMenu()?.contains(event.target) &&
    !mobileToggle.value?.contains(event.target)
  ) {
    closeMobileNavigation();
  }
};

const handleWindowResize = () => {
  const activeElement = document.activeElement;
  const focusTarget =
    activeElement === document.body &&
    lastFocusedMenuElement &&
    !lastFocusedMenuElement.getClientRects().length
      ? lastFocusedMenuElement
      : activeElement;
  const focusInMobileMenu = getMobileMenu()?.contains(focusTarget);
  const focusInDesktopMenu =
    mainNavigation.value?.contains(focusTarget) ||
    document.querySelector('.meta-menu')?.contains(focusTarget);
  isDesktop.value = window.innerWidth >= 992;

  if (isDesktop.value) {
    if (showMobileNavigation.value) closeMobileNavigation();
    if (focusInMobileMenu || focusTarget === mobileToggle.value) {
      nextTick(() =>
        getFocusableElements(mainNavigation.value)[0]?.focus({
          preventScroll: true,
        }),
      );
    }
  } else if (!isDesktop.value) {
    closeOffCanvas();
    if (focusInDesktopMenu) {
      nextTick(() => mobileToggle.value?.focus({ preventScroll: true }));
    }
  }

  handleScroll();
};

const route = useRoute();
watch(
  () => route.path,
  () => {
    const focusWasInMenu =
      mainNavigation.value?.contains(document.activeElement) ||
      getMobileMenu()?.contains(document.activeElement);
    closeOffCanvas();
    closeMobileNavigation();
    nextTick(() => {
      if (focusWasInMenu) {
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
      handleDocumentFocus();
    });
  },
);

onMounted(() => {
  handleWindowResize();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleWindowResize);
  document.addEventListener('focusin', handleDocumentFocus);
  document.addEventListener('focusout', handleDocumentFocusOut);
  document.addEventListener('pointerdown', handleOutsidePointerDown);
});

onBeforeUnmount(() => {
  clearTimeout(scrollTimer);
  clearTimeout(documentFocusOutTimer);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleWindowResize);
  document.removeEventListener('focusin', handleDocumentFocus);
  document.removeEventListener('focusout', handleDocumentFocusOut);
  document.removeEventListener('pointerdown', handleOutsidePointerDown);
});
</script>

<template>
  <div ref="header" class="header__wrapper">
    <div
      class="header"
      :class="[
        initialHeaderClass,
        {
          'slide-up': !keepHeaderVisible && lastScrollPosition > 50,
          'slide-down': keepHeaderVisible,
        },
      ]"
    >
      <div class="container">
        <div class="header__content">
          <div class="header__left">
            <NuxtLink
              class="header__link-logo"
              to="/"
              aria-label="Gå til forsiden"
            >
              <BaseLogo :logo="siteLogo ?? ''" class="header__logo" />
            </NuxtLink>
          </div>

          <nav
            ref="mainNavigation"
            class="header__right-content"
            aria-label="Hovedmenu"
            @keydown="handleKeydown"
            @focusout="handleFocusOut"
          >
            <ul class="header__menu">
              <li
                v-for="(item, index) in mainMenuItems"
                :key="item.id ?? index"
                class="header__menu-item"
              >
                <component
                  :is="
                    hasMenuChildren(item)
                      ? 'button'
                      : getMenuItemUrl(item)
                        ? NuxtLink
                        : 'span'
                  "
                  :id="'main-menu-trigger-' + index"
                  :type="hasMenuChildren(item) ? 'button' : undefined"
                  :to="hasMenuChildren(item) ? undefined : getMenuItemUrl(item)"
                  class="header__button header__button--left"
                  :class="{
                    'header__button--active-text': activeIndex === index,
                  }"
                  :aria-expanded="
                    hasMenuChildren(item) ? activeIndex === index : undefined
                  "
                  :aria-controls="
                    hasMenuChildren(item)
                      ? 'main-menu-submenu-' + index
                      : undefined
                  "
                  @click="
                    hasMenuChildren(item)
                      ? toggle(index, $event)
                      : closeOffCanvas()
                  "
                >
                  <span class="header__link-text">
                    {{ item.title }}
                    <span
                      v-if="hasMenuChildren(item)"
                      class="header__button--arrow"
                      :class="{
                        'header__button--rotate-arrow': activeIndex === index,
                      }"
                      aria-hidden="true"
                    >
                      <NuxtIcon filled name="chevron-down" />
                    </span>
                  </span>
                </component>
                <TheOffCanvasDesktopNavigation
                  v-if="hasMenuChildren(item)"
                  :id="'main-menu-submenu-' + index"
                  :aria-labelledby="'main-menu-trigger-' + index"
                  :hidden="activeIndex !== index"
                  class="header__offcanvas"
                  :nested-items-data="getMenuChildren(item)"
                />
              </li>
            </ul>
          </nav>

          <div class="header__icon-wrapper">
            <ClientOnly>
              <TheGlobalSearch />
            </ClientOnly>
            <button
              ref="mobileToggle"
              type="button"
              class="header__burger-menu"
              aria-controls="mobile-menu"
              :aria-label="showMobileNavigation ? 'Luk menu' : 'Åbn menu'"
              :aria-expanded="showMobileNavigation"
              @click="handleMobileNavigation"
              @keydown.tab="handleMobileToggleTab"
            >
              <NuxtIcon
                filled
                :name="showMobileNavigation ? 'close' : 'hamburger'"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <ClientOnly>
      <Teleport to=".header-parent">
        <Transition name="slide-left">
          <TheOffCanvasMobileNavigation
            v-if="showMobileNavigation"
            @close="closeMobileNavigation"
            @exit="handleMobileMenuExit"
          />
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style lang="postcss" scoped>
.header {
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 10;
  width: 100%;
  height: var(--navigation-bar-height);
  background: var(--color-white);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  &__link-logo {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;

    &:hover {
      opacity: 0.8;
    }
  }

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  &--relative {
    position: relative;
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-right: 10px;

    @media (min-width: 768px) {
      flex: 1;
    }
  }

  &__right-content {
    padding-top: 14px;
    display: none;
    flex-wrap: wrap;

    @media (min-width: 992px) {
      display: flex;
    }
  }

  &__menu {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Dropdowns are positioned against the header, rather than each list item. */
  &__menu-item {
    position: static;
  }

  /* Sliding the header up and down based on state */
  &.slide-up {
    transform: translateY(-100%);
  }

  &.slide-down {
    transform: translateY(0);
  }

  &__button {
    display: inline-flex;
    padding: 0 0 14px;
    margin: 0 10px 0 10px;
    color: var(--color-text);
    white-space: nowrap;
    text-decoration: none;
    background: none;
    border: none;
    font-size: 18px;
    font-family: inherit;
    line-height: 24px;
    transition: all 0.3s;
    border-bottom: 2px solid transparent;

    &--active-text {
      border-bottom: 2px solid var(--color-primary);
    }

    &--arrow {
      margin-left: 4px;

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

    &:hover {
      opacity: 0.8;
    }
  }

  &__button:focus-visible,
  &__link-logo:focus-visible,
  &__burger-menu:focus-visible {
    outline: -webkit-focus-ring-color auto 1px;
    outline-offset: 2px;
  }

  &__link-text {
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-text);
    text-transform: uppercase;
    font-weight: 600;
    display: inline-flex;
    align-items: center;

    :deep(svg) {
      font-size: 24px;
    }
  }

  &__burger-menu {
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: 12px;
    margin-left: 24px;
    border: none;
    border-radius: 50%;
    display: block;
    width: 48px;
    height: 48px;

    @media (min-width: 992px) {
      display: none;
    }

    :deep(svg) {
      font-size: 24px;
    }
  }

  &__icon-wrapper {
    display: flex;

    @media (max-width: 991px) {
      justify-content: flex-end;
      flex: 1;
    }
  }
}
</style>
