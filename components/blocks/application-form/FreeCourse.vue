<script setup lang="ts">
import { Form } from 'vee-validate';
import { useModalStore } from '~/stores/modal';
import { truncateString } from '~/utils/truncateString';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';
import { stripHtmlFromString } from '~/utils/stripHtml';
import { useSettingsDataStore } from '~/stores/settingsData';

const $route = useRoute();

// Stores
const settingsDataStore = useSettingsDataStore();
const apiRouteStore = useApiRouteStore();
const modalStore = useModalStore();

const props = defineProps({
  blockData: Object,
});

// Set arrays of site messages to use in validation
const formSettings = {
  confirmation: computed(
    () => settingsDataStore.settingsData?.ufcr_receipt.value,
  ),
};

// Set arrays for select options
const schools = ref([]);
const schoolsSelect = ref([]);
const providers = ref([]);
const providersSelect = ref([]);
const courses = ref([]);
const coursesSelect = ref([]);
const courseTerms = ref([]);
const courseTermsSelect = ref([]);
const subjectTerms = ref([]);
const subjectTermsSelect = ref([]);
const coursePriceInfo = ref([]);

// URL query parameters
const urlQueryCourseId = ref('');
const urlQueryProviderId = ref('');

// Form data
const selectedSchool = ref('');
const schoolClass = ref('');
const receivingClass = ref(false);
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

// Fetch schools
const fetchSchools = async () => {
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/users/school',
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
const fetchProviders = async () => {
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/users/course_provider',
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

  // Push to array for use in select list
  if (providers.value.length > 0) {
    for (let i = 0; i < providers.value.length; i++) {
      providersSelect.value.push({
        text: providers.value[i].name,
        value: providers.value[i].uid,
      });
    }
  }
};

// Fetch courses from provider UID
const fetchCourses = async (uid) => {
  coursesSelect.value = [];
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint +
        '/rest-export/courses/primary-school/' +
        uid,
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

  // Push to array for use in select list
  if (courses.value.length > 0) {
    for (let i = 0; i < courses.value.length; i++) {
      coursesSelect.value.push({
        text: courses.value[i].title,
        value: courses.value[i].nid,
      });
    }
  }
};

// Fetch course subjects from course NID
const fetchCourseSubjects = async (nid) => {
  courseTermsSelect.value = [];

  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint +
        '/rest-export/content-subject-terms/' +
        nid,
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

  // Push to array for use in select list
  if (courseTerms.value.length > 0) {
    for (let i = 0; i < courseTerms.value.length; i++) {
      courseTermsSelect.value.push({
        text: courseTerms.value[i].label,
        value: courseTerms.value[i].tid,
      });
    }
  }
};

// Fetch course price info from course NID
const fetchCoursePriceInfo = async (nid: string) => {
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/course-price/' + nid,
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

// Fetch subjects from taxonomy vocabulary "subject"
const fetchSubjects = async () => {
  subjectTermsSelect.value = [];

  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/terms/subject',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) throw new Error(response.status);

    subjectTerms.value = await response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
  }

  // Push to array for use in select list
  if (subjectTerms.value.length > 0) {
    for (let i = 0; i < subjectTerms.value.length; i++) {
      subjectTermsSelect.value.push({
        text: subjectTerms.value[i].name,
        value: subjectTerms.value[i].tid,
      });
    }
  }
};

// Fetch courses on provider change and empty course selected values
const handleProviderChange = async () => {
  selectedCourse.value = '';
  coursesSelect.value = [];
  selectedCourseTerm.value = '';
  courseTermsSelect.value = [];
  coursePriceInfo.value = [];

  await fetchCourses(selectedProvider.value);
};

// Handle "Course not in list" logic
const handleHideCourseSelect = async () => {
  if (!courseNotInList.value) {
    // If the checkbox is checked, hide the select list and clear the v-model value
    selectedCourse.value = '';
    coursesSelect.value = [];
    selectedCourseTerm.value = '';
    courseTermsSelect.value = [];
    coursePriceInfo.value = [];
    courseNotInList.value = true;
    await fetchSubjects();
  } else {
    // If the checkbox is unchecked fetch courses from selected provider
    courseNotInList.value = false;
    if (selectedProvider.value) {
      await fetchCourses(selectedProvider.value);
    }
  }
};

// Fetch course subjects and price info on course change
const handleCourseChange = async () => {
  coursePriceInfo.value = [];
  await fetchCourseSubjects(selectedCourse.value);
  await fetchCoursePriceInfo(selectedCourse.value);
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
  providersSelect.value = [];
  courses.value = [];
  coursesSelect.value = [];
  courseTerms.value = [];
  courseTermsSelect.value = [];
  subjectTerms.value = [];
  subjectTermsSelect.value = [];
  coursePriceInfo.value = [];
  selectedSchool.value = '';
  schoolClass.value = '';
  receivingClass.value = false;
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
  fetchSchools();
  fetchProviders();
};

// Handle submit
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
  const trimmedEmail = email.value.trim();
  const trimmedCourseDescription = courseDescription.value.trim();

  // Set field_rfc_course and field_rfc_subject
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

  // Payload
  const payload = {
    type: [
      {
        target_id: 'free_course_request',
      },
    ],
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
        value: phone.value,
      },
    ],
    field_rfc_provider: [
      {
        target_id: selectedProvider.value,
      },
    ],
  };

  // If course is selected add to payload
  if (selectedCourse.value) {
    payload.field_rfc_course = field_rfc_course;
  }

  // If subject is selected add to payload
  if (selectedCourseTerm.value) {
    payload.field_rfc_subject = field_rfc_subject;
  }

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

// If the course and provider are in the URL, set default values to URL query parameters
if ($route.query.course && $route.query.provider) {
  urlQueryCourseId.value = $route.query.course;
  urlQueryProviderId.value = $route.query.provider;
  selectedProvider.value = urlQueryProviderId.value;
  selectedCourse.value = urlQueryCourseId.value;
  fetchCourses(urlQueryProviderId.value);
  fetchCourseSubjects(urlQueryCourseId.value);
  fetchCoursePriceInfo(urlQueryCourseId.value);
}

// Fetch schools and providers before DOM mount
onBeforeMount(() => {
  fetchSchools();
  fetchProviders();
});
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
          v-model="receivingClass"
          class="application-form__label"
          type="checkbox"
          name="Modtageklasse"
          label="Modtageklasse"
          description="Sæt kryds her, hvis klassen er en modtageklasse"
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
        <h3>Forløb</h3>
        <BaseSelect
          v-model="selectedProvider"
          :options="providersSelect"
          @update:model-value="handleProviderChange"
          name="Udbyder"
          selectLabel="Vælg udbyder"
          rules="required"
        >
        </BaseSelect>
        <BaseSelect
          v-if="!courseNotInList"
          v-model="selectedCourse"
          @update:model-value="handleCourseChange"
          :options="coursesSelect"
          name="Forløb"
          selectLabel="Vælg forløb"
          rules="required"
        >
        </BaseSelect>
        <BaseCheckbox
          :checked="courseNotInList"
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
        <BaseTextareaFloatingLabel
          v-if="courseNotInList"
          v-model="courseDescription"
          name="Beskrivelse af forløbet"
          label="Beskrivelse af forløbet"
          rules="required"
        />
        <BaseSelect
          v-model="selectedCourseTerm"
          :options="courseNotInList ? subjectTermsSelect : courseTermsSelect"
          name="Emneområde"
          selectLabel="Vælg emneområde"
          rules="required"
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
          type="number"
          name="Ansøgt beløb"
          label="Ansøgt beløb"
          description="Skriv forløbets totale pris i hele tal - eks. '400'. Det er den pris, der er aftalt med udbyderen af forløbet og som ULF i Aarhus skal betale totalt. Hvis du ansøger for flere klasser, så skriv den samlede pris for alle forløb."
          rules="required"
        />
        <BaseInput
          class="application-form__label"
          v-model="settlementDate"
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
          <p
            v-html="
              truncateString(
                stripHtmlFromString(props.blockData.field_information_text),
                155,
              )
            "
          ></p>
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
    <div v-html="formSettings.confirmation.value"></div>
    <p><button @click="resetForm" class="button">Send en ny</button></p>
  </div>
</template>

<style lang="postcss" scoped>
.application-form {
  display: flex;
  flex-flow: column;

  .field-group {
    margin-bottom: 62px;
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
