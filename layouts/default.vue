<script setup lang="ts">
const skipLink = ref(null)
const mainContent = ref(null)

function scrollToContent() {
  if (mainContent.value) {
    mainContent.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    skipLink.value.blur() // hide link after activation
  }
}
</script>
<template>
  <a
    href="#"
    aria-label="Skip to main content"
    class="skip-link"
    @click.prevent="scrollToContent"
    ref="skipLink"
  >
    Hop til primært indhold
  </a>
  <TheMetaMenu />
  <TheHeaderParent />
  <div class="app" ref="mainContent">
    <slot></slot>
  </div>
  <TheFooterParent />
  <TheModal />
  <GlobalScriptInjections />
</template>

<style lang="postcss">
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  z-index: 100;
  transition: top 0.3s;
  outline: none;
}

.skip-link:focus {
  top: 0;
}

.skip-link:focus-visible {
  outline: 2px solid #fff;
}
</style>