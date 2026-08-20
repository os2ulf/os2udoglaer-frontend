declare module '~/assets/vendor/adressevaelger/adressevaelger.esm.js' {
  type AdressevaelgerOptions = {
    adgangsadresserOnly?: boolean;
    apiUrl?: string;
    kommuneKode?: string;
    maksimum?: number;
    medtagForeloebige?: boolean;
    select: (selectedItem: any) => void;
    token: string;
  };

  export function adressevaelger(
    element: HTMLElement,
    options: AdressevaelgerOptions,
  ): void;

  export default adressevaelger;
}
