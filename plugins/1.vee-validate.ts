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

  VeeValidate.configure({
    generateMessage: localize({
      'da-DK': da,
    }),
  });

  setLocale('da-DK');
});
