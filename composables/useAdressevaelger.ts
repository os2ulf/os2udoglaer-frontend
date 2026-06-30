type AdressevaelgerSelectHandler = (selected: any) => void;

export const useAdressevaelger = async (
  inputElement: HTMLInputElement,
  onSelect: AdressevaelgerSelectHandler,
) => {
  const config = useRuntimeConfig();
  const token = config.public.ADRESSEVAELGER_TOKEN;

  if (!token) {
    console.error(
      'Adressevaelger token is missing. Set NUXT_PUBLIC_ADRESSEVAELGER_TOKEN.',
    );
    return;
  }

  if (!inputElement) {
    console.error('Adressevaelger input missing');
    return;
  }

  const { adressevaelger } = await import(
    '~/assets/vendor/adressevaelger/adressevaelger.esm.js'
  );

  adressevaelger(inputElement, {
    select: onSelect,
    token,
  });
};
