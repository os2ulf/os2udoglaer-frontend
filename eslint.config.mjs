import withNuxt from './.nuxt/eslint.config.mjs';
import vue from 'eslint-plugin-vue';

export default withNuxt({
  ignores: ['assets/vendor/**', 'vendor/**'],
})
  .override('nuxt/vue/rules', (config) => ({
    ...config,
    // Check Vue correctness; leave formatting to the existing Prettier setup.
    rules: Object.assign(
      {},
      ...vue.configs['flat/essential'].map((config) => config.rules),
      { 'vue/no-unused-vars': 'warn' },
    ),
  }))
  .append(
    {
      rules: {
        // CMS responses are not fully typed yet. Avoid imposing a typing migration.
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-nocheck': false }],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        // Report existing cleanup opportunities without blocking dependency updates.
        'nuxt/prefer-import-meta': 'warn',
        'import/first': 'warn',
      },
    },
    {
      files: ['components/globals/GlobalScriptInjections.vue'],
      // This renderless component only adds scripts through useHead.
      rules: { 'vue/valid-template-root': 'off' },
    },
  );
