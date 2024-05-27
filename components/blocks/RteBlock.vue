<template>
  <div v-if="props.blockData.field_text !== null" class="rte">
    <BaseRte
      v-if="props.blockData.field_text"
      :content="props.blockData.field_text"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  blockData: Object,
});
</script>
