<script setup>
import { useSettingsDataStore } from '~/stores/settingsData';
const settingsDataStore = useSettingsDataStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

if (settingsDataStore.settingsData === null) {
  settingsDataStore.getSettingsData();
}

const siteLogo = computed(() => settingsDataStore.settingsData?.logo);

const isOpen = ref(false);
const activeNavItem = ref(null);
const handleNavigationItemClick = (item) => {
  if (item.below.length > 0) {
    if (isOpen.value && activeNavItem.value === item) {
      // Close the canvas if the same item is clicked again
      closeOffCanvas();
    } else {
      openOffCanvas(item);
    }
  } else {
    if (isOpen.value) {
      closeOffCanvas();
    }
    // Closing the canvas if the item has no children
    closeOffCanvas();
  }
};

const openOffCanvas = (item) => {
  isOpen.value = true;
  activeNavItem.value = item;
};

const closeOffCanvas = () => {
  isOpen.value = false;
  activeNavItem.value = null;
};

const isHeaderFixed = ref(false);
const lastScrollPosition = ref(0);
const scrollThreshold = 10;

const handleScroll = () => {
  // If off-canvas navigation is open, keep the header fixed
  if (isOpen.value) {
    isHeaderFixed.value = true;
    return;
  }

  const currentScrollPosition = window.pageYOffset;
  const scrollDifference = lastScrollPosition.value - currentScrollPosition;

  if (scrollDifference > scrollThreshold) {
    setTimeout(() => {
      isHeaderFixed.value = true;
    }, 100);
  } else if (scrollDifference < -scrollThreshold) {
    setTimeout(() => {
      isHeaderFixed.value = false;
    }, 100);
  }

  lastScrollPosition.value = currentScrollPosition;
};

const showMobileNavigation = ref(false);
const handleMobileNavigation = () => {
  document.body.style.overflow = showMobileNavigation.value ? 'auto' : 'hidden';
  showMobileNavigation.value = !showMobileNavigation.value;
};

const closeMobileNavigation = () => {
  document.body.style.overflow = 'auto';
  showMobileNavigation.value = false;
};

// on route change, close the off-canvas navigation
const route = useRoute();
watch(
  () => route.path,
  () => {
    closeOffCanvas();
    closeMobileNavigation();
  },
);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div ref="header" class="header__wrapper">
    <div
      class="header header--fixed"
      :class="{
        'slide-up': !isHeaderFixed && lastScrollPosition > 0,
        'slide-down': isHeaderFixed,
      }"
    >
      <div class="container">
        <div class="header__content">
          <div class="header__left">
            <NuxtLink v-if="siteLogo" to="/" aria-label="Gå til forsiden">
              <BaseLogo :logo="siteLogo" class="header__logo" />
            </NuxtLink>
          </div>

          <nav class="header__right-content" v-if="data">
            <NuxtLink
              v-for="(item, index) in data.primaernavigation.items"
              :key="index"
              :to="item.url ? item.url : 'javascript:void(0)'"
              class="header__button header__button--left"
              :class="{
                'header__button--active-text': activeNavItem === item,
              }"
              @click="handleNavigationItemClick(item)"
              :aria-label="'Link til ' + item.title"
            >
              <button class="header__link-text">
                {{ item.title }}
                <span
                  class="header__button--arrow"
                  :class="{
                    'header__button--rotate-arrow': activeNavItem === item,
                  }"
                  v-if="item.below.length > 0"
                >
                  <NuxtIcon filled name="chevron-down" />
                </span>
              </button>
              <ClientOnly>
                <Teleport to=".header-parent">
                  <TheOffCanvasDesktopNavigation
                    v-if="isOpen && activeNavItem === item"
                    :nested-items-data="item?.below"
                  />
                </Teleport>
              </ClientOnly>
            </NuxtLink>
          </nav>

          <div class="header__icon-wrapper">
            <button class="header__search">
              <NuxtIcon filled name="search" />
            </button>
            <button class="header__burger-menu" @click="handleMobileNavigation">
              <NuxtIcon
                filled
                :name="!showMobileNavigation ? 'hamburger' : 'close'"
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
            :data="props.data"
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
  background: var(--color-primary-lighten-3);
  border-bottom: 1px solid var(--color-gray-11);
  transition: transform 0.3s ease-in-out;

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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

    @media (--viewport-sm-min) {
      flex: 1;
    }
  }

  &__right-content {
    padding-top: 14px;
    display: none @(--md) flex;
  }

  /* Sliding the header up and down based on state */
  &.slide-up {
    transform: translateY(-100%);
  }

  &.slide-down {
    transform: translateY(0);
  }

  &__button {
    padding-bottom: 14px;
    margin: 0 10px 0 10px;
    color: var(--color-tertiary);
    white-space: nowrap;
    text-decoration: none;
    background: none;
    border: none;
    font-size: 18px;
    line-height: 24px;
    transition: all 0.3s;
    border-bottom: 2px solid transparent;

    &--active-text {
      border-bottom: 2px solid var(--color-primary);
    }

    &--arrow {
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

  &__link-text {
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-tertiary);
    text-transform: uppercase;
    font-weight: 600;
  }

  &__search {
    margin-left: 10px;
    padding: 12px;
    background: none;
    border: 1px solid var(--color-tertiary-lighten-4);
    border-radius: 50%;
    color: var(--color-tertiary);
    width: 52px;
    height: 52px;
  }

  &__burger-menu {
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: 12px;
    margin-left: 24px;
    border: none;
    border-radius: 50%;
    display: block @(--md) none;
    width: 52px;
    height: 52px;
  }

  &__icon-wrapper {
    display: flex;

    @media (--viewport-sm-max) {
      justify-content: flex-end;
      flex: 1;
    }
  }
}
</style>
