<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

console.log('data', props.data);

const showSubItems = ref(false);
const subItems = ref([]);
const selectedParentItem = ref(null);

const handleItemClick = (node: any) => {
  if (node.below.length > 0) {
    subItems.value = node.below;
    selectedParentItem.value = node;
    showSubItems.value = true;
  }
};

const goBack = () => {
  showSubItems.value = false;
  subItems.value = [];
  selectedParentItem.value = null;
};

const backButtonLabel = computed(() => {
  return `${selectedParentItem?.value?.title}`;
});

const navigationMenuData = props.data.primaernavigation;
</script>

<template>
  <div class="offcanvas-mobile">
    <div class="offcanvas-mobile__menu-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 col-xs-12 col-md-12">
            <Transition name="slide-right">
              <div v-if="!showSubItems" class="offcanvas-mobile__menu-wrapper">
                <li class="offcanvas-mobile__items-wrapper">
                  <NuxtLink
                    v-for="node in navigationMenuData.items"
                    :key="node.id"
                    class="offcanvas-mobile__item-link"
                    @click="handleItemClick(node)"
                    :to="node.url"
                  >
                    {{ node.title }}
                    <span v-if="node.below.length > 0">
                      <NuxtIcon filled name="chevron-right"
                    /></span>
                  </NuxtLink>
                </li>
              </div>
            </Transition>

            <Transition name="slide">
              <div
                v-if="showSubItems"
                class="offcanvas-mobile__menu-wrapper--subitems"
              >
                <NuxtLink class="offcanvas-mobile__back-button" @click="goBack">
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
                      :to="subNode?.url"
                      class="offcanvas-mobile__item-link--subitems"
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
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    &--subitems {
      height: 100%;
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
    padding: 16px 0 0 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

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
      padding: 16px 0;
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

    &--subitems {
      border-top: 1px solid var(--color-tertiary-lighten-4);
      padding: 16px 0;
    }
  }

  &__item-link {
    color: var(--color-tertiary);
    font-family: var(--body-font-family);
    text-decoration: none;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    width: fit-content;
    cursor: pointer;
    padding: 16px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:not(:first-child) {
      border-top: 1px solid var(--color-tertiary-lighten-4);
    }
  }
}
</style>
