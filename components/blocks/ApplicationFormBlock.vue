<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { pascalCase } from '~/utils/pascalCase';

const props = defineProps({
  blockData: Object,
});

const renderApplicationForm = (componentName: string) => {
  return defineAsyncComponent(() =>
    import(`@/components/blocks/application-form/${pascalCase(componentName)}.vue`)
      // If component doesnt exist, render a placeholder instead
      .catch((err) => {
        return import('~~/components/blocks/UnknownBlock.vue');
      }),
  );
};

</script>

<template>
  <div class="application-form-wrapper">
      <component
      :is="renderApplicationForm(props.blockData?.field_form_type)"
      v-if="props.blockData?.field_form_type"
      :block-data="props.blockData"
    />
    <pre>
      {{ props.blockData }}
    </pre>
  </div>
</template>

<style lang="postcss" scoped>

</style>
