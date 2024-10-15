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
  description?: string;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  selectLabel?: string;
  customError?: string;
}>();

const emit = defineEmits(['update:modelValue']);
const id = ref(uuidv4());
const searchQuery = ref('');
const dropdownOptions = ref(props.options);
const dropdownOpen = ref(false);

const filteredOptions = computed(() =>
  dropdownOptions.value.filter((option) =>
    option.text.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
);

// Manage select value
const value = computed({
  get: () => {
    // console.log(`Getting modelValue for ${props.name}:`, props.modelValue);
    return props.modelValue || (props.multiple ? [] : '');
  },
  set: (newValue) => {
    // console.log(`Setting modelValue for ${props.name}:`, newValue);
    emit('update:modelValue', newValue);
  },
});

const searchInput = ref(null);
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
  searchQuery.value = '';

  if (dropdownOpen.value) {
    nextTick(() => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });
  }
};

const closeDropdown = () => {
  dropdownOpen.value = false;
  searchQuery.value = '';
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  if (!target.closest(`.custom-select`)) {
    closeDropdown();
  }
};

const dynamicFieldTitle = computed(() => {
  return props.modelValue
    ? props.options.find((option) => option.value === props.modelValue)?.text
    : props.selectLabel || 'Select';
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div
    class="form-select-wrapper form-input-wrapper custom-select"
    @click="toggleDropdown"
    :id="id"
  >
    <div>
      <!-- TODO: This is A retarded workaround for validation for this custom dropdown. Need to make it better
        by properly wraping Field around the dropdown
      -->
      <Field
        :id="id"
        v-model="value"
        class="form-select--invisible"
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
          :disabled="option.value === ''"
          :key="index"
          :selected="props.modelValue === option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </Field>

      <!--  -->

      <div class="select-header" :class="{ open: dropdownOpen }">
        <div class="selected-value" :class="{ open: dropdownOpen }">
          <div v-html="dynamicFieldTitle"></div>
          <NuxtIcon
            name="chevron-down"
            class="select-chevron"
            :class="{ open: dropdownOpen }"
            v-show="!dropdownOpen"
            filled
          />
        </div>

        <input
          type="text"
          ref="searchInput"
          v-model="searchQuery"
          v-if="dropdownOpen && props.options.length > 5"
          placeholder="Søg..."
          class="form-search"
          @click.stop
        />
      </div>

      <ul
        v-if="dropdownOpen"
        class="dropdown-options"
        :class="{ open: dropdownOpen }"
      >
        <TransitionGroup name="fade-in">
          <li
            v-for="(option, index) in filteredOptions"
            :key="index"
            class="option"
            :class="{ selected: props.modelValue === option.value }"
            @click="
              value = option.value;
              closeDropdown();
            "
          >
            <div v-html="option.text"></div>
          </li>
        </TransitionGroup>

        <div v-if="filteredOptions.length === 0">
          <div class="no-results">Ingen resultater</div>
        </div>
      </ul>

      <div v-if="description" class="form-description">
        {{ description }}
      </div>
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

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  cursor: pointer;

  select {
    display: none;
  }
}

.form-label {
  padding-left: 26px;
}

.form-description {
  padding-right: 26px;
  padding-left: 26px;
}

.select-header {
  background-color: var(--color-white);
  border-radius: var(--form-input-border-radius);
  border: var(--form-input-border);
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.select-header.open {
  box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), 0.1);
  color: var(--form-input-color-focus);
  background: var(--form-input-background-focus);
  border: var(--form-input-border-focus);
}

.select-chevron {
  position: relative;
  font-size: 17px;
  transition: all 0.3s ease;
}

.no-results {
  z-index: 1;
}

.select-chevron.open {
  transform: rotate(180deg);
}

.selected-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px 8px 16px;
  background-color: white;
  border-radius: 4px;
  color: var(--form-label-color);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-25);
  border-radius: 4px;
  z-index: 2;
  padding: 10px;
  list-style-type: none;
  margin-top: 5px;
}

.option {
  padding: 8px;
  cursor: pointer;
  z-index: 1;
  position: relative;
}

.option:hover,
.option.selected {
  background-color: rgba(var(--color-primary-rgb), 0.1);
}

.form-search {
  width: calc(100% - 16px);
  padding: 8px;
  margin-left: 8px;
  box-sizing: border-box;
  border: var(--form-input-border);
  border-radius: var(--form-input-border-radius);
  padding-left: 15px;
  transition: all 0.3s ease;

  &:focus {
    padding-left: 15px;
    outline: none;
    box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), 0.1);
    color: var(--form-input-color-focus);
    background: var(--form-input-background-focus);
    border: var(--form-input-border-focus);
  }

  &:focus::placeholder {
    color: transparent;
  }
}
</style>
