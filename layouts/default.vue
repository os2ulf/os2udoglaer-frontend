<template>
  <TheMetaMenu />
  <TheHeaderParent />
  <div class="app">
    <slot></slot>
  </div>
  <TheFooterParent />
  <TheModal />
  <GlobalScriptInjections />
</template>
