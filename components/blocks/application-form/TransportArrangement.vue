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

const $route = useRoute();

// Set arrays for select options
const courses = ref([]);
const coursesSelect = ref([]);
const typeSelect = ref([
  { text: 'Skole', value: 'school' },
  { text: 'Børnehave', value: 'tpf_kindergarten' },
  { text: 'Vuggestue', value: 'tpf_nursery' },
  { text: 'Dagplejer', value: 'tpf_daycare' },
]);
const schools = ref([]);
const schoolsSelect = ref([]);
const schoolClassSelect = ref([
  { text: '0. klasse', value: 'grade_0' },
  { text: '1. klasse', value: 'grade_1' },
  { text: '2. klasse', value: 'grade_2' },
  { text: '3. klasse', value: 'grade_3' },
  { text: '4. klasse', value: 'grade_4' },
  { text: '5. klasse', value: 'grade_5' },
  { text: '6. klasse', value: 'grade_6' },
  { text: '7. klasse', value: 'grade_7' },
  { text: '8. klasse', value: 'grade_8' },
  { text: '9. klasse', value: 'grade_9' },
  { text: '10. klasse', value: 'grade_10' },
  { text: 'Specialklasse indskoling', value: 'special_in' },
  { text: 'Specialklasse mellemtrin', value: 'special_intermediate' },
  { text: 'Specialklasse udskoling', value: 'special_out' },
]);
const institutions = ref([]);
const institutionsSelect = ref([]);
const validated = ref(false);
const validationMessage = ref('');
const courseContent = ref([]);
const userContent = ref([]);
const institutionAddress = ref('');
const institutionPostalCode = ref('');
const institutionCity = ref('');

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

// URL query parameters
const urlQueryCourseId = ref('');

// Form data
const selectedCourse = ref('');
const selectedType = ref('');
const selectedInstitution = ref('');
const selectedSchoolGrade = ref('');
const courseNotInList = ref(false);
const courseName = ref('');
const courseDescription = ref('');
const courseAddress = ref('');
const coursePostalCode = ref('');
const courseCity = ref('');
const requestedAmount = ref('');
const numberOfStudents = ref('');
const settlementDate = ref('');
const fullName = ref('');
const email = ref('');
const emailRepeat = ref('');
const message = ref('');
const mailTo = ref(props.blockData?.field_mail_to);
const errorMessage = ref('');
const agreementCheckbox = ref(true);
const isSuccess = ref(false);
const isLoading = ref(false);
const honeypot = ref('');

// Fetch schools and providers on component mount
onBeforeMount(() => {
  fetchCourses('all');
});

// Fetch courses from provider UID
const fetchCourses = async (uid: any) => {
  coursesSelect.value = [];
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/content/course/' + uid,
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

// Fetch courses from provider UID
const fetchCourseContent = async (nid: any) => {
  courseContent.value = [];
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/node/' + nid + '?format=json&region=content',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error(response.status);
    courseContent.value = await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  // Set address, postal code and city from course content
  if (courseContent.value.content.field_location_street) {
    courseAddress.value = courseContent.value.content.field_location_street;
  } else if (courseContent.value.content.provider?.field_location_street) {
    courseAddress.value = courseContent.value.content.provider?.field_location_street;
  } else if (courseContent.value.content.corporation?.field_location_street) {
    courseAddress.value = courseContent.value.content.corporation?.field_location_street;
  }
  if (courseContent.value.content.field_location_zipcode) {
    coursePostalCode.value = courseContent.value.content.field_location_zipcode;
  } else if (courseContent.value.content.provider?.field_location_zipcode) {
    coursePostalCode.value = courseContent.value.content.provider?.field_location_zipcode;
  } else if (courseContent.value.content.corporation?.field_location_zipcode) {
    coursePostalCode.value = courseContent.value.content.corporation?.field_location_zipcode;
  }
  if (courseContent.value.content.field_location_city) {
    courseCity.value = courseContent.value.content.field_location_city;
  } else if (courseContent.value.content.provider?.field_location_city) {
    courseCity.value = courseContent.value.content.provider?.field_location_city;
  } else if (courseContent.value.content.corporation?.field_location_city) {
    courseCity.value = courseContent.value.content.corporation?.field_location_city;
  }
};

// Fetch schools
const fetchSchools = async () => {
  schoolsSelect.value = [];
  institutionsSelect.value = [];
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

// Fetch schools
const fetchUserContent = async (uid: any) => {
  userContent.value = [];
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/user/' + uid,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error(response.status);
    userContent.value = await response.json();
  } catch (error) {
    console.error('Error fetching schools:', error);
  }

  // Set address, postal code and city from user content.
  if (userContent.value[0].field_location_street) {
    institutionAddress.value = userContent.value[0].field_location_street[0].value;
  }
  if (userContent.value[0].field_location_zipcode) {
    institutionPostalCode.value = userContent.value[0].field_location_zipcode[0].value;
  }
  if (userContent.value[0].field_location_city) {
    institutionCity.value = userContent.value[0].field_location_city[0].value;
  }
};

// Fetch schools
const fetchInstitutions = async (type: any) => {
  schoolsSelect.value = [];
  institutionsSelect.value = [];
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/institutions/' + type,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) throw new Error(response.status);
    institutions.value = await response.json();
  } catch (error) {
    console.error('Error fetching schools:', error);
  }

  // Push to array for use in select list
  if (institutions.value.length > 0) {
    for (let i = 0; i < institutions.value.length; i++) {
      institutionsSelect.value.push({
        text: institutions.value[i].name,
        value: institutions.value[i].uid,
      });
    }
  }
};

// Handle course change.
const handleCourseChange = async (event: any) => {
  selectedCourse.value = event.target.value;
  courseAddress.value = '';
  coursePostalCode.value = '';
  courseCity.value = '';
  await fetchCourseContent(selectedCourse.value);
};

// Handle "Course not in list" logic
const handleHideCourseSelect = async () => {
  if (!courseNotInList.value) {
    // If the checkbox is checked, hide the select list and clear the v-model value
    selectedCourse.value = '';
    coursesSelect.value = [];
    courseNotInList.value = true;
  } else {
    // If the checkbox is unchecked fetch courses from selected provider
    courseNotInList.value = false;
    await fetchCourses('all');
  }
};

// Fetch schools/institutions on type change
const handleTypeChange = async (event: any) => {
  if (event.target.value === 'school') {
    await fetchSchools();
  } else {
    await fetchInstitutions(event.target.value);
  }
};

// Fetch user content on institution change
const handleInstitutionChange = async (event: any) => {
  selectedInstitution.value = event.target.value;
  institutionAddress.value = '';
  institutionPostalCode.value = '';
  institutionCity.value = '';
  await fetchUserContent(selectedInstitution.value);
};

// Handle validation
const handleValidation = async (event: any) => {
  event.preventDefault();
  console.log('Validation');
  console.log(courseAddress.value);
  console.log(coursePostalCode.value);
  console.log(courseCity.value);
  console.log(institutionAddress.value);
  console.log(institutionPostalCode.value);
  console.log(institutionCity.value);

  // validated.value = true;
  // validationMessage.value = '';
}

// Set settlement date on date change
const settlementDateChange = async (event: any) => {
  settlementDate.value = event.target.value;
};

// Handle modal
const handleModal = (title: any, content: any) => {
  modalStore.showModal({
    title: title,
    content: content,
  });
};

// Reset form values and fetch courses
const resetForm = async () => {
  courses.value = [];
  coursesSelect.value = [];
  schools.value = [];
  schoolsSelect.value = [];
  domains.value = [];
  selectedCourse.value = '';
  selectedInstitution.value = '';
  selectedSchoolGrade.value = '';
  courseNotInList.value = false;
  courseName.value = '';
  courseDescription.value = '';
  courseAddress.value = '';
  coursePostalCode.value = '';
  courseCity.value = '';
  validated.value = false;
  validationMessage.value = '';
  requestedAmount.value = '';
  numberOfStudents.value = '';
  settlementDate.value = '';
  fullName.value = '';
  email.value = '';
  emailRepeat.value = '';
  message.value = '';
  errorMessage.value = '';
  agreementCheckbox.value = true;
  isSuccess.value = false;
  isLoading.value = false;
  honeypot.value = '';
  await fetchCourses('all');
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

  // Set field_rfc_course
  const field_rfc_course = [
    {
      target_id: selectedCourse.value,
    },
  ];

  // Set field_tpf_grade
  const field_tpf_grade = [
    {
      target_id: selectedSchoolGrade.value,
    },
  ];

// Payload
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
        value: schoolClassSelect.value,
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
        target_id: field_tpf_institution.value,
      },
    ],
  };

  // If course is selected add to payload
  if (selectedCourse.value) {
    payload.field_rfc_course = field_rfc_course;
  }

  // If course is selected add to payload
  if (selectedSchoolGrade.value) {
    payload.field_tpf_grade = field_tpf_grade;
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
if ($route.query.course) {
  urlQueryCourseId.value = $route.query.course;
  fetchCourses(urlQueryCourseId.value);
}
</script>

<template>
  <div class="application-form" v-if="!isSuccess">
    <Form @submit="handleSubmit()">
      <div class="field-group">
        <h3>Forløb</h3>
        <BaseSelect
          v-if="!courseNotInList"
          v-model="selectedCourse"
          :options="coursesSelect"
          :model-value="urlQueryCourseId"
          @change="handleCourseChange"
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
          description="Se vilkår i boksen til højre under lokale initiativer"
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
          class="application-form__label"
          v-model="courseDescription"
          name="Beskrivelse af forløbet"
          label="Beskrivelse af forløbet"
          rules="required"
        />
      </div>

      <div class="field-group">
        <h3>Forløbsadresse</h3>
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="courseAddress"
          :value="courseAddress.value"
          type="text"
          name="Gade"
          label="Gade"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="coursePostalCode"
          type="text"
          name="Postnummer"
          label="Postnummer"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="courseCity"
          type="text"
          name="By"
          label="By"
          rules="required"
        />
      </div>

      <div class="field-group">
        <h3>Vælg institution</h3>
        <BaseSelect
          v-model="selectedType"
          :options="typeSelect"
          @change="handleTypeChange"
          name="Type"
          label="Type"
          selectLabel="Vælg type"
          rules="required"
        >
        </BaseSelect>
        <BaseSelect
          v-if="selectedType === 'school'"
          v-model="selectedInstitution"
          :options="schoolsSelect"
          @change="handleInstitutionChange"
          name="Skole"
          label="Skole"
          selectLabel="Vælg skole"
          rules="required"
        >
        </BaseSelect>
        <BaseSelect
          v-if="selectedType === 'school'"
          v-model="selectedSchoolGrade"
          :options="schoolClassSelect"
          name="Klassetrin"
          label="Klassetrin"
          selectLabel="Vælg klassetrin"
          rules="required"
        >
        </BaseSelect>
        <BaseSelect
          v-if="selectedType && selectedType !== 'school'"
          v-model="selectedInstitution"
          :options="institutionsSelect"
          @change="handleInstitutionChange"
          name="Institution"
          label="Institution"
          selectLabel="Vælg institution"
          rules="required"
        >
        </BaseSelect>
      </div>

      <div class="field-group">
        <button
          @click="handleValidation"
          class="button button--primary application-form__button"
          aria-label="Kontroller anmodning"
        >
          Kontroller anmodning
        </button>
      </div>

      <div v-if="validationMessage" class="field-group">
        <div class="validation-info" v-html="validationMessage"></div>
      </div>

      <div v-if="validated" class="field-group">
        <h3>Transport information</h3>
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="requestedAmount"
          type="number"
          name="Udgifter (DKK eks. moms.)"
          label="Udgifter (DKK eks. moms.)"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="numberOfStudents"
          type="number"
          name="Antal elever"
          label="Antal elever"
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

      <div v-if="validated" class="field-group">
        <h3>Kontakt information</h3>
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
          v-model="email"
          type="text"
          name="E-mailadresse"
          label="E-mailadresse"
          rules="required|email"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="emailRepeat"
          type="text"
          name="Gentag e-mailadresse"
          label="Gentag e-mailadresse"
          rules="required|email"
        />
        <BaseTextareaFloatingLabel
          class="application-form__label"
          v-model="message"
          name="Evt. besked"
          label="Evt. besked"
          rules=""
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
        v-if="!isLoading && validated"
        class="button button--primary application-form__button"
        aria-label="Indsend"
        type="submit"
      >
        Send anmodning
      </button>

      <button
        v-else-if="isLoading"
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

  .validation-info {
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
