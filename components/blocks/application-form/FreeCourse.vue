<script setup lang="ts">
import { Field, Form } from 'vee-validate';
import { useModalStore } from '~/stores/modal';
import { truncateString } from '~/utils/truncateString';
const modalStore = useModalStore();

const props = defineProps({
  blockData: Object,
});
const config = useRuntimeConfig().public;
const baseEndpoint = ref(config.API_BASE_URL);

// Combine username and password
const credentials = `${config.REST_API_USER}:${config.REST_API_USER_PASS}`;
// Encode the combined string to Base64
const encodedCredentials = btoa(credentials);

// Set arrays for select options
const schools = ref([]);
const schoolsSelect = ref([]);
const providers = ref([]);
const providersSelect = ref([]);
const courses = ref([]);
const coursesSelect = ref([]);
const courseTerms = ref([]);
const courseTermsSelect = ref([]);
const domains = ref([]);
const domainArray = ref(props.blockData?.field_domain_access);

if (domainArray.value.length > 0) {
  for (let i = 0; i < domainArray.value.length; i++) {
    domains.value.push({
      'target_id': domainArray.value[i]
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
const selectedProvider = ref('');
const selectedCourse = ref('');
const selectedCourseTerm = ref('');
const courseNotInList = ref(false);
const courseName = ref('');
const courseDescription = ref('');
const requestedAmount = ref('');
const settlementDate = ref('');
const errorMessage = ref('');
const agreementCheckbox = ref(true);
const isSuccess = ref(false);
const isLoading = ref(false);
const honeypot = ref('');

// Convert to Base64
onBeforeMount(() => {
  fetchSchools();
  fetchProviders();
});

const fetchSchools = async () => {
  try {
    const response = await fetch(baseEndpoint.value + '/rest-export/users/school', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });
    if (!response.ok) throw new Error(response.status);
    schools.value = await response.json();
  } catch (error) {
    console.error('Error fetching schools:', error);
  }

  if (schools.value.length > 0) {
    for (let i = 0; i < schools.value.length; i++) {
      schoolsSelect.value.push({
        text: schools.value[i].name,
        value: schools.value[i].uid,
      });
    }
  }
};

const fetchProviders = async () => {
  try {
    const response = await fetch(baseEndpoint.value + '/rest-export/users/course_provider', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });
    if (!response.ok) throw new Error(response.status);
    providers.value = await response.json();
  } catch (error) {
    console.error('Error fetching providers:', error);
  }

  if (providers.value.length > 0) {
    for (let i = 0; i < providers.value.length; i++) {
      providersSelect.value.push({
        text: providers.value[i].name,
        value: providers.value[i].uid,
      });
    }
  }
};

const fetchCourses = async (uid) => {
  coursesSelect.value = [];
  try {
    const response = await fetch(baseEndpoint.value + '/rest-export/content/course/' + uid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });
    if (!response.ok) throw new Error(response.status);
    courses.value = await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  if (courses.value.length > 0) {
    for (let i = 0; i < courses.value.length; i++) {
      coursesSelect.value.push({
        text: courses.value[i].title,
        value: courses.value[i].nid,
      });
    }
  }
};

const fetchCourseSubjects = async (nid) => {
  courseTermsSelect.value = [];
  try {
    const response = await fetch(baseEndpoint.value + '/rest-export/content-subject-terms/' + nid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });
    if (!response.ok) throw new Error(response.status);
    courseTerms.value = await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  if (courseTerms.value.length > 0) {
    for (let i = 0; i < courseTerms.value.length; i++) {
      courseTermsSelect.value.push({
        text: courseTerms.value[i].label,
        value: courseTerms.value[i].tid,
      });
    }
  }
};

const handleProviderChange = async (event) => {
  await fetchCourses(event.target.value);
};

const handleHideCourseSelect = async ()=> {
  if (!courseNotInList.value) {
    // If the checkbox is checked, hide the select list and clear the v-model value
    selectedCourse.value = '';
    coursesSelect.value = [];
    selectedCourseTerm.value = '';
    courseTermsSelect.value = [];
    courseNotInList.value = true;
  } else {
    // If the checkbox is unchecked, show the select list
    courseNotInList.value = false;
    await fetchCourses(selectedProvider.value);
  }
}

const handleCourseChange = async (event) => {
  await fetchCourseSubjects(event.target.value);
};

const settlementDateChange = async (event) => {
  let date = new Date(event.target.value);
  settlementDate.value = date.toISOString().replace('.000Z', '+00:00');
};

const handleModal = (title, content: any) => {
  modalStore.showModal({
    title: title,
    content: content,
  });
};

const handleSubmit = async () => {
  if (honeypot.value !== '' || !agreementCheckbox.value) {
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
  const trimmedPhone = phone.value.trim();
  const trimmedEmail = email.value.trim();
  const trimmedCourseDescription = courseDescription.value.trim();

  const payload = {
    "type": [
        {
            "target_id": "free_course_request"
        }
    ],
    "field_domain_access": domains.value,
    "field_rfc_date": [
        {
            "value": settlementDate.value
        }
    ],
    "field_rfc_requested_amount": [
        {
            "value": requestedAmount.value
        }
    ],
    "field_rfc_new_course_description": [
        {
            "value": trimmedCourseDescription
        }
    ],
    "field_rfc_course": [
        {
            "target_id": selectedCourse.value
        }
    ],
    "field_rfc_new_course_name": [
        {
            "value": courseName.value
        }
    ],
    "field_rfc_course_not_found": [
        {
            "value": false
        }
    ],
    "field_rfc_grade": [
        {
            "value": schoolClass.value
        }
    ],
    "field_rfc_mail": [
        {
            "value": trimmedEmail
        }
    ],
    "field_receiving_class": [
        {
            "value": false
        }
    ],
    "field_rfc_name": [
        {
            "value": trimmedFullName
        }
    ],
    "field_rfc_send_mail": [
        {
            "value": true
        }
    ],
    "field_rfc_school": [
        {
            "target_id": selectedSchool.value
        }
    ],
    "field_rfc_status": [
        {
            "value": "awaiting"
        }
    ],
    "field_rfc_phone": [
        {
            "value": trimmedPhone
        }
    ],
    "field_rfc_provider": [
        {
            "target_id": selectedProvider.value
        }
    ],
    "field_rfc_subject": [
        {
            "target_id": selectedCourseTerm.value
        }
    ]
  };

  try {
    const response = await fetch(baseEndpoint.value + '/node?_format=json', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }

    isSuccess.value = true;
  } catch (error) {
    console.error('Form submission failed:', error);
    errorMessage.value =
      error.message || 'Der opstod en fejl under indsendelse af formularen.';
  } finally {
    isLoading.value = false;
  }
};

// Text area methods
const showHelper = ref(true);
function hideHelperText() {
  showHelper.value = false;
}

function showHelperText() {
  if (courseDescription.value === '') {
    showHelper.value = true;
  }
}
</script>

<template>
  <div class="contact-form" v-if="!isSuccess">
    <Form @submit="handleSubmit()">
      <div class="field-group">
        <h3>Skole</h3>
        <BaseSelect
          v-model="selectedSchool"
          :options="schoolsSelect"
          name="Skole"
          label="Skole"
          selectLabel="Vælg skole"
          rules="">
        </BaseSelect>
        <BaseInputFloatingLabel
          class="contact-form__label"
          v-model="schoolClass"
          type="text"
          name="Klasse"
          label="Klasse"
          rules=""
        />
        <BaseInput
          class="contact-form__label"
          v-model="receivingClass"
          type="checkbox"
          name="Modtageklasse"
          label="Modtageklasse"
          rules=""
        />
        <BaseInputFloatingLabel
          class="contact-form__label"
          v-model="fullName"
          type="text"
          name="Navn"
          label="Navn"
          rules=""
        />
        <BaseInputFloatingLabel
          class="contact-form__label"
          v-model="phone"
          type="text"
          name="Telefonnummer"
          label="Telefonnummer"
          rules=""
        />
        <BaseInputFloatingLabel
          class="contact-form__label"
          v-model="email"
          type="text"
          name="E-mailadresse"
          label="E-mailadresse"
          rules="required|email"
        />
      </div>
      <div class="field-group">
        <h3>Forløb</h3>
        <BaseSelect
          v-model="selectedProvider"
          @change="handleProviderChange"
          :options="providersSelect"
          name="Udbyder"
          label="Udbyder"
          selectLabel="Vælg udbyder"
          rules="">
        </BaseSelect>
        <BaseSelect
          v-if="!courseNotInList"
          v-model="selectedCourse"
          @change="handleCourseChange"
          :options="coursesSelect"
          name="Forløb"
          label="Forløb"
          selectLabel="Vælg forløb"
          rules="">
        </BaseSelect>
        <BaseInput
          v-model="courseNotInList"
          @change="handleHideCourseSelect"
          class="contact-form__label"
          type="checkbox"
          name="course_not_in_list"
          label="Forløb findes ikke på listen"
        />
        <BaseInputFloatingLabel
          v-if="courseNotInList"
          class="contact-form__label"
          v-model="courseName"
          type="text"
          name="Forløbets navn"
          label="Forløbets navn"
          rules=""
        />
        <div
          v-if="courseNotInList"
          class="contact-form__textarea-wrapper"
        >
          <div class="contact-form__textarea-container">
            <Field
              v-slot="{ field, errors }"
              name="Beskrivelse af forløbet"
              label="Beskrivelse af forløbet"
              rules=""
              v-model="courseDescription"
              :validate-on-blur="false"
              :validate-on-input="true"
            >
              <textarea
                :class="`form-input form-input--floating-label ${errors[0] ? 'contact-form__styled-textarea--invalid' : ''}`"
                v-bind="field"
                class="contact-form__label contact-form__styled-textarea"
                @focus="hideHelperText"
                @blur="showHelperText"
              ></textarea>
              <Transition name="fade-input">
                <span
                  v-if="showHelper && !courseDescription"
                  class="contact-form__helper-text"
                >
                  Beskrivelse af forløbet
                </span>
              </Transition>
              <Transition name="bounce">
                <span
                  v-if="errors[0]"
                  class="form-validation-feedback form-validation-feedback--invalid"
                >
                  {{ errors[0] }}
                </span>
              </Transition>
            </Field>
          </div>
        </div>
        <BaseSelect
          v-model="selectedCourseTerm"
          :options="courseTermsSelect"
          name="Emneområde"
          label="Emneområde"
          selectLabel="Vælg emneområde"
          rules="">
        </BaseSelect>
        <BaseInputFloatingLabel
          class="contact-form__label"
          v-model="requestedAmount"
          type="float"
          name="Ansøgt beløb"
          label="Ansøgt beløb"
          rules=""
        />
        <BaseInput
          class="contact-form__label"
          v-model="settlementDate"
          @change="settlementDateChange"
          type="date"
          name="Afviklingsdato"
          label="Afviklingsdato"
          rules=""
        />
      </div>

      <div v-if="props.blockData.field_information_text" class="field-group form-input-wrapper">
        <h3 v-if="props.blockData.field_information_text_title">{{ props.blockData.field_information_text_title }}</h3>
        <div v-if="!props.blockData.field_show_in_modal" v-html="props.blockData.field_information_text"></div>
        <div v-if="props.blockData.field_show_in_modal">
          <div v-html="truncateString(props.blockData.field_information_text, 155)"></div>
          <NuxtLink class="modal__trigger" @click="handleModal(props.blockData?.field_information_text_title, props.blockData?.field_information_text)">Læs mere</NuxtLink>
        </div>
      </div>

      <input type="text" v-model="honeypot" class="contact-form__website" />

      <button
        v-if="!isLoading"
        class="button button--primary contact-form__button"
        aria-label="Indsend"
        type="submit"
      >
        Indsend
      </button>

      <button
        v-else
        class="button button--primary contact-form__button"
        disabled
        aria-label="Loading..."
      >
        <div class="contact-form__spinner"></div>
      </button>
    </Form>
    <Transition name="bounce">
      <div v-if="errorMessage" class="contact-form__error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </Transition>
  </div>

  <div v-else>
    <h2 class="contact-form__success">Din ansøgning er sendt</h2>
  </div>
</template>

<style lang="postcss" scoped>
.contact-form {
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
    margin-top: 18px @(--sm) 32px;
    text-align: center;
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
}

.modal__trigger {
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: underline;
}
</style>
