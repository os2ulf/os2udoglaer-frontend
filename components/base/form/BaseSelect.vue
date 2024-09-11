<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { Field, ErrorMessage } from 'vee-validate';

interface ISelectOptions {
  text: string;
  value: string;
}

const props = defineProps<{
  modelValue: string;
  options: ISelectOptions[];
  rules?: string;
  name: string;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  selectLabel?: string;
  customError?: string;
}>();

const emit = defineEmits(['update:modelValue']);
const id = ref(uuidv4());
const value = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="form-select-wrapper form-input-wrapper">
    <div>
      <label v-if="label" class="form-label" :for="id"
        >{{ props.label
        }}<span v-show="rules.includes('required')" class="required"
          >*</span
        ></label
      >
      <Field
        :id="id"
        v-model="value"
        class="form-select"
        :rules="rules"
        :name="name"
        as="select"
        :disabled="disabled"
        :multiple="props.multiple"
      >
        <option v-if="props.selectLabel" value="" disabled>
          {{ props.selectLabel }}
        </option>

        <option
          v-for="(option, index) in options"
          :key="index"
          :selected="props.modelValue === option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </Field>
    </div>

    <span
      v-if="customError"
      class="form-validation-feedback form-validation-feedback--invalid"
    >
      {{ customError }}
    </span>
    <ErrorMessage
      v-else
      class="form-validation-feedback form-validation-feedback--invalid"
      :name="name"
    />
  </div>
</template>
<style lang="postcss" scoped>
  .form-label {
    padding-left: 26px;
  }
</style>
