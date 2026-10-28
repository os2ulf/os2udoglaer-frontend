import * as VeeValidate from 'vee-validate';
import { setLocale, localize } from '@vee-validate/i18n';
import * as rules from '@vee-validate/rules';
import da from '@vee-validate/i18n/dist/locale/da.json';

export default defineNuxtPlugin(() => {
  VeeValidate.defineRule('required', rules.required);
  VeeValidate.defineRule('email', rules.email);
  VeeValidate.defineRule('integer', rules.integer);
  VeeValidate.defineRule('min_value', rules.min_value);
  VeeValidate.defineRule('max_value', rules.max_value);
  VeeValidate.defineRule('max', rules.max);
  VeeValidate.defineRule('min', rules.min);

  VeeValidate.defineRule('not_past', (value: string) => {
    if (!value) return true;
    const selected = new Date(value);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (
      selected >= now ||
      'Vælg venligst en dato fra dags dato og frem - og husk altid at tjekke puljens betingelser.'
    );
  });

  VeeValidate.configure({
    generateMessage: localize({
      'da-DK': da,
    }),
  });

  setLocale('da-DK');
});
