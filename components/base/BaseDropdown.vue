<script setup>
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();

const props = defineProps({
  value: {
    type: [String, Object, Array],
    default: '',
  },
  list: {
    type: [Object, Array],
    default: null,
  },
  defaultValue: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(['dropdownValue']);

const currentlySelected = ref(props.defaultValue || null);

const value = ref(props.value);
const list = ref(props.list);
const visible = ref(false);

const toggleDropdown = () => {
  visible.value = !visible.value;
};

const select = (item) => {
  currentlySelected.value = item.value;
  emit('dropdownValue', item.key);
};

// if clicked outside of dropdown, close it
const handleClickOutside = (e) => {
  if (!e.target.closest('.dropdown')) {
    visible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const defaultValue = () => {
  if (props.defaultValue) {
    const defaultItem = props.list.find((item) => {
      // must be '==' not '===', sometimes numbers come as strings
      return item.key == props.defaultValue;
    });
    if (defaultItem) {
      currentlySelected.value = defaultItem.value;
    }
  }
};
defaultValue();
</script>

<template>
  <div :id="id" class="dropdown" :data-value="value" :data-list="list">
    <div
      class="selector"
      :class="{ 'dropdown--border': visible }"
      @click="toggleDropdown()"
    >
      <div
        class="label"
        :class="
          ({ 'label--focus': currentlySelected },
          { 'dropdown--focus': currentlySelected })
        "
      >
        <span class="dropdown__title">{{ value }}</span>
        <span class="dropdown__selected-title">
          {{ currentlySelected }}
        </span>
      </div>
      <div class="arrow" :class="{ expanded: visible }">
        <NuxtIcon name="chevron-down" fill />
      </div>
      <div :class="{ hidden: !visible, visible: visible }">
        <ul
          :class="{
            'dropdown--first-selected': !currentlySelected,
            'dropdown__hide-scrollbar': !visible,
          }"
        >
          <li
            v-for="(item, key) in list"
            :key="key"
            :class="{ current: item === value }"
            @click="select(item, key)"
          >
            {{ item.value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.dropdown {
  &__hide-scrollbar {
    display: none;
  }

  &--border {
    border: 1px solid var(--color-black) !important;
  }

  &__has-selected {
    transform: translateY(-10px);
  }

  &__selected-title {
    color: var(--color-text);
    font-size: var(--body-font-size);
  }

  &--first-selected {
    transform: translateY(15px);

    @media (--viewport-ms-max) {
      transform: translateY(22px);
    }
  }
}

.dropdown .selector {
  position: relative;
  z-index: 1;
  height: 56px;
  color: var(--color-text);
  font-size: var(--font-size-paragraph-sm);
  background: var(--color-white);
  border: 1px solid var(--color-gray-25);
  border-radius: 32px;
  cursor: pointer;
  transition-duration: 0.3s;
}

.dropdown .selector .arrow {
  position: absolute;
  top: 40%;
  right: 22px;
  transform: rotateZ(0deg) translateY(0);
  transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
  transition-duration: 0.3s;
}

.dropdown .selector .expanded {
  transform: rotateZ(180deg) translateY(2px);
}

.dropdown .selector .label {
  display: grid;
  margin-left: 24px;
  color: var(--color-gray-62);
  font-size: var(--font-size-paragraph-sm);
  transform: translateY(15px);

  @media (--viewport-ms-max) {
    transform: translateY(17px);
  }
}

.dropdown ul {
  position: absolute;
  z-index: 1;
  width: 100%;
  padding: 0;
  list-style-type: none;
  background: var(--color-white);
  border: 1px solid var(--color-gray-25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dropdown li {
  padding: 12px 24px 12px 22px;
  color: var(--color-gray-62);
}

.dropdown li:hover {
  background: var(--color-gray-25);
}

.dropdown .current {
  background: var(--color-gray-6);
}

.dropdown .hidden {
  visibility: hidden;
}

.dropdown .visible {
  visibility: visible;
}

/* @click animations */
.dropdown--focus .dropdown__title {
  color: var(--color-text);
  font-weight: 500;
  font-size: 12px;
  transition-duration: 300ms;
}

.dropdown--focus {
  transform: translateY(5px) !important;
}

.label--focus .dropdown__title {
  color: var(--color-text);
  font-weight: 500;
  font-size: 12px;
  transition-duration: 300ms;
}
</style>
