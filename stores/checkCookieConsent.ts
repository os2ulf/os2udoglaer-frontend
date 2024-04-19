import { defineStore } from 'pinia';

export const useCookieConsentStatusStore = defineStore('cookieConsent', () => {
  //  This store only checks marketing cookie consent
  const checkCookieMarketingConsent = () => {
    if (process.client) {
      const cookiebot = (window as any).Cookiebot || {};
      const consent = cookiebot.consent;

      // set marketing consent
      if (consent) {
        return consent.marketing;
      }
    }
  };

  return {
    checkCookieMarketingConsent,
  };
});
