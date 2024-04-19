<script setup lang="ts">
import { useField } from 'vee-validate';
import { generateGuid } from '~~/utils';

const props = defineProps<{
  modelValue?: boolean | number | string;
  required?: boolean;
  name: string;
  value?: string | number;
  modifiers?: Array<string>;
  disabled?: boolean;
  hasError?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const id = ref(generateGuid());

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const modifierClasses = computed(() => {
  return props.modifiers
    ? props.modifiers.map((x) => `radio__label--${x}`).join(' ')
    : null;
});

const { $t } = useNuxtApp();
if (props.required) {
  function isRequired() {
    if (props.modelValue) {
      return true;
    }
    return `${$t('Form.ValidationError.Required')}`;
  }
  useField(props.name, isRequired);
}
</script>

<template>
  <div class="radio-container">
    <input
      :id="id"
      v-model="value"
      type="radio"
      class="radio"
      :name="name"
      :value="props.value"
      :class="{ 'radio--has-error': props.hasError }"
      :disabled="disabled"
    />
    <label :for="id" :class="modifierClasses" class="radio__label">
      <slot>
        {{ $attrs.label }}
      </slot>
    </label>
  </div>
</template>
<style lang="postcss" scoped>
.radio-container {
  position: relative;
}

.radio {
  position: absolute;
  top: -9999px;
  left: -9999px;
  visibility: hidden;

  &:checked + .radio__label::after {
    opacity: 1;
  }

  &:disabled + .radio__label {
    color: var(--color-gray-50);
    cursor: default;
  }

  &:disabled + .radio__label::before {
    border: 1px solid var(--color-gray-50);
  }

  &--has-error + .radio__label,
  &--has-error + .radio__label::before {
    color: var(--color-danger-darker) !important;
    border-color: var(--color-danger-darker) !important;
  }

  &__label {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 20px;
    padding-left: 30px;
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    cursor: pointer;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    &--large {
      font-size: 14px;
    }

    &::after {
      position: absolute;
      top: 50%;
      left: 3px;
      width: 12px;
      height: 12px;
      background: black;
      border-radius: 100%;
      transform: translateY(-50%);
      opacity: 0;
      transition: all 0.2s ease;
      content: '';
    }

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 18px;
      height: 18px;
      background-color: transparent;
      border: 1px solid black;
      border-radius: 100%;
      transform: translateY(-50%);
      content: '';
    }
  }
}
</style>
