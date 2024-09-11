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

const $route = useRoute();

// Set arrays for select options
const schools = ref([]);
const schoolsSelect = ref([]);
const providers = ref([]);
const providersSelect = ref([]);
const courses = ref([]);
const coursesSelect = ref([]);
const courseTerms = ref([]);
const courseTermsSelect = ref([]);
const coursePriceInfo = ref([]);
const domains = ref([]);
const domainArray = ref(props.blockData?.field_domain_access);

const urlQueryCourseId = ref('');
const urlQueryProviderId = ref('');

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

onBeforeMount(() => {
  fetchSchools();
  fetchProviders();
});

const fetchSchools = async () => {
  try {
    const response = await fetch(
      baseEndpoint.value + '/rest-export/users/school',
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
    const response = await fetch(
      baseEndpoint.value + '/rest-export/users/course_provider',
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
    const response = await fetch(
      baseEndpoint.value + '/rest-export/courses/primary-school/' + uid,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
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
    const response = await fetch(
      baseEndpoint.value + '/rest-export/content-subject-terms/' + nid,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error(response.status);
    courseTerms.value = await response.json();
  } catch (error) {
    console.error('Error fetching courseTerms:', error);
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

const fetchCoursePriceInfo = async (nid) => {
  try {
    const response = await fetch(
      baseEndpoint.value + '/rest-export/course-price/' + nid,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error(response.status);
    coursePriceInfo.value = await response.json();
  } catch (error) {
    console.error('Error fetching coursePriceInfo:', error);
  }
};

const handleProviderChange = async (event) => {
  coursePriceInfo.value = [];
  await fetchCourses(event.target.value);
};

const handleHideCourseSelect = async () => {
  if (!courseNotInList.value) {
    // If the checkbox is checked, hide the select list and clear the v-model value
    selectedCourse.value = '';
    coursesSelect.value = [];
    selectedCourseTerm.value = '';
    courseTermsSelect.value = [];
    coursePriceInfo.value = [];
    courseNotInList.value = true;
  } else {
    // If the checkbox is unchecked, show the select list
    courseNotInList.value = false;
    await fetchCourses(selectedProvider.value);
  }
};

const handleCourseChange = async (event) => {
  coursePriceInfo.value = [];
  await fetchCourseSubjects(event.target.value);
  await fetchCoursePriceInfo(event.target.value);
};

const settlementDateChange = async (event) => {
  settlementDate.value = event.target.value;
};

const handleModal = (title, content: any) => {
  modalStore.showModal({
    title: title,
    content: content,
  });
};

const resetForm = async () => {
  schools.value = [];
  schoolsSelect.value = [];
  providers.value = [];
  providersSelect.value = [];
  courses.value = [];
  coursesSelect.value = [];
  courseTerms.value = [];
  courseTermsSelect.value = [];
  coursePriceInfo.value = [];
  domains.value = [];
  selectedSchool.value = '';
  schoolClass.value = '';
  receivingClass.value = '';
  fullName.value = '';
  phone.value = '';
  email.value = '';
  selectedProvider.value = '';
  selectedCourse.value = '';
  selectedCourseTerm.value = '';
  courseNotInList.value = false;
  courseName.value = '';
  courseDescription.value = '';
  requestedAmount.value = '';
  settlementDate.value = '';
  errorMessage.value = '';
  agreementCheckbox.value = true;
  isSuccess.value = false;
  isLoading.value = false;
  honeypot.value = '';
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
  const field_rfc_course = [
    {
      target_id: selectedCourse.value,
    },
  ];
  const field_rfc_subject = [
    {
      target_id: selectedCourseTerm.value,
    },
  ];


  const payload = {
    type: [
      {
        target_id: 'free_course_request',
      },
    ],
    field_domain_access: domains.value,
    field_mailto: [
      {
        value: mailTo.value,
      },
    ],
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
    field_rfc_new_course_description: [
      {
        value: trimmedCourseDescription,
      },
    ],
    field_rfc_new_course_name: [
      {
        value: courseName.value,
      },
    ],
    field_rfc_course_not_found: [
      {
        value: false,
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
    field_receiving_class: [
      {
        value: false,
      },
    ],
    field_rfc_name: [
      {
        value: trimmedFullName,
      },
    ],
    field_rfc_send_mail: [
      {
        value: true,
      },
    ],
    field_rfc_school: [
      {
        target_id: selectedSchool.value,
      },
    ],
    field_rfc_phone: [
      {
        value: trimmedPhone,
      },
    ],
    field_rfc_provider: [
      {
        target_id: selectedProvider.value,
      },
    ],
  };

  if (selectedCourse.value && selectedCourseTerm.value) {
    payload.field_rfc_course = field_rfc_course;
    payload.field_rfc_subject = field_rfc_subject;
  }

  try {
    // Submitting to our proxy endpoint
    const response = await $fetch('/api/submit-application-form', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // console.log('Response:', response);
    // State/Error handling for the API responses:
    // console.log('Status codes from the proxy:', response.statusCode);
    // console.log(
    //   'This is error / response message thats coming from the FE proxy level:',
    //   response.message,
    // );
    // console.log(
    //   'This is error response coming from the BE API level:',
    //   response.error.message,
    // );

    if (response.statusCode !== 201 && response.statusCode !== 200) {
      throw new Error('Form submission failed');
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

// If the course and provider are in the URL, set the values
if ($route.query.course && $route.query.provider) {
  urlQueryCourseId.value = $route.query.course;
  urlQueryProviderId.value = $route.query.provider;
  fetchCourses(urlQueryProviderId.value);
  fetchCourseSubjects(urlQueryCourseId.value);
  fetchCoursePriceInfo(urlQueryCourseId.value);
}
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
        <BaseCheckbox
          class="application-form__label"
          v-model="receivingClass"
          type="checkbox"
          name="Modtageklasse"
          label="Modtageklasse"
          description="Sæt kryds her, hvis klassen er en modtageklasse"
          rules=""
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
          type="text"
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
        <h3>Forløb</h3>
        <BaseSelect
          v-model="selectedProvider"
          @change="handleProviderChange"
          :options="providersSelect"
          :model-value="urlQueryProviderId"
          name="Udbyder"
          label="Udbyder"
          selectLabel="Vælg udbyder"
          rules="required"
        >
        </BaseSelect>
        <BaseSelect
          v-if="!courseNotInList"
          v-model="selectedCourse"
          @change="handleCourseChange"
          :options="coursesSelect"
          :model-value="urlQueryCourseId"
          name="Forløb"
          label="Forløb"
          selectLabel="Vælg forløb"
          rules="required"
        >
        </BaseSelect>
        <BaseCheckbox
          v-model="courseNotInList"
          @change="handleHideCourseSelect"
          class="application-form__label"
          type="checkbox"
          name="course_not_in_list"
          label="Forløb findes ikke på listen"
        />
        <BaseInputFloatingLabel
          v-if="courseNotInList"
          class="application-form__label"
          v-model="courseName"
          type="text"
          name="Forløbets navn"
          label="Forløbets navn"
          rules="required"
        />
        <div v-if="courseNotInList" class="application-form__textarea-wrapper">
          <div class="application-form__textarea-container">
            <Field
              v-slot="{ field, errors }"
              name="Beskrivelse af forløbet"
              label="Beskrivelse af forløbet"
              rules="required"
              v-model="courseDescription"
              :validate-on-blur="false"
              :validate-on-input="true"
            >
              <textarea
                :class="`form-input form-input--floating-label ${errors[0] ? 'application-form__styled-textarea--invalid' : ''}`"
                v-bind="field"
                class="application-form__label application-form__styled-textarea"
                @focus="hideHelperText"
                @blur="showHelperText"
              ></textarea>
              <Transition name="fade-input">
                <span
                  v-if="showHelper && !courseDescription"
                  class="application-form__helper-text"
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
          :rules="`${ courseNotInList ? '' : 'required'}`"
        >
        </BaseSelect>
        <div
          v-if="coursePriceInfo.length > 0"
          class="price-info form-input-wrapper"
        >
          <div class="price-info-header" v-if="coursePriceInfo[0].price">
            Pris
          </div>
          <div
            class="price-info-item"
            v-for="coursePriceInfoItem in coursePriceInfo"
          >
            {{ coursePriceInfoItem?.price ? coursePriceInfoItem?.price : '' }}
            {{ coursePriceInfoItem?.unit ? coursePriceInfoItem?.unit : '' }}
            {{
              coursePriceInfoItem?.vat
                ? '(' + coursePriceInfoItem?.vat + ')'
                : ''
            }}
          </div>
          <div
            v-if="coursePriceInfo[0].field_description_of_price"
            class="price-info-description"
            v-html="coursePriceInfo[0]?.field_description_of_price"
          ></div>
          <div class="price-info-link">
            <NuxtLink :to="coursePriceInfo[0]?.view_node" target="_blank"
              >Læs mere</NuxtLink
            >
          </div>
        </div>
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="requestedAmount"
          type="float"
          name="Ansøgt beløb"
          label="Ansøgt beløb"
          description="Skriv forløbets totale pris i hele tal - eks. '400'. Det er den pris, der er aftalt med udbyderen af forløbet og som ULF i Aarhus skal betale totalt. Hvis du ansøger for flere klasser, så skriv den samlede pris for alle forløb."
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

.modal__trigger {
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: underline;
}
</style>
