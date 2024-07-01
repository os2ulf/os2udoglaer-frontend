<script setup lang="ts">
import { Field, Form } from 'vee-validate';

const props = defineProps({
  contactPersonEmail: {
    type: String,
    default: '',
    required: true,
  },
});

const config = useRuntimeConfig().public;

const fullName = ref('');
const email = ref('');
const message = ref('');
const errorMessage = ref('');
const agreementCheckbox = ref(false);
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
  const trimmedEmail = email.value.trim();
  const trimmedMessage = message.value.trim();

  const payload = {
    webform_id: 'contact_provider',
    name: trimmedFullName,
    message: trimmedMessage,
    email: trimmedEmail,
    provider_email: props.contactPersonEmail,
  };

  try {
    const response = await fetch(config.API_BASE_URL + '/webform_rest/submit', {
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
                Uddyb venligst din henvendelse
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

      <Field
        v-slot="{ field, errors }"
        v-model="agreementCheckbox"
        name="consent"
        label="Samtykke lorem ipsum dolor sit amet"
        type="checkbox"
        :value="true"
        rules="required"
        :validate-on-change="false"
        :validate-on-blur="false"
        :validate-on-model-update="false"
        :validate-on-input="false"
      >
        <label class="contact-form__checkbox">
          <input
            type="checkbox"
            v-bind="field"
            :value="true"
            :class="errors[0] ? 'contact-form__checkbox--invalid' : ''"
          />
          Samtykke lorem ipsum dolor sit amet
        </label>
        <Transition name="bounce">
          <span
            v-if="errors[0]"
            role="alert"
            class="form-validation-feedback form-validation-feedback--invalid"
            >{{ errors[0] }}</span
          >
        </Transition>
      </Field>

      <input type="text" v-model="honeypot" class="contact-form__honeypot" />

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
    <h2 class="contact-form__success">Tak, Din besked er blevet sendt.</h2>
  </div>
</template>

<style lang="postcss" scoped>
.contact-form {
  display: flex;
  flex-flow: column;

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

  .custom-checkbox {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid var(--color-gray-25);
    border-radius: 4px;
    margin-right: 8px;
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

  &__honeypot {
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
