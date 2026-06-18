<script setup lang="ts">
</script>
<template>
  <header>
    <a
      href="#main-content"
      class="skip-link"
    >
      Hop til primært indhold
    </a>

    <TheMetaMenu />
    <TheHeaderParent />
  </header>

  <main id="main-content" class="app" tabindex="-1">
    <slot></slot>
  </main>

  <footer>
    <TheFooterParent />
  </footer>

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