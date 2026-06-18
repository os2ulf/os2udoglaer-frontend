import { computed } from 'vue'
import { useSettingsData } from '@/composables/useSettingsData'

function hasValue(v: unknown): boolean {
  return typeof v === 'string'
    ? v.trim().length > 0
    : v !== null && v !== undefined
}

export function useButtonColors() {
  const settings = useSettingsData()

  const hasPrimaryButtonColors = computed(() => {
    const s = settings.settingsData.value || {}

    return (
      hasValue(s.primary_button_color) &&
      hasValue(s.primary_button_text_color) &&
      hasValue(s.primary_button_hover_color) &&
      hasValue(s.primary_button_hover_text_color)
    )
  })

  const hasSecondaryButtonColors = computed(() => {
    const s = settings.settingsData.value || {}

    return (
      hasValue(s.secondary_button_color) &&
      hasValue(s.secondary_button_text_color) &&
      hasValue(s.secondary_button_hover_color) &&
      hasValue(s.secondary_button_hover_text_color)
    )
  })

  return {
    hasPrimaryButtonColors,
    hasSecondaryButtonColors,
  }
}