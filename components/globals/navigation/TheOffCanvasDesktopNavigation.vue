<script setup lang="ts">
import type { PropType } from 'vue';
import type { NavigationItem } from '~/utils/navigation';

const props = defineProps({
  nestedItemsData: {
    type: Array as PropType<NavigationItem[]>,
    required: true,
  },
});
</script>

<template>
  <div class="offcanvas" role="group">
    <div class="container">
      <ul class="row offcanvas__items">
        <HeaderItem
          v-for="(node, index) in props.nestedItemsData"
          :key="node.id ?? index"
          class="col-xs-6 col-sm-4 col-md-3"
          :node="node"
        />
      </ul>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.offcanvas {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-white);
  z-index: 999;
  width: 100%;
  padding: 56px 0;
  box-shadow: 0 4px 30px 0 #0000001a;
  animation: slide-top-offcanvas 0.3s;

  &__items {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0;
    list-style: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}
</style>
