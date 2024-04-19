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
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  min-height: 60px;
  padding: 14px 24px;
  overflow: hidden;
  font-weight: 600;
  font-family: var(--heading-font-family);
  border-radius: 100px;
  cursor: pointer;
}

.button--ghost {
  border: 1px solid var(--color-gray-16);
}

.button--normal {
  color: var(--color-white);
}

.button--center {
  left: 50%;
  transform: translateX(-50%);
}

.button--right {
  left: 100%;
  transform: translateX(-100%);
}
</style>
