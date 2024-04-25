<script setup lang="ts"></script>

<template>
  <div class="sharing">
    share content component
    <BaseButton
      icon="link"
      icon-after="arrow-right"
      :button-data="{ title: 'La mere' }"
    />

    <BaseButton icon="arrow-right" />
  </div>
</template>

<style lang="postcss" scoped>
.sharing {
  display: inline-block;
}
</style>
