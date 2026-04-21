import { computed } from 'vue'
import { useSettingsDataStore } from '@/stores/settingsData'

function hasValue(v: unknown): boolean {
  return typeof v === 'string'
    ? v.trim().length > 0
    : v !== null && v !== undefined
}

export function useButtonColors() {
  const store = useSettingsDataStore()

  const hasPrimaryButtonColors = computed(() => {
    const s = store.settingsData || {}

    return (
      hasValue(s.primary_button_color) &&
      hasValue(s.primary_button_text_color) &&
      hasValue(s.primary_button_hover_color) &&
      hasValue(s.primary_button_hover_text_color)
    )
  })

  const hasSecondaryButtonColors = computed(() => {
    const s = store.settingsData || {}

    return (
      hasValue(s.secondary_button_color) &&
      hasValue(s.secondary_button_text_color) &&
      hasValue(s.secondary_button_hover_color) &&
      hasValue(s.secondary_button_hover_text_color)
    )
  })

  return {
    hasPrimaryButtonColors,
    hasSecondaryButtonColors
  }
}