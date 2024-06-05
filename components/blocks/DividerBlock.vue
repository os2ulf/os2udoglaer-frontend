<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<template>
  <div class="divider"></div>
</template>

<style lang="postcss" scoped>
.divider {
  margin: 28px 0;
  border-top: 1px solid var(--color-primary);

  /* There are 2 dividers in the design but in the AC its not mentioned which should be used
  var for grey one - --color-base-divider
  when/if grey is used add this opacity too: opacity: 0.4;
  var for primary one - --color-primary
   */
}
</style>
