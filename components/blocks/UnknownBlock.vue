<template>
  <div class="errorBlock">
    <h2>{{ pascalCase(blockData.bundle) }}Block doesn't exist yet</h2>
    <details>
      <summary>Block Data</summary>
      <pre>{{ blockData }}</pre>
    </details>
  </div>
</template>

<script setup>
import { pascalCase } from '~/utils/pascalCase';
const props = defineProps({
  blockData: Object,
});

console.log('UnknownBlock data', props.blockData);
</script>

<style lang="postcss" scoped>
.errorBlock {
  margin: 1rem 0;
  padding: 1rem;
  font-size: 16px;
  word-wrap: break-word;
  color: #00dc82;
  background-color: #020420;
}

summary {
  cursor: pointer;
}

pre {
  white-space: pre-wrap;
  font-weight: 600;
}
</style>
