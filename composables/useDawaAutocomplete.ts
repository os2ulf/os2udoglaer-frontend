export const useDawaAutocomplete = async (
  inputElement: HTMLInputElement,
  onSelect: (selected: any) => void
) => {
  const { $loadDawaAutocomplete } = useNuxtApp()

  await $loadDawaAutocomplete()

  if (window.dawaAutocomplete?.dawaAutocomplete && inputElement) {
    window.dawaAutocomplete.dawaAutocomplete(inputElement, {
      select: onSelect
    })
  } else {
    console.error('DAWA Autocomplete not loaded or input missing')
  }
}