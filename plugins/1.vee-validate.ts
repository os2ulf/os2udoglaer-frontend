import { defineRule } from 'vee-validate';
import rules from '@vee-validate/rules';

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
});
