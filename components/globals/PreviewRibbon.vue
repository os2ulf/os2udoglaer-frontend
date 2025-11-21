<script></script>

<template>
  <div class="preview-ribbon">
    <span class="preview-ribbon__base">Preview</span>
  </div>
</template>

<style lang="postcss" scoped>
.preview-ribbon {
  right: 0;
  top: 0;
  position: fixed;
  overflow: hidden;
  width: 170px;
  height: 170px;
  text-align: right;
  z-index: 100000;
  pointer-events: none;


  &__base {
    position: absolute;
    top: 50px;
    right: -60px;
    display: block;
    width: 250px;
    padding-bottom: 2px;
    transform: rotate(45deg);
    font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
    text-align: center;
    line-height: 34px;
    background: #1e5799;
    background: linear-gradient(#2989d8 0%, #1e5799 100%);
    box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
    opacity: 0.9;
  }
}
</style>
