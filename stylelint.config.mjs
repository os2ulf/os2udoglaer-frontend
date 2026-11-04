/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recommended'],
  ignoreFiles: ['assets/vendor/**', '.nuxt/**', '.output/**', 'node_modules/**'],
  overrides: [{ files: ['**/*.vue'], customSyntax: 'postcss-html' }],
  rules: {
    // Vue scoped styles and PostCSS nesting extend CSS selector syntax.
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['deep', 'global', 'slotted'] },
    ],
    // Sass-style BEM suffixes are not resolved by Stylelint's native CSS nesting rules.
    // Repeated selectors also intentionally layer component and vendor overrides.
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    // Retain the existing wrapping and native-control appearance during this upgrade.
    'property-no-deprecated': [true, { ignoreProperties: ['word-wrap'] }],
    'declaration-property-value-keyword-no-deprecated': [
      true,
      { ignoreKeywords: ['break-word', 'button', 'listbox'] },
    ],
  },
};
