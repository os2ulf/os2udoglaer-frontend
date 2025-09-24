import * as VeeValidate from 'vee-validate';
import { setLocale, localize } from '@vee-validate/i18n';
import rules from '@vee-validate/rules';
import da from '@vee-validate/i18n/dist/locale/da.json';

const includedRules = [
  'required',
  'email',
  'integer',
  'min_value',
  'max_value',
  'max',
  'min',
];

export default defineNuxtPlugin((nuxtApp) => {
  Object.keys(rules).forEach((rule) => {
    if (includedRules.includes(rule)) {
      VeeValidate.defineRule(rule, rules[rule]);
    }
  });

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
