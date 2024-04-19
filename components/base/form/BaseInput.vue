<script setup>
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4();
const value = ref(props.value);

const props = defineProps({
  id: String,
  type: String,
  placeholder: String,
  label: String,
  value: String,
  isError: String,
  maxlength: Number,
});
</script>

<template>
  <div class="input__wrapper">
    <label :for="id">
      <input
        :id="id"
        v-model="value"
        :maxlength="maxlength"
        :type="type"
        :placeholder="placeholder"
        :value="value"
        :class="isError ? 'input__error' : ''"
        @input="$emit('inputValue', $event.target.value)"
        @keyup.enter="$emit('enterPressed')"
      />
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<style lang="postcss" scoped>
.input__error {
  border: 1px solid var(--color-error-input) !important;
}

.input__wrapper {
  display: flex;

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
    top: 0;
    left: 0;
    margin-left: 24px;
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
    font-weight: 500;
    font-size: 12px;
    transform: translateY(5px);
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }

  /* Firefox */
  input[type='number'] {
    appearance: textfield;
  }
}
</style>
