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
  min-height: 56px;
  padding: 16px 32px;
  overflow: hidden;
  font-weight: 700;
  font-family: var(--heading-font-family);
  border-radius: 100px;
  cursor: pointer;
  word-break: break-word;
}

.button--ghost {
  border: 1px solid var(--color-primary-lighten-3);
  color: var(--color-primary);
  background-color: transparent;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: var(--color-primary);
    background-color: var(--color-white);
    border: 1px solid var(--color-white);
  }
}

.button--normal {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: 1px solid transparent;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: var(--color-primary-darken-2);
  }
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
