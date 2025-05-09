<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useDawaAutocomplete } from '~/composables/useDawaAutocomplete';

const props = withDefaults(
  defineProps<{
    name?: string;
    description?: string;
    label?: string;
    modelValue?: string | number | null | any | any[] | undefined;
  }>(),
  {
    name: '',
    description: '',
    label: '',
    modelValue: null,
  },
);

const autofilled = ref(false);
const emit = defineEmits(['update:modelValue', 'blur', 'input', 'focus', 'address-selected']);
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

const autocompleteInput = ref(null)

onMounted(() => {
  if (autocompleteInput.value) {
    useDawaAutocomplete(autocompleteInput.value, (selected) => {
      emit('update:modelValue', selected);
      emit('address-selected', true);
    });
  }
});

const checkAnimation = (e: any) => {
  if (e.animationName === 'onAutoFillStart') {
    autofilled.value = true;
  } else if (e.animationName === 'onAutoFillCancel') {
    autofilled.value = false;
  }
};

const checkInput = (e: any) => {
  // Emit address-selected to false when user types in the input.
  emit('address-selected', false);
};
</script>

<template>
  <div class="form-input-wrapper autocomplete-container">
    <input
      :id="id"
      ref="autocompleteInput"
      :value="modelValue || ''"
      type="search"
      :class="`form-input form-input--floating-label ${inputClass}`"
      :name="name"
      autocomplete="off"
      @animationstart="checkAnimation"
      @input="checkInput($event)"
    />
    <label
      v-if="label"
      class="form-label"
      :for="id"
    >
      {{ label }}
    </label>
    <div v-if="description" class="form-description">
      {{ description }}
    </div>
  </div>
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

.autocomplete-container {
  position: relative;
}

.autocomplete-container input {
  width: 100%;
  box-sizing: border-box;
}

:deep(.dawa-autocomplete-suggestions) {
  margin: -1px 0 0;
  padding: 0;
  text-align: left;
  border-radius: 30px;
  border: 1px solid var(--color-primary);
  background: #fff;
  box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), .1);
  position: absolute;
  left: 0;
  right: 0;
  z-index: 9999;
  overflow-y: auto;
  box-sizing: border-box;
}

:deep(.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion) {
  margin: 0;
  list-style: none;
  cursor: pointer;
  padding: 5px 26px;
  color: #000;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:first-child) {
  padding-top: 15px;
}

:deep(.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:last-child) {
  padding-bottom: 15px;
  border-bottom: 0 solid #f0f0f0;
}

:deep(.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion.dawa-selected),
:deep(.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:hover) {
  background: #f0f0f0;
}
</style>
