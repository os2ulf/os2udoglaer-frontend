import { useCookieConsentStatusStore } from '~~/stores/checkCookieConsent';
const cookieStore = useCookieConsentStatusStore();
// global var for marketing consent state

export default function useCookieReply() {
  const hasNecessaryConsent = ref(false);
  const hasPreferencesConsent = ref(false);
  const hasStatisticsConsent = ref(false);

  const cookieMarketingConsent = cookieStore.checkCookieMarketingConsent();
  const hasMarketingConsent = ref(cookieMarketingConsent);

  if (process.client) {
    (window as any).addEventListener('CookiebotOnLoad', () => {
      const cookiebot = (window as any).Cookiebot || {};
      const consent = cookiebot.consent;

      if (consent) {
        hasNecessaryConsent.value = consent.necessary;
        hasPreferencesConsent.value = consent.preferences;
        hasStatisticsConsent.value = consent.statistics;
        hasMarketingConsent.value = consent.marketing;
      }
    });
  }

  return {
    hasNecessaryConsent,
    hasPreferencesConsent,
    hasStatisticsConsent,
    hasMarketingConsent,
  };
}
