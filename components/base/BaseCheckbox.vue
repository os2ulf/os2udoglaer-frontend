<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ErrorMessage, useFieldError } from 'vee-validate';

const props = withDefaults(
  defineProps<{
    modelValue: boolean | null | any | any[] | undefined;
    rules?: string;
    name: string;
    value?: string | number;
    flipped?: boolean;
    hasError?: boolean;
    disabled?: boolean;
    customError?: string;
  }>(),
  {
    name: '',
    rules: '',
    value: '',
    customError: '',
  },
);

const emit = defineEmits(['update:modelValue']);
const id = ref(uuidv4());
const hasErrors = useFieldError(props.name);
const isPressed = ref(false);

const isChecked = computed(() => {
  if (props.modelValue instanceof Array) {
    return props.modelValue.includes(props.value);
  }
  // Note that `true-value` and `false-value` are camelCase in the JS
  return props.modelValue === !props.flipped;
});

const modifierClasses = computed(() => {
  const modifiers = [];

  if (hasErrors) {
    modifiers.push('form-element-feedback--invalid');
  }

  if (isPressed.value) {
    modifiers.push('pressed');
  }

  return modifiers;
});

const updateValue = (event: any) => {
  const isChecked = event.target.checked;
  removePressedState();

  if (props.modelValue instanceof Array) {
    const newValue = [...props.modelValue];

    if (isChecked) {
      newValue.push(props.value);
    } else {
      newValue.splice(newValue.indexOf(props.value), 1);
    }

    emit('update:modelValue', newValue);
  } else {
    emit('update:modelValue', isChecked === !props.flipped);
  }
};

const setPressedState = () => {
  isPressed.value = true;
};

const removePressedState = () => {
  isPressed.value = false;
};
</script>

<template>
  <div>
    <div class="form-checkbox">
      <input
        :id="id"
        type="checkbox"
        class="form-checkbox-input"
        :class="[modifierClasses, { 'checkbox--has-error': props.hasError }]"
        :checked="isChecked"
        :value="value"
        :disabled="disabled"
        :name="props.name"
        @input="updateValue"
      />
      <label
        class="form-checkbox-label"
        :for="id"
        @mousedown="setPressedState"
        @mouseup="removePressedState"
        @mouseout="removePressedState"
        ><slot></slot
        ><span v-show="rules.includes('required')" class="required"
          >*</span
        ></label
      >
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
