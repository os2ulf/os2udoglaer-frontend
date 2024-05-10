<script setup lang="ts">
const props = defineProps({
  nestedItemsData: {
    type: Object,
    required: true,
    default: null,
  },
  isMetaMenuHidden: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const navigationMenuData = props.nestedItemsData;

const currentScrollPosition = ref(0);
const handleScrollPos = () => {
  currentScrollPosition.value = window.pageYOffset;
};
// this is done to avoid the flickering effect when the user scrolls up when the meta menu is present
// 49 = height of the metamenu -1px
const computedMarginTop = computed(() => {
  if (currentScrollPosition.value <= 49 && !props.isMetaMenuHidden) {
    return `${-currentScrollPosition.value}px`;
  } else {
    return '';
  }
});

onMounted(() => {
  window.addEventListener('scroll', handleScrollPos);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScrollPos);
});
</script>

<template>
  <div
    v-if="navigationMenuData"
    class="offcanvas"
    :class="props.isMetaMenuHidden ? 'offcanvas__meta-menu--hidden' : ''"
    :style="{ marginTop: computedMarginTop }"
  >
    <div class="container">
      <div class="row">
        <HeaderItem
          class="col-xs-6 col-sm-4 col-md-3"
          v-for="(node, index) in navigationMenuData"
          :key="index"
          :node="node"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.offcanvas {
  position: fixed;

  &__meta-menu--hidden {
    margin-top: calc(
      var(--navigation-bar-height) - var(--meta-navigation-bar-height)
    );
  }

  background: var(--color-white);
  z-index: 999;
  width: 100%;
  padding: 56px 0;
  box-shadow: 0px 4px 30px 0px #0000001a;

  &__menu {
    display: flex;
    margin: 0;
  }
}
</style>
