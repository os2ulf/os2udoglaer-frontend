export const useDawaAutocomplete = async (inputElement: HTMLInputElement, onSelect: (selected: any) => void) => {
  const { $loadDawaAutocomplete } = useNuxtApp()

  await $loadDawaAutocomplete()

  if (window.dawaAutocomplete && inputElement) {
    window.dawaAutocomplete(inputElement, {
      select: onSelect
    })
  }
}