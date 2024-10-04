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
const scrollThreshold = ref(window?.innerWidth > 991 ? 40 : 20);
const metaMenuHeight = ref(window?.innerWidth > 991 ? 50 : 0);

const isMetaMenuHidden = ref(false);

const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset;
  const scrollDifference = lastScrollPosition.value - currentScrollPosition;

  if (currentScrollPosition >= metaMenuHeight.value) {
    document.querySelector('.header').classList.remove('header--relative');
    document.querySelector('.header').classList.add('header--fixed');
    isMetaMenuHidden.value = true;
    settingsDataStore.setIsHeaderFixed(true);
  } else {
    document.querySelector('.header').classList.remove('header--fixed');
    document.querySelector('.header').classList.add('header--relative');
    isMetaMenuHidden.value = false;
    settingsDataStore.setIsHeaderFixed(false);
  }

  // If off-canvas navigation is open, keep the header fixed
  if (isOpen.value) {
    isHeaderFixed.value = true;
    return;
  }

  if (scrollDifference > scrollThreshold.value) {
    setTimeout(() => {
      isHeaderFixed.value = true;
    }, 100);
  } else if (scrollDifference < -scrollThreshold.value) {
    setTimeout(() => {
      isHeaderFixed.value = false;
    }, 100);
  }

  lastScrollPosition.value = currentScrollPosition;
};

const showMobileNavigation = ref(false);
const handleMobileNavigation = () => {
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

const initialHeaderClass = ref('');
const handleWindowResize = () => {
  initialHeaderClass.value =
    window?.innerWidth > 991 ? 'header--relative' : 'header--fixed';
};

onMounted(() => {
  handleWindowResize();
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div ref="header" class="header__wrapper">
    <div
      class="header"
      :class="[
        initialHeaderClass,
        {
          'slide-up': !isHeaderFixed && lastScrollPosition > 50,
          'slide-down': isHeaderFixed,
        },
      ]"
    >
      <div class="container">
        <div class="header__content">
          <div class="header__left">
            <NuxtLink
              class="header__link-logo"
              v-if="siteLogo"
              to="/"
              aria-label="Gå til forsiden"
            >
              <BaseLogo :logo="siteLogo" class="header__logo" />
            </NuxtLink>
          </div>

          <nav class="header__right-content" v-if="data">
            <NuxtLink
              v-for="(item, index) in data.primaernavigation_2?.items"
              :key="index"
              :to="
                item?.link?.url && item?.below?.length === 0
                  ? item?.link?.url
                  : 'javascript:void(0)'
              "
              class="header__button header__button--left"
              :class="{
                'header__button--active-text': activeNavItem === item,
              }"
              @click="handleNavigationItemClick(item)"
              :aria-label="'Link til ' + item.title"
              :role="!item?.link?.url ? 'button' : ''"
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
                  <Transition name="slide-top-offcanvas">
                    <TheOffCanvasDesktopNavigation
                      class="header__offcanvas"
                      v-if="isOpen && activeNavItem === item"
                      :isMetaMenuHidden="isMetaMenuHidden"
                      :nested-items-data="item?.below"
                    />
                  </Transition>
                </Teleport>
              </ClientOnly>
            </NuxtLink>
          </nav>

          <div class="header__icon-wrapper">
            <ClientOnly>
              <TheGlobalSearch />
            </ClientOnly>

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

    @media (--viewport-sm-min) {
      flex: 1;
    }
  }

  &__right-content {
    padding-top: 14px;
    display: none @(--md) flex;
    flex-wrap: wrap;
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

  &__link-text {
    padding: 0;
    background: transparent;
    border: none;
    color: var(--color-tertiary);
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
    display: block @(--md) none;
    width: 48px;
    height: 48px;

    :deep(svg) {
      font-size: 24px;
    }
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
