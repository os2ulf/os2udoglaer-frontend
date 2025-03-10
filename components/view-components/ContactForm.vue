<script setup lang="ts">
import { Field, Form } from 'vee-validate';
import { useApiRouteStore } from '~/stores/apiRouteEndpoint';

const props = defineProps({
  contactPersonEmail: {
    type: null, // Had to change the type, there are some pages on the BE that returns null causing this to give warnings.
    default: '',
    required: true,
  },
  contactPersonName: {
    type: String,
    default: '',
    required: true,
  },
  currentUrl: {
    type: String,
    default: '',
    required: true,
  },
  currentTitle: {
    type: String,
    default: '',
    required: true,
  },
});

const apiRouteStore = useApiRouteStore();
const backEndDomain = ref(apiRouteStore.apiRouteEndpoint);
const fullName = ref('');
const phone = ref('');
const email = ref('');
const message = ref('');
const errorMessage = ref('');
const agreementCheckbox = ref(true);
const isSuccess = ref(false);
const isLoading = ref(false);
const honeypot = ref('');

const handleSubmit = async () => {
  if (honeypot.value !== '' || !agreementCheckbox.value) {
    errorMessage.value =
      'Der er opstået en fejl under udfyldning af formularen, venligst udfyld formularen korrekt.';
    return;
  } else if (!props.contactPersonEmail) {
    errorMessage.value =
      'Der blev ikke angivet en e-mailadresse af udbyderen. Dette er ikke din fejl. Venligst kontakt udbyderen på en anden måde.';
    return;
  }

  isLoading.value = true;
  const trimmedFullName = fullName.value.trim();
  const trimmedPhone = phone.value.trim();
  const trimmedEmail = email.value.trim();
  const trimmedMessage = message.value.trim();

  const payload = {
    webform_id: 'contact_provider',
    name: trimmedFullName,
    message: trimmedMessage,
    phone: trimmedPhone,
    email: trimmedEmail,
    provider_email: props.contactPersonEmail,
    url: props.currentUrl,
    title: props.currentTitle,
  };

  try {
    const response = await fetch(backEndDomain.value + '/webform_rest/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  if (message.value === '') {
    showHelper.value = true;
  }
}
</script>

<template>
  <div class="contact-form" v-if="!isSuccess">
    <h3 class="contact-form__title">Send besked til {{ contactPersonName }}</h3>
    <Form @submit="handleSubmit()">
      <BaseInputFloatingLabel
        class="contact-form__label"
        v-model="fullName"
        type="text"
        name="name"
        label="Fulde navn"
        rules="required"
      />
      <BaseInputFloatingLabel
        class="contact-form__label"
        v-model="phone"
        type="text"
        name="phone"
        label="Telefonnummer"
        rules="required"
      />
      <BaseInputFloatingLabel
        class="contact-form__label"
        v-model="email"
        type="text"
        name="email"
        label="E-mailadresse"
        rules="required|email"
      />

      <div class="contact-form__textarea-wrapper">
        <div class="contact-form__textarea-container">
          <Field
            v-slot="{ field, errors }"
            name="message"
            label="Besked"
            rules="required"
            v-model="message"
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
                v-if="showHelper && !message"
                class="contact-form__helper-text"
              >
                Besked
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
          <div class="contact-form__textarea-description">
            Hvis du vil booke et forløb, så angiv venligst så mange
            informationer som muligt - f.eks. skole eller institution,
            klassetrin eller alder, antal børn, forslag til dato, dit tlf. nr.
            og andre informationer, der kan være gavnlige for udbyderen. Send
            ikke personfølsomme oplysninger i denne formular.
          </div>
        </div>
      </div>

      <input type="text" v-model="honeypot" class="contact-form__website" />

      <button
        v-if="!isLoading"
        class="button button--primary contact-form__button"
        aria-label="Send besked"
        type="submit"
      >
        Send besked
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
    <h2 class="contact-form__success">
      Tak! Din besked er sendt til {{ contactPersonName }}.
    </h2>
  </div>
</template>

<style lang="postcss" scoped>
.contact-form {
  display: flex;
  flex-flow: column;

  &__title {
    word-break: break-word;
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
    margin-top: 32px;
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
</style>
