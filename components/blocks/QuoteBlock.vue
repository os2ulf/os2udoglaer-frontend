<template>
  <div class="quote">
    <p>{{ blockData.field_quote_text }}</p>
    <div v-if="blockData.field_quote_source" class="quote__author">
      {{ blockData.field_quote_source }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<style lang="postcss" scoped>
.quote {
  position: relative;
  font-weight: 300;
  font-size: 12px;
}

.quote > p {
  display: inline;
}

@media (--viewport-md-min) {
  .quote {
    font-weight: 500;
    font-size: 17px;
  }
}

.quote .icon--quote {
  width: 14px;
  height: 18px;
  transform: translateY(-50%);
  opacity: 0.5;
}

@media (--viewport-md-min) {
  .quote .icon--quote {
    width: 20px;
    height: 24px;
  }
}

.quote__author {
  padding-left: 40px;
  font-size: 16px;
  font-style: italic;
}
</style>
