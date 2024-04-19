<script setup>
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();

const props = defineProps({
  checkboxes: {
    type: Object,
    required: true,
  },

  modelValue: {
    type: Array,
    required: true,
  },
});

const object = {};
// checking if selected
Object.keys(props.checkboxes.options).forEach((key) => {
  const optionKey = props.checkboxes.options[key].key;
  object[key] = props.modelValue.some((item) => {
    if (typeof item === 'string' && typeof optionKey === 'string') {
      return item === optionKey;
    }
    if (typeof item === 'string' && typeof optionKey === 'number') {
      return parseInt(item) === optionKey;
    }
    if (typeof item === 'number' && typeof optionKey === 'string') {
      return item === parseInt(optionKey);
    }
    if (typeof item === 'number' && typeof optionKey === 'number') {
      return item === optionKey;
    }
    return false;
  });
});

const checked = ref(object);

const values = computed(() => {
  const selectedValues = Object.keys(props.checkboxes.options)
    .filter((key) => checked.value[key])
    .map((key) => props.checkboxes.options[key].key);

  return selectedValues;
});

const emit = defineEmits(['update:modelValue', 'change']);
const handleInput = () => {
  emit('update:modelValue', values.value);
  emit('change', values.value);
};
</script>

<template>
  <div class="checkboxes">
    <div
      v-for="(checkbox, index) in checkboxes.options"
      :key="checkbox"
      class="checkboxes__item"
    >
      <BaseCheckbox
        v-model="checked[index]"
        :name="checkbox.value"
        @input="handleInput"
      >
        {{ checkbox.value }}
      </BaseCheckbox>
    </div>
  </div>
</template>
