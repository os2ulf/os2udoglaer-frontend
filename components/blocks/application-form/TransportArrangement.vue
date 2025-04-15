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
  free_choice: computed(
    () => settingsDataStore.settingsData?.free_choice.value,
  ),
  course_not_found: computed(
    () => settingsDataStore.settingsData?.course_not_found.value,
  ),
  district_1: computed(() => settingsDataStore.settingsData?.district_1.value),
  district_2: computed(() => settingsDataStore.settingsData?.district_2.value),
  district_3: computed(() => settingsDataStore.settingsData?.district_3.value),
  district_4: computed(() => settingsDataStore.settingsData?.district_4.value),
  district_5: computed(() => settingsDataStore.settingsData?.district_5.value),
  no_district: computed(
    () => settingsDataStore.settingsData?.no_district.value,
  ),
  denied_distance: computed(
    () => settingsDataStore.settingsData?.denied_distance.value,
  ),
  denied_private: computed(
    () => settingsDataStore.settingsData?.denied_private.value,
  ),
  confirmation: computed(
    () => settingsDataStore.settingsData?.confirmation.value,
  ),
};

// Set arrays for select options
const courses = ref([]);
const coursesSelect = ref([]);
const typeSelect = ref([
  { text: 'Vælg type', value: '' },
  { text: 'Skole', value: 'tpf_school' },
  { text: 'Børnehave', value: 'tpf_kindergarten' },
  { text: 'Vuggestue', value: 'tpf_nursery' },
  { text: 'Dagplejer', value: 'tpf_daycare' },
]);
const schools = ref([]);
const schoolsSelect = ref([]);
const schoolClassSelect = ref([
  { text: 'Vælg klassetrin', value: '' },
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
const schoolClassAllowed = ref([
  'grade_0',
  'grade_1',
  'grade_2',
  'grade_3',
  'grade_4',
  'grade_5',
  'special_in',
  'special_intermediate',
]);
const institutions = ref([]);
const institutionsSelect = ref([]);
const checkDistance = ref(true);
const validated = ref(false);
const validationMessage = ref('');
const courseContent = ref([]);
const courseWhoCanApply = ref('');
const courseLatLon = ref([]);
const userContent = ref([]);
const institutionAddress = ref('');
const institutionPostalCode = ref('');
const institutionLatLon = ref([]);
const institutionPrivateMunicipal = ref('');
const institutionDistrict = ref('');

// URL query parameters
const urlQueryCourseId = ref('');

// Form data
const selectedCourse = ref('');
const selectedType = ref('');
const selectedInstitution = ref('');
const selectedSchoolGrade = ref('');
const courseNotInList = ref(false);
const courseDescription = ref('');
const coursePurpose = ref('');
const courseDawaAddress = ref([])
const courseAddress = ref('');
const coursePostalCode = ref('');
const courseCity = ref('');
const requestedAmount = ref('');
const numberOfStudents = ref('');
const settlementDate = ref('');
const departureTime = ref('');
const returnTime = ref('');
const fullName = ref('');
const email = ref('');
const emailRepeat = ref('');
const phone = ref('');
const message = ref('');
const mailTo = ref(props.blockData?.field_mail_to);
const errorMessage = ref('');
const agreementCheckbox = ref(true);
const isSuccess = ref(false);
const isLoading = ref(false);
const honeypot = ref('');

// Fetch courses from provider UID
const fetchCourses = async (uid: any) => {
  coursesSelect.value = [];
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/courses-applicable/' + uid,
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
  courseWhoCanApply.value = '';
  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint +
        '/node/' +
        nid +
        '?format=json&region=content',
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
    courseAddress.value =
      courseContent.value.content.provider?.field_location_street;
  } else if (courseContent.value.content.corporation?.field_location_street) {
    courseAddress.value =
      courseContent.value.content.corporation?.field_location_street;
  }
  if (courseContent.value.content.field_location_zipcode) {
    coursePostalCode.value = courseContent.value.content.field_location_zipcode;
  } else if (courseContent.value.content.provider?.field_location_zipcode) {
    coursePostalCode.value =
      courseContent.value.content.provider?.field_location_zipcode;
  } else if (courseContent.value.content.corporation?.field_location_zipcode) {
    coursePostalCode.value =
      courseContent.value.content.corporation?.field_location_zipcode;
  }
  if (courseContent.value.content.field_location_city) {
    courseCity.value = courseContent.value.content.field_location_city;
  } else if (courseContent.value.content.provider?.field_location_city) {
    courseCity.value =
      courseContent.value.content.provider?.field_location_city;
  } else if (courseContent.value.content.corporation?.field_location_city) {
    courseCity.value =
      courseContent.value.content.corporation?.field_location_city;
  }
  courseWhoCanApply.value =
    courseContent.value.content?.field_tpf_who_get_support;
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
  institutionPrivateMunicipal.value = '';

  try {
    const response = await fetch(
      apiRouteStore.apiRouteEndpoint + '/rest-export/user/' + uid,
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
    institutionAddress.value =
      userContent.value[0]?.field_location_street[0]?.value;
  }
  if (userContent.value[0].field_location_zipcode) {
    institutionPostalCode.value =
      userContent.value[0]?.field_location_zipcode[0]?.value;
  }
  institutionPrivateMunicipal.value =
    userContent.value[0]?.field_private_municipal[0]?.value;
  institutionDistrict.value = userContent.value[0]?.field_district[0]?.value;
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

// Calculate distance between two coordinates
const distanceBetween = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const toRadians = (angle: number) => angle * (Math.PI / 180); // Converts degrees to radians
  const R = 6371; // Radius of the Earth in kilometers (use 3959 for miles)

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
};

// Fetch data from DAWA API
const getDawaData = async (queryRaw: any, postalCode: any) => {
  if (queryRaw !== null && postalCode !== null) {
    const query = queryRaw?.trim().replace(/\s/g, '+');
    const dawaUrl = `https://api.dataforsyningen.dk/adresser?q=${query}*&postnr=${postalCode}&per_side=1&struktur=mini`;
    try {
      const response = await fetch(dawaUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(response.status);
      return response.json();
    } catch (error) {
      console.error('Error fetching dawa data:', error);
    }
  } else {
    console.error('Invalid address data.');
  }
};

// Handle course change.
const handleCourseChange = async () => {
  courseAddress.value = '';
  coursePostalCode.value = '';
  courseCity.value = '';
  checkDistance.value = true;
  validated.value = false;
  validationMessage.value = '';
  await fetchCourseContent(selectedCourse.value);
};

// Handle "Course not in list" logic
const handleHideCourseSelect = async () => {
  if (courseNotInList.value) {
    courseAddress.value = '';
    coursePostalCode.value = '';
    courseCity.value = '';
    selectedCourse.value = '';
    coursesSelect.value = [];
    checkDistance.value = true;
    validated.value = false;
    validationMessage.value = '';
  } else {
    await fetchCourses('all');
  }
};

// Fetch schools/institutions on type change
const handleTypeChange = async () => {
  checkDistance.value = true;
  validated.value = false;
  validationMessage.value = '';
  selectedInstitution.value = '';
  selectedSchoolGrade.value = '';
  if (selectedType.value === '') {
    return;
  } else if (selectedType.value === 'tpf_school') {
    await fetchSchools();
  } else {
    await fetchInstitutions(selectedType.value);
  }
};

const handleCourseAddressChange = async () => {
  checkDistance.value = true;
  validated.value = false;
  validationMessage.value = '';
};

const handleCoursePostalcodeChange = async () => {
  checkDistance.value = true;
  validated.value = false;
  validationMessage.value = '';
};

const handleCourseCityChange = async () => {
  checkDistance.value = true;
  validated.value = false;
  validationMessage.value = '';
};

// Fetch user content on institution change
const handleInstitutionChange = async () => {
  // console.log('handleInstitutionChange', selectedInstitution.value);
  institutionAddress.value = '';
  institutionPostalCode.value = '';
  institutionDistrict.value = '';
  checkDistance.value = true;
  validated.value = false;
  validationMessage.value = '';
  await fetchUserContent(selectedInstitution.value);
};

const handleSchoolGradeChange = async () => {
  checkDistance.value = true;
  validated.value = false;
  validationMessage.value = '';
};

// Handle validation
const handleValidation = async (event: any) => {
  event.preventDefault();
  validationMessage.value = '';

  // Validation for course address, postal code and city
  if (courseAddress.value === '' || coursePostalCode.value === '' || courseCity.value === '') {
    validated.value = false;
    validationMessage.value = 'Vælg forløb eller indtast forløbsadresse';
    checkDistance.value = false;
    return;
  }

  // Validation for institution type
  if (selectedType.value === '') {
    validated.value = false;
    validationMessage.value = 'Vælg institutionstype';
    checkDistance.value = false;
    return;
  }

  // Validation for institution type school
  if (selectedType.value === 'tpf_school' && (selectedInstitution.value === '' || selectedSchoolGrade.value === '')) {
    validated.value = false;
    validationMessage.value = 'Vælg en skole og et klassetrin';
    checkDistance.value = false;
    return;
  }

  // Validation for institution type kindergarten, nursery or daycare
  if ((selectedType.value === 'tpf_kindergarten' || selectedType.value === 'tpf_nursery' || selectedType.value === 'tpf_daycare') && selectedInstitution.value === '') {
    validated.value = false;
    validationMessage.value = 'Vælg institution';
    checkDistance.value = false;
    return;
  }

  // If private institution and municipal course, or private institution and course not in list
  if (
    (institutionPrivateMunicipal.value === 'private' &&
      courseWhoCanApply.value === 'municipal') ||
    (institutionPrivateMunicipal.value === 'private' && courseNotInList.value)
  ) {
    validationMessage.value = formSettings.denied_private.value;
    validated.value = false;
    checkDistance.value = false;

    // If private institution and for all course, or municipal institution and municipal course
  } else if (
    (courseWhoCanApply.value === 'all') ||
    (institutionPrivateMunicipal.value === 'municipal' &&
      courseWhoCanApply.value === 'municipal')
  ) {
    // If school
    if (selectedType.value === 'tpf_school') {
      if (schoolClassAllowed.value.includes(selectedSchoolGrade.value.trim())) {
        validated.value = true;
        checkDistance.value = false;
      } else {
        validated.value = false;
        checkDistance.value = true;
      }

      // If institution
    } else {
      validated.value = true;
      checkDistance.value = false;
    }
  } else if (!courseWhoCanApply.value) {
    if (courseNotInList.value) {
      if (selectedType.value === 'tpf_school') {
        if (schoolClassAllowed.value.includes(selectedSchoolGrade.value.trim())) {
          validated.value = true;
          checkDistance.value = false;
        } else {
          validated.value = false;
          checkDistance.value = true;
        }

        // If institution
      } else {
        validated.value = true;
        checkDistance.value = false;
      }
    } else {
      validationMessage.value = formSettings.course_not_found.value;
      validated.value = false;
    }
  }

  // If distance check is enabled
  if (checkDistance.value) {
    // Get course latitude and longitude
    if (courseAddress.value !== '' || coursePostalCode.value !== '') {
      const data = await getDawaData(
        courseAddress.value,
        coursePostalCode.value,
      );
      if (data.length > 0) {
        courseLatLon.value['longitude'] = data[0].x;
        courseLatLon.value['latitude'] = data[0].y;
      }
    }

    // Get institution latitude and longitude
    if (institutionAddress.value !== '' || institutionPostalCode.value !== '') {
      const data = await getDawaData(
        institutionAddress.value,
        institutionPostalCode.value,
      );
      if (data.length > 0) {
        institutionLatLon.value['longitude'] = data[0].x;
        institutionLatLon.value['latitude'] = data[0].y;
      }
    }

    // Calculate distance between course and institution
    if (
      courseLatLon.value.latitude &&
      courseLatLon.value.longitude &&
      institutionLatLon.value.latitude &&
      institutionLatLon.value.longitude
    ) {
      const distance = distanceBetween(
        courseLatLon.value.latitude,
        courseLatLon.value.longitude,
        institutionLatLon.value.latitude,
        institutionLatLon.value.longitude,
      );
      const roundedDistance = distance.toFixed(2); // Rounds to 2 decimal places
      // console.log(`Distance: ${roundedDistance} km`);
      if (roundedDistance < 6) {
        validationMessage.value = formSettings.denied_distance.value;
        validated.value = false;
      } else {
        validated.value = true;
      }
    } else {
      validationMessage.value =
        'Det er ikke muligt at beregne afstanden mellem institutionen og forløbet. Venligst indtast korrekte adresser eller kontakt os.';
    }
  }

  // If validated, set validation message
  if (validated.value) {
    if (institutionDistrict.value) {
      if (institutionDistrict.value === 'district_1') {
        validationMessage.value = formSettings.district_1.value;
      } else if (institutionDistrict.value === 'district_2') {
        validationMessage.value = formSettings.district_2.value;
      } else if (institutionDistrict.value === 'district_3') {
        validationMessage.value = formSettings.district_3.value;
      } else if (institutionDistrict.value === 'district_4') {
        validationMessage.value = formSettings.district_4.value;
      } else if (institutionDistrict.value === 'district_5') {
        validationMessage.value = formSettings.district_5.value;
      } else {
        validationMessage.value = formSettings.no_district.value;
      }
    } else {
      validationMessage.value = formSettings.free_choice.value;
    }
  }
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
  selectedCourse.value = '';
  selectedInstitution.value = '';
  selectedSchoolGrade.value = '';
  courseNotInList.value = false;
  courseDescription.value = '';
  coursePurpose.value = '';
  courseAddress.value = '';
  coursePostalCode.value = '';
  courseCity.value = '';
  validated.value = false;
  validationMessage.value = '';
  requestedAmount.value = '';
  numberOfStudents.value = '';
  settlementDate.value = '';
  departureTime.value = '';
  returnTime.value = '';
  fullName.value = '';
  email.value = '';
  emailRepeat.value = '';
  phone.value = '';
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
  } else if (emailRepeat.value !== email.value) {
    errorMessage.value = 'E-mailadresserne er ikke ens.';
    return;
  }

  isLoading.value = true;
  const trimmedFullName = fullName?.value?.trim();
  const trimmedEmail = email?.value?.trim();

  // Set field_rfc_course
  const field_rfc_course = [
    {
      target_id: selectedCourse.value,
    },
  ];

  // Set field_tpf_grade
  const field_tpf_grade = [
    {
      value: selectedSchoolGrade.value,
    },
  ];

  // Set field_tpf_what_course
  const field_tpf_what_course = [
    {
      value: courseDescription.value,
    },
  ];

  // Set field_tpf_purpose_course
  const field_tpf_purpose_course = [
    {
      value: coursePurpose.value,
    },
  ];

  // Set field_tpf_message
  const field_tpf_message = [
    {
      value: message.value,
    },
  ];

  // Set field_rfc_departure_time
  const field_rfc_departure_time = [
    {
      value: departureTime.value,
    },
  ];

  // Set field_rfc_return_time
  const field_rfc_return_time = [
    {
      value: returnTime.value,
    },
  ];

  // Payload
  const payload = {
    type: [
      {
        target_id: 'transport_pool_form',
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
    field_tpf_expense: [
      {
        value: requestedAmount.value,
      },
    ],
    field_rfc_mail: [
      {
        value: trimmedEmail,
      },
    ],
    field_rfc_phone: [
      {
        value: phone.value,
      },
    ],
    field_rfc_name: [
      {
        value: trimmedFullName,
      },
    ],
    field_tpf_institution: [
      {
        target_id: selectedInstitution.value,
      },
    ],
    field_tpf_institution_type: [
      {
        value: selectedType.value,
      },
    ],
    field_location_street: [
      {
        value: courseAddress.value,
      },
    ],
    field_location_zipcode: [
      {
        value: coursePostalCode.value,
      },
    ],
    field_location_city: [
      {
        value: courseCity.value,
      },
    ],
    field_tpf_participants: [
      {
        value: numberOfStudents.value,
      },
    ],
    field_tpf_course_not_found: [
      {
        value: courseNotInList.value,
      },
    ],
    field_rfc_send_mail: [
      {
        value: true,
      },
    ],
  };

  // If course is selected add to payload
  if (selectedCourse.value) {
    payload.field_rfc_course = field_rfc_course;
  }

  // If school grade is selected add to payload
  if (selectedSchoolGrade.value) {
    payload.field_tpf_grade = field_tpf_grade;
  }

  // If course description is selected add to payload
  if (courseDescription.value) {
    payload.field_tpf_what_course = field_tpf_what_course;
  }

  // If course purpose is selected add to payload
  if (courseDescription.value) {
    payload.field_tpf_purpose_course = field_tpf_purpose_course;
  }

  // If course is selected add to payload
  if (message.value) {
    payload.field_tpf_message = field_tpf_message;
  }

  // If field_rfc_departure_time add to payload
  if (departureTime.value) {
    payload.field_rfc_departure_time = field_rfc_departure_time;
  }

  // If field_rfc_return_time add to payload
  if (returnTime.value) {
    payload.field_rfc_return_time = field_rfc_return_time;
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

// If the course is in the URL, fetch course content lists
if ($route.query.course) {
  urlQueryCourseId.value = $route.query.course;
  selectedCourse.value = urlQueryCourseId.value;
  fetchCourses(urlQueryCourseId.value);
  fetchCourseContent(urlQueryCourseId.value);
}

// Fetch schools and providers on component mount
onBeforeMount(() => {
  fetchCourses('all');
});
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
          @update:model-value="handleCourseChange"
          name="Forløb"
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

        <div v-if="courseNotInList">
          <BaseTextareaFloatingLabel
            v-model="courseDescription"
            name="Beskriv kort forløb og angiv formidler"
            label="Beskriv kort forløb og angiv formidler"
            rules="required"
          />
          <BaseTextareaFloatingLabel
            v-model="coursePurpose"
            name="Beskriv formål med turen – 2-5 linjer om læringsmål"
            label="Beskriv formål med turen – 2-5 linjer om læringsmål"
            rules="required"
          />
        </div>
      </div>

      <div class="field-group">
        <h3>Forløbsadresse</h3>
        <BaseDawaAutocomplete
          class="application-form__label"
          v-model="courseDawaAddress"
          :value="courseDawaAddress"
          @update:model-value="handleCourseAddressChange"
          name="Adresse"
          label="Adresse"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="courseAddress"
          :value="courseAddress"
          @update:model-value="handleCourseAddressChange"
          type="text"
          name="Gade"
          label="Gade"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="coursePostalCode"
          @update:model-value="handleCoursePostalcodeChange"
          type="text"
          name="Postnummer"
          label="Postnummer"
          rules="required"
        />
        <BaseInputFloatingLabel
          class="application-form__label"
          v-model="courseCity"
          @update:model-value="handleCourseCityChange"
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
          @update:model-value="handleTypeChange"
          name="Type"
          rules="required"
        />

        <BaseSelect
          v-if="selectedType === 'tpf_school'"
          v-model="selectedInstitution"
          :options="schoolsSelect"
          @update:model-value="handleInstitutionChange"
          name="Skole"
          label="Skole"
          selectLabel="Vælg skole"
          rules="required"
        />
        <BaseSelect
          v-if="selectedType === 'tpf_school'"
          v-model="selectedSchoolGrade"
          :options="schoolClassSelect"
          @update:model-value="handleSchoolGradeChange"
          name="Klassetrin"
          label="Klassetrin"
          rules="required"
        />

        <BaseSelect
          v-if="selectedType && selectedType !== 'tpf_school'"
          v-model="selectedInstitution"
          :options="institutionsSelect"
          @update:model-value="handleInstitutionChange"
          name="Institution"
          label="Institution"
          selectLabel="Vælg institution"
          rules="required"
        />
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
          type="date"
          name="Afviklingsdato"
          label="Afviklingsdato"
          rules="required"
        />
        <BaseInput
          class="application-form__label"
          v-model="departureTime"
          type="time"
          name="Afhentningstidspunkt for udrejse"
          label="Afhentningstidspunkt for udrejse"
        />
        <BaseInput
          class="application-form__label"
          v-model="returnTime"
          type="time"
          name="Afhentningstidspunkt for hjemrejse"
          label="Afhentningstidspunkt for hjemrejse"
        />
      </div>

      <div v-if="validated">
        <div class="field-group">
          <h3>Kontakt information</h3>
          <BaseInputFloatingLabel
            class="application-form__label"
            v-model="fullName"
            type="text"
            name="Navn på medfølgende voksen"
            label="Navn på medfølgende voksen"
            rules="required"
          />
          <BaseInputFloatingLabel
            class="application-form__label"
            v-model="email"
            type="text"
            name="E-mailadresse på medfølgende voksen"
            label="E-mailadresse på medfølgende voksen"
            rules="required|email"
          />
          <BaseInputFloatingLabel
            class="application-form__label"
            v-model="emailRepeat"
            type="text"
            name="Gentag e-mailadresse på medfølgende voksen"
            label="Gentag e-mailadresse på medfølgende voksen"
            rules="required|email"
          />
          <BaseInputFloatingLabel
            class="application-form__label"
            v-model="phone"
            type="text"
            name="Telefonnummer på medfølgende voksen"
            label="Telefonnummer på medfølgende voksen"
            rules="required"
          />
        </div>
        <div class="field-group">
          <h3>Besked</h3>
          <BaseTextareaFloatingLabel
            v-model="message"
            name="Evt. besked"
            label="Evt. besked"
            description="Fx kun transport én vej, ekstra plads til hjælpemidler eller bagage, særlige oplysninger om afhentningssted m.m."
          />
        </div>
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

    &--inline {
      display: flex;
      gap: 16px @(--sm) 24px;
      margin-top: 0 !important;

      .form-label {
        padding-right: 26px;
      }
    }
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

    :deep(p) {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
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
