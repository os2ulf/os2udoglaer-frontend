<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useDawaAutocomplete } from '~/composables/useDawaAutocomplete';
console.log('useDawaAutocomplete', useDawaAutocomplete);

const props = withDefaults(
  defineProps<{
    name: string;
    description?: string;
    label: string;
    modelValue: string | number | null | any | any[] | undefined;
  }>(),
  {
    name: '',
    description: '',
    label: '',
    modelValue: '',
  },
);

const autofilled = ref(false);
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

const autocompleteInput = ref(null)

onMounted(() => {
  if (autocompleteInput.value) {
    console.log(autocompleteInput.value);
    useDawaAutocomplete(autocompleteInput.value, (selected) => {
      console.log('Valgt adresse: ' + selected.tekst)
    })
    // $dawaAutocomplete(autocompleteInput.value, {
    //   select: (selected) => {
    //     console.log('Valgt adresse: ' + selected.tekst)
    //   }
    // })
  }
})


const checkAnimation = (e: any) => {
  if (e.animationName === 'onAutoFillStart') {
    autofilled.value = true;
  } else if (e.animationName === 'onAutoFillCancel') {
    autofilled.value = false;
  }
};

</script>

<template>
  <div class="form-input-wrapper autocomplete-container">
    <input
      :id="id"
      v-model="value"
      ref="autocompleteInput"
      type="search"
      :class="`form-input form-input--floating-label ${inputClass}`"
      :name="name"
      @animationstart="checkAnimation"
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

.dawa-autocomplete-suggestions {
  margin: 0.3em 0 0 0;
  padding: 0;
  text-align: left;
  border-radius: 0.3125em;
  background: #fcfcfc;
  box-shadow: 0 0.0625em 0.15625em rgba(0,0,0,.15);
  position: absolute;
  left: 0;
  right: 0;
  z-index: 9999;
  overflow-y: auto;
  box-sizing: border-box;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion {
  margin: 0;
  list-style: none;
  cursor: pointer;
  padding: 0.4em 0.6em;
  color: #333;
  border: 0.0625em solid #ddd;
  border-bottom-width: 0;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
  border-bottom-width: 0.0625em;
}

.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion.dawa-selected,
.dawa-autocomplete-suggestions .dawa-autocomplete-suggestion:hover {
  background: #f0f0f0;
}
</style>
