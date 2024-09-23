<script setup lang="ts">
import { Form } from 'vee-validate';
import { useModalStore } from '~/stores/modal';
import { truncateString } from '~/utils/truncateString';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';

const apiRouteStore = useApiRouteStore();
const modalStore = useModalStore();

const props = defineProps({
  blockData: Object,
});

// Set arrays for select options
const schools = ref([]);
const schoolsSelect = ref([]);
const providers = ref([]);
const theatersSelect = ref([]);

// Set domain array for form data
const domains = ref([]);
const domainArray = ref(props.blockData?.field_domain_access);

if (domainArray.value.length > 0) {
  for (let i = 0; i < domainArray.value.length; i++) {
    domains.value.push({
      target_id: domainArray.value[i],
    });
  }
}

// Form data
const selectedSchool = ref('');
const schoolClass = ref('');
const receivingClass = ref('');
const fullName = ref('');
const phone = ref('');
const email = ref('');
const mailTo = ref(props.blockData?.field_mail_to);
const selectedTheater = ref('');
const courseDescription = ref('');
const requestedAmount = ref('');
const settlementDate = ref('');
const errorMessage = ref('');
const isSuccess = ref(false);
const isLoading = ref(false);
const honeypot = ref('');
const performance = ref('');
const quantity = ref('');

// Fetch schools and providers on component mount
onBeforeMount(() => {
  fetchSchools();
  fetchTheatres();
});

// Fetch schools
const fetchSchools = async () => {
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/users/theater_contact',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error(response.status);
    schools.value = await response.json();
  } catch (error) {
    console.error('Error fetching schools:', error);
  }

  // Push to array for use in select list
  if (schools.value.length > 0) {
    for (let i = 0; i < schools.value.length; i++) {
      schoolsSelect.value.push({
        text: schools.value[i].name,
        value: schools.value[i].uid,
      });
    }
  }
};

// Fetch providers
const fetchTheatres = async () => {
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/terms/theater',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) throw new Error(response.status);
    providers.value = await response.json();
  } catch (error) {
    console.error('Error fetching theaters/providers:', error);
  }

  // Push to array for use in select list
  if (providers.value.length > 0) {
    for (let i = 0; i < providers.value.length; i++) {
      theatersSelect.value.push({
        text: providers.value[i].name,
        value: providers.value[i].tid,
      });
    }
  }
};

// Set settlement date on date change
const settlementDateChange = async (event) => {
  settlementDate.value = event.target.value;
};

// Handle modal
const handleModal = (title: string, content: any) => {
  modalStore.showModal({
    title: title,
    content: content,
  });
};

// Reset form values and fetch schools and providers
const resetForm = async () => {
  schools.value = [];
  schoolsSelect.value = [];
  providers.value = [];
  theatersSelect.value = [];
  domains.value = [];
  selectedSchool.value = '';
  schoolClass.value = '';
  receivingClass.value = '';
  fullName.value = '';
  phone.value = '';
  email.value = '';
  selectedTheater.value = '';
  courseDescription.value = '';
  requestedAmount.value = '';
  settlementDate.value = '';
  errorMessage.value = '';
  isSuccess.value = false;
  isLoading.value = false;
  honeypot.value = '';
  performance.value = '';
  quantity.value = '';

  fetchSchools();
  fetchTheatres();
};

// Handle submit
const handleSubmit = async () => {
  if (honeypot.value !== '') {
    errorMessage.value =
      'Der er opstået en fejl under udfyldning af formularen, venligst udfyld formularen korrekt.';
    return;
  } else if (!mailTo.value) {
    errorMessage.value =
      'Der blev ikke angivet en e-mailadresse af udbyderen. Dette er ikke din fejl. Venligst kontakt udbyderen på en anden måde.';
    return;
  }

  isLoading.value = true;
  const trimmedFullName = fullName.value.trim();
  const trimmedPhone = phone.value;
  const trimmedEmail = email.value.trim();

  // Payload
  const payload = {
    type: [
      {
        target_id: 'theater_refund',
      },
    ],
    field_domain_access: domains.value,
    field_rfc_date: [
      {
        value: settlementDate.value,
      },
    ],
    field_rfc_requested_amount: [
      {
        value: requestedAmount.value,
      },
    ],
    field_tr_quantity: [
      {
        value: quantity.value,
      },
    ],
    field_rfc_new_course_name: [
      {
        value: performance.value,
      },
    ],
    field_rfc_grade: [
      {
        value: schoolClass.value,
      },
    ],
    field_rfc_mail: [
      {
        value: trimmedEmail,
      },
    ],
    field_rfc_name: [
      {
        value: trimmedFullName,
      },
    ],
    field_rfc_school: [
      {
        target_id: selectedSchool.value,
      },
    ],
    field_tr_theater: [
      {
        target_id: selectedTheater.value,
      },
    ],
    field_rfc_phone: [
      {
        value: trimmedPhone,
      },
    ],
  };

  try {
    // Submitting to our proxy endpoint
    const response = await $fetch('/api/submit-application-form', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.statusCode !== 201 && response.statusCode !== 200) {
      throw new Error('Der opstod en fejl under indsendelse af formularen');
    }

    isSuccess.value = true;
  } catch (error) {
    console.error('Form submission failed:', error);
    errorMessage.value =
      error.message || 'Der opstod en fejl under indsendelse af formularen.';
  } finally {
    isLoading.value = false;
    window.scrollTo(0, 0);
  }
};
</script>

<template>
  <div class="application-form" v-if="!isSuccess">
    <Form @submit="handleSubmit()">
      <div class="field-group">
        <h3>Skole</h3>
        <BaseSelect
          v-model="selectedSchool"
          :options="schoolsSelect"
          name="Skole"
          label="Skole"
          selectLabel="Vælg skole"
          rules="required"
        >
        </BaseSelect>
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="schoolClass"
          type="text"
          name="Klasse"
          label="Klasse"
          description="Skriv hvilken klasse, der deltager i forløbet - sådan her: 7.B eller 7.ABC)"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="fullName"
          type="text"
          name="Navn"
          label="Navn"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="phone"
          type="number"
          name="Telefonnummer"
          label="Telefonnummer"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="email"
          type="text"
          name="E-mailadresse"
          label="E-mailadresse"
          rules="required|email"
        />
      </div>
      <div class="field-group">
        <h3>Forestilling</h3>
        <BaseSelect
          v-model="selectedTheater"
          :options="theatersSelect"
          name="Teater"
          label="Teater"
          selectLabel="Vælg teater"
          rules="required"
        >
        </BaseSelect>

        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="performance"
          type="text"
          name="Forestilling"
          label="Forestilling"
          rules="required"
        />

        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="quantity"
          type="number"
          name="Antal"
          label="Antal"
          description="Skriv antal billetter eller forestillinger."
          rules="required"
        />

        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="requestedAmount"
          type="number"
          name="Ansøgt beløb"
          label="Ansøgt beløb"
          description="Skriv forestillingens totale pris i hele tal inkl. moms - eks. '8000'."
          rules="required"
        />

        <BaseInput
          class="application-form__label"
          v-model="settlementDate"
          @change="settlementDateChange"
          type="date"
          name="Afviklingsdato"
          label="Afviklingsdato"
          rules="required"
        />
      </div>

      <div v-if="props.blockData.field_information_text" class="field-group">
        <h3 v-if="props.blockData.field_information_text_title">
          {{ props.blockData.field_information_text_title }}
        </h3>
        <div
          v-if="!props.blockData.field_show_in_modal"
          v-html="props.blockData.field_information_text"
        ></div>
        <div v-if="props.blockData.field_show_in_modal">
          <div
            v-html="truncateString(props.blockData.field_information_text, 155)"
          ></div>
          <NuxtLink
            class="modal__trigger"
            @click="
              handleModal(
                props.blockData?.field_information_text_title,
                props.blockData?.field_information_text,
              )
            "
            aria-label="Læs mere"
            role="button"
            >Læs mere</NuxtLink
          >
        </div>
      </div>

      <input type="text" v-model="honeypot" class="application-form__website" />

      <button
        v-if="!isLoading"
        class="button button--primary application-form__button"
        aria-label="Indsend"
        type="submit"
      >
        Indsend
      </button>

      <button
        v-else
        class="button button--primary application-form__button"
        disabled
        aria-label="Loading..."
      >
        <div class="application-form__spinner"></div>
      </button>
    </Form>
    <Transition name="bounce">
      <div v-if="errorMessage" class="application-form__error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </Transition>
  </div>

  <div v-else class="application-form__success">
    <h2>Din ansøgning er sendt</h2>
    <p><button @click="resetForm" class="button">Send en ny</button></p>
  </div>
</template>

<style lang="postcss" scoped>
.application-form {
  display: flex;
  flex-flow: column;

  .field-group {
    margin-bottom: 32px;
  }

  form {
    display: grid;
  }

  :deep(.form-input-wrapper) {
    margin-top: 18px @(--sm) 32px;
  }

  &__textarea-wrapper {
    padding-top: 18px @(--sm) 32px;
  }

  &__textarea-container {
    position: relative;
    width: 100%;
  }

  &__checkbox {
    display: flex;
    width: fit-content;
    padding-top: 18px @(--sm) 32px;
    color: var(--color-text);
    font-weight: 400;
    font-size: 16px;
    align-items: center;
    cursor: pointer;

    &--invalid {
      border: 1px solid var(--color-error) !important;
    }

    input {
      height: 20px;
      width: 20px;
      margin-right: 8px;
      border: 1px solid var(--color-gray-25);
      border-radius: 4px;
      position: relative;
      appearance: none;
      background-color: var(--color-white);
      transition: all 0.3s ease-in-out;
    }
  }

  input:checked {
    background-color: var(--color-primary);
  }

  input:checked::after {
    content: '✓';
    color: var(--color-white);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &__textarea-description {
    padding: 10px 26px 0;
    font-size: 80%;
    font-style: italic;
    line-height: 1.2;
  }

  &__styled-textarea {
    width: 100%;
    height: 220px;
    padding: 20px var(--spacing-x-base) 20px var(--spacing-x-base);
    border: 1px solid var(--color-gray-25);
    border-radius: 32px;
    font-size: 16px;
    box-sizing: border-box;
    transition:
      border-color,
      border 0.3s ease;

    &--invalid {
      border-color: var(--color-error);
    }
  }

  &__styled-textarea:focus {
    border: var(--form-input-border-focus);
    box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), 0.1);
    outline: none;
  }

  &__helper-text {
    position: absolute;
    top: 20px;
    left: var(--spacing-x-base);
    pointer-events: none;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  &__button {
    width: fit-content;
  }

  &__error-message {
    margin-top: 18px @(--sm) 32px;
    color: var(--color-error);
  }

  &__success {
    h2 {
      margin-bottom: 24px;
    }
  }

  &__spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid var(--color-white);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  &__website {
    display: none;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .price-info {
    padding: 22px 26px;
    border-radius: 32px;
    background-color: var(--color-quaternary-lighten-4);

    &-header {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 4px;
    }

    &-description {
      padding-top: 8px;

      :deep(p) {
        margin-bottom: 8px;
      }
    }
  }
}
/*  */
.modal__trigger {
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: underline;
}
</style>
