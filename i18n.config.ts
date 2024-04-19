import da from './locales/da-DK.json';
import en from './locales/en-US.json';

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: 'da-DK',
  langDir: 'locales',
  messages: {
    'da-DK': da,
    'en-US': en,
  },
}));
