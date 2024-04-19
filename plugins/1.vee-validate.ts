import { setLocale, localize } from '@vee-validate/i18n';
import { defineRule, configure } from 'vee-validate';

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
      defineRule(rule, rules[rule]);
    }
  });

  configure({
    generateMessage: localize({
      'da-DK': da,
    }),
  });

  setLocale('da-DK');
});
