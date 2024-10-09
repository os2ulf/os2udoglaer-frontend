<script setup lang="ts">
// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';

const id = `datepicker-${uuidv4()}`;

const props = defineProps({
  startAndEndDates: {
    type: Object,
    default: null,
  },
  filterName: {
    type: String,
    default: 'Kalender',
  },
});

const datepicker = ref();
const date = ref();

const emit = defineEmits(['datepickerValue']);

const handleDateChange = (newDate: object) => {
  emit('datepickerValue', newDate);
  setTimeout(() => {
    showDatepicker.value = false;
  }, 200);
};

const showDatepicker = ref(false);
const toggleDatepicker = () => {
  showDatepicker.value = !showDatepicker.value;
};

const setDate = (dates: object) => {
  if (dates) {
    const startISO = convertToISO(dates.startDate);
    const endISO = convertToISO(dates.endDate);

    date.value = [startISO, endISO];
  } else {
    return;
  }
};

const convertToISO = (dateString) => {
  const [day, month, year] = dateString.split('.');
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

  return date.toISOString();
};

const handleClickOutside = (e) => {
  if (!e.target.closest('.datepicker')) {
    showDatepicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  if (
    props.startAndEndDates.startDate &&
    props.startAndEndDates.endDate !== ''
  ) {
    setDate(props.startAndEndDates);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="datepicker" :id="id">
    <button
      class="datepicker__trigger"
      :class="{ 'datepicker__trigger--active': showDatepicker }"
      @click="toggleDatepicker()"
    >
      <NuxtIcon
        class="datepicker__icon"
        :class="{ 'datepicker__icon--active': showDatepicker }"
        name="calendar"
        filled
      />
      <span>{{ filterName }}</span>
    </button>

    <VueDatePicker
      v-if="showDatepicker"
      class="datepicker__component"
      ref="datepicker"
      v-model="date"
      locale="da-dk"
      :enable-time-picker="false"
      month-name-format="long"
      range
      select-text="Select"
      auto-apply
      utc
      inline
      multi-calendars
      :week-numbers="{ type: 'iso' }"
      hide-offset-dates
      @update:model-value="handleDateChange"
    ></VueDatePicker>
  </div>
</template>

<style lang="postcss" scoped>
.datepicker {
  position: relative;
  width: inherit;

  &__icon {
    margin-right: 8px;
    font-size: 20px;

    :deep(path) {
      stroke: var(--color-black);
    }

    &--active {
      :deep(path) {
        stroke: var(--color-primary);
      }
    }
  }

  &__trigger {
    display: flex;
    align-items: center;
    text-align: left;
    width: 100%;
    border: 1px solid #707070;
    border-radius: 32px;
    background: none;
    line-height: 18px;
    height: inherit;
    color: var(--color-gray-62);
    font-weight: 400;
    font-size: var(--font-size-paragraph-sm);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    z-index: 2;
    padding: 18px 32px;

    &--active {
      border: 1px solid var(--color-primary);
      box-shadow: 0px 0px 0px 4px #297f781a;
      z-index: 9;
      max-width: 166px;

      @media (--viewport-sm-max) {
        min-width: 100%;
      }
    }
  }

  &__component {
    padding-top: 3px;
    width: 100%;
    z-index: 8;
  }
}
</style>
