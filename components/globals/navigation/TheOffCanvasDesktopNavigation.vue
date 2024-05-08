<script setup lang="ts">
const props = defineProps({
  nestedItemsData: {
    type: Object,
    required: true,
    default: null,
  },
});

const navigationMenuData = props.nestedItemsData;
</script>

<template>
  <div v-if="navigationMenuData" class="offcanvas">
    <div class="container">
      <div class="row">
        <HeaderItem
          class="col-xs-12 col-sm-12 col-md-3"
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
  margin-top: var(--navigation-bar-height);
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
