<template>
  <div
    v-if="blockData.field_button !== null"
    :class="['layout-block--' + blockData.bundle]"
  >
    <NuxtLink
      :target="
        blockData.field_button?.target ? blockData.field_button?.target : ''
      "
      :to="blockData.field_button?.url"
      :class="[
        'button' +
          ' ' +
          blockData.field_button?.class +
          ' ' +
          'button--' +
          blockData.field_button_alignment,
      ]"
    >
      {{ blockData.field_button?.title }}
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<style lang="postcss" scoped>
.button {
  min-width: 150px;
  min-height: 56px;
}
</style>
