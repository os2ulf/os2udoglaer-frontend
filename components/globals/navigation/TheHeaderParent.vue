<script setup lang="ts">
const { headerData, getHeaderData } = useHeaderData()

await getHeaderData()

const mainMenuData = computed(() => {
  const data = headerData.value
  if (!data) return null

  const mainKey = Object.keys(data).find(k => k.includes('main'))
  return mainKey ? data[mainKey] : null
})
</script>

<template>
  <div class="header-parent">
    <TheHeader v-if="mainMenuData" :data="mainMenuData" />
  </div>
</template>

<style lang="postcss" scoped>
.header-parent {
  height: var(--navigation-bar-height);
  background-color: var(--color-white);
}
</style>
