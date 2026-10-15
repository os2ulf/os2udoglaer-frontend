<script setup>
import { NuxtLink } from '#components';
import { useHeaderData } from '~/composables/useHeaderData';
import { useSettingsData } from '~/composables/useSettingsData';
import { useNavigationDisclosure } from '~/composables/useNavigationDisclosure';
import {
  getMenuChildren,
  getMenuItems,
  getMenuItemUrl,
  hasMenuChildren,
} from '~/utils/navigation';

const { headerData, getHeaderData } = useHeaderData();
const { isHeaderFixed } = useSettingsData();
await getHeaderData();

const metaMenuItems = computed(() => {
  const data = headerData.value;
  const metaKey = Object.keys(data ?? {}).find((key) => key.includes('meta'));
  return getMenuItems(metaKey ? data[metaKey]?.items : null);
});
const metaNavigation = ref(null);
const { activeIndex, toggle, close, handleKeydown, handleFocusOut } =
  useNavigationDisclosure(metaNavigation);

watch(isHeaderFixed, (fixed) => {
  if (
    import.meta.client &&
    fixed &&
    !metaNavigation.value?.contains(document.activeElement)
  ) {
    close();
  }
});

const route = useRoute();
watch(
  () => route.path,
  () => {
    const focusWasInMenu =
      import.meta.client &&
      metaNavigation.value?.contains(document.activeElement);
    close();
    if (focusWasInMenu) {
      nextTick(() =>
        document.getElementById('main-content')?.focus({ preventScroll: true }),
      );
    }
  },
);
</script>

<template>
  <nav
    ref="metaNavigation"
    class="meta-menu"
    aria-label="Metamenu"
    @keydown="handleKeydown"
    @focusout="handleFocusOut"
  >
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-xs-12 col-md-12">
          <ul class="meta-menu__items-wrapper">
            <li
              v-for="(item, index) in metaMenuItems"
              :key="item.id ?? index"
              class="meta-menu__entry"
            >
              <component
                :is="
                  hasMenuChildren(item)
                    ? 'button'
                    : getMenuItemUrl(item)
                      ? NuxtLink
                      : 'span'
                "
                :id="'meta-menu-trigger-' + index"
                :type="hasMenuChildren(item) ? 'button' : undefined"
                :to="hasMenuChildren(item) ? undefined : getMenuItemUrl(item)"
                class="meta-menu__item"
                :class="{ 'meta-menu__item--active': activeIndex === index }"
                :aria-expanded="
                  hasMenuChildren(item) ? activeIndex === index : undefined
                "
                :aria-controls="
                  hasMenuChildren(item)
                    ? 'meta-menu-submenu-' + index
                    : undefined
                "
                @click="hasMenuChildren(item) ? toggle(index, $event) : close()"
              >
                <span class="meta-menu__item-wrapper">
                  {{ item.title }}
                  <NuxtIcon
                    v-if="hasMenuChildren(item)"
                    class="meta-menu__item--arrow"
                    :class="{
                      'meta-menu__item--rotate-arrow': activeIndex === index,
                    }"
                    filled
                    name="chevron-down"
                    aria-hidden="true"
                  />
                </span>
              </component>
              <TheOffCanvasMetaMenu
                v-if="hasMenuChildren(item)"
                :id="'meta-menu-submenu-' + index"
                :aria-labelledby="'meta-menu-trigger-' + index"
                :hidden="activeIndex !== index"
                :nested-items="getMenuChildren(item)"
              />
            </li>
          </ul>
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
    margin: 0;
    padding: 0;
    list-style: none;

    :deep(svg) {
      font-size: 24px;
    }
  }

  &__entry {
    position: relative;
    display: flex;

    &:last-child .meta-menu__item {
      padding-right: 0;
    }
  }

  &__item {
    color: var(--color-text);
    background: transparent;
    border: none;
    font-family: inherit;
    text-align: left;
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

    &:hover {
      color: var(--color-primary);
    }

    &:focus-visible {
      outline: -webkit-focus-ring-color auto 1px;
      outline-offset: -2px;
    }
  }
}
</style>
