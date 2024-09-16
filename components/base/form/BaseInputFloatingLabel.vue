<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { Field, ErrorMessage, useFieldError } from 'vee-validate';

const props = withDefaults(
  defineProps<{
    type?: string | 'text' | 'password' | 'number' | 'tel' | 'url';
    name: string;
    description?: string
    rules?: string;
    label: string;
    inputMode?: string | 'none' | 'text ' | 'numeric' | 'tel' | 'url';
    modelValue: string;
    maxlength?: string;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validateOnInput?: boolean;
    validateOnModelUpdate?: boolean;
    customError?: string;
    isSearch?: boolean;
  }>(),
  {
    fieldType: 'input',
    type: 'text',
    name: '',
    description: '',
    inputMode: '',
    rules: '',
    label: '',
    modelValue: '',
    customError: '',
    validateOnInput: true,
    maxlength: '',
    isSearch: false,
  },
);

const autofilled = ref(false);
const input = ref(null);
const emit = defineEmits(['update:modelValue', 'blur', 'input', 'focus']);
const id = ref(uuidv4());

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});

const inputClass = computed(() => {
  return (value.value && value.value.toString().length > 0) || autofilled.value
    ? 'form-input--up'
    : '';
});

const checkAnimation = (e: any) => {
  if (e.animationName === 'onAutoFillStart') {
    autofilled.value = true;
  } else if (e.animationName === 'onAutoFillCancel') {
    autofilled.value = false;
  }
};

const hasErrors = useFieldError(props.name);
</script>

<template>
  <div class="form-input-wrapper">
    <Field
      :id="id"
      ref="input"
      v-model="value"
      as="input"
      :type="type"
      :rules="rules"
      :class="`form-input form-input--floating-label ${inputClass} ${hasErrors ? 'form-element-feedback--invalid' : ''}`"
      :label="label"
      :name="name"
      :autocomplete="$attrs.autocomplete"
      :maxlength="maxlength"
      :inputmode="inputMode"
      :validate-on-input="validateOnInput"
      :validate-on-blur="validateOnBlur"
      :validate-on-change="validateOnChange"
      :validate-on-model-update="validateOnModelUpdate"
      @blur="$emit('blur', value)"
      @focus="$emit('focus', value)"
      @input="$emit('input', value)"
      @animationstart="checkAnimation"
    />
    <label
      v-if="label"
      class="form-label"
      :class="props.isSearch ? 'form-label--search' : ''"
      :for="id"
    >
      <span class="form-input-icon" v-if="props.isSearch"
        ><NuxtIcon name="search" filled
      /></span>
      {{ label }}</label
    >
    <div v-if="description" class="form-description">
      {{ description }}
    </div>
  </div>
  <Transition name="bounce">
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
  </Transition>
</template>

<style lang="postcss" scoped>
.form-input-wrapper {
  position: relative;
}

.form-input--floating-label {
  position: relative;
  margin-top: -2px;
}

.form-input-icon {
  margin-top: -2px;
  padding-right: 2px;
  font-size: 24px;
}

.form-label {
  display: flex;
  align-items: center;

  &--search {
    margin-top: -4px !important;
  }
}

.form-input--up + .form-label,
.form-input:focus + .form-label {
  color: var(--color-primary);

  path {
    stroke: var(--color-primary);
  }
}

.form-description {
  padding-right: 26px;
  padding-left: 26px;
}
</style>
