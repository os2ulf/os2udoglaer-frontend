<script setup>
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4();
const props = defineProps({
  id: String,
  type: {
    type: String,
    default: 'checkbox',
  },
  placeholder: String,
  label: String,
  description: String,
  modelValue: Boolean,
  isError: String,
  maxlength: Number,
});
const emit = defineEmits(['update:modelValue']);

const handleChange = (event) => {
  emit('update:modelValue', event.target.checked);
};
</script>

<template>
  <div class="form-input-wrapper input__wrapper">
    <label :for="id">
      <input
        @change="handleChange"
        :checked="modelValue"
        :id="id"
        :maxlength="maxlength"
        :type="type"
        :placeholder="placeholder"
        :class="isError ? 'input__error' : ''"
      />
      <span :class="'label--' + type">{{ label }}</span>
    </label>
    <div v-if="description" class="form-description">
      {{ description }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.input__error {
  border: 1px solid var(--color-error-input) !important;
}

.input__wrapper {
  display: flex;
  flex-direction: column;
  padding-right: 26px;
  padding-left: 26px;

  label {
    position: relative;
    width: 100%;
  }

  input {
    width: 100%;
    height: 56px;
    padding-top: 10px;
    padding-left: 24px;
    color: var(--color-text);
    font-size: 16px;
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-25);
    border-radius: 32px;
    transition-duration: 0.3s;

    &[type='checkbox'] {
      width: 20px;
      height: 20px;
      padding: 0;
      margin: 0;
    }
  }

  input::placeholder {
    opacity: 0;
  }

  /* input focus */
  input:focus {
    padding-top: 10px;
    color: var(--color-text);
    border: 1px solid var(--color-black);
    outline: none;
  }

  span {
    position: absolute;
    top: -6px;
    left: 28px;
    color: var(--color-gray-62);
    font-weight: 400;
    font-size: 0.825em;
    font-size: var(--font-size-paragraph-sm);
    transform: translateY(15px);
    transition-duration: 300ms;

    @media (--viewport-ms-max) {
      transform: translateY(17px);
    }
  }

  label:focus-within > span,
  input:not(:placeholder-shown) + span {
    color: var(--color-gray-62);
    font-weight: 400;
    font-size: 16px;
    transform: translateY(5px);

    &.label--date {
      left: 0;
      font-size: 12px;
    }
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }
}
</style>
