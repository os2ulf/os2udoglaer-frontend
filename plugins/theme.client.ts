import { useSettingsData } from '~/composables/useSettingsData'

function hexToRgb(hex: string) {
  if (!hex || !hex.startsWith('#')) return '255, 255, 255'

  const bigint = parseInt(hex.slice(1), 16)
  return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`
}

function setVar(key: string, value: any, fallback = '') {
  document.documentElement.style.setProperty(key, value ?? fallback)
}

function applyTheme(data: any) {
  if (!data) return

  const root = document.documentElement

  // ---------------- FONT ----------------
  const font = data.font

  if (font === 'Roboto') {
    root.style.setProperty('--body-font-family', "'Roboto Slab', sans-serif")
    root.style.setProperty('--heading-font-family', "'Roboto', sans-serif")
    root.style.setProperty('--body-font-weight', '300')
  } else if (font) {
    root.style.setProperty('--body-font-family', `'${font}', sans-serif`)
    root.style.setProperty('--heading-font-family', `'${font}', sans-serif`)
  }

  // ---------------- DEFAULT COLORS ----------------
  const primary = data.primary_background_color ?? '#297F78'
  const secondary = data.secondary_background_color ?? '#FBD800'
  const tertiary = data.tertiary_background_color ?? '#40362E'

  const primaryText = data.primary_background_text_color ?? '#fff'
  const secondaryText = data.secondary_background_text_color ?? '#000'
  const tertiaryText = data.tertiary_background_text_color ?? '#fff'

  root.style.setProperty('--color-primary', primary)
  root.style.setProperty('--color-primary-rgb', hexToRgb(primary))
  root.style.setProperty('--color-primary-text', primaryText)

  root.style.setProperty('--color-secondary', secondary)
  root.style.setProperty('--color-secondary-text', secondaryText)

  root.style.setProperty('--color-tertiary', tertiary)
  root.style.setProperty('--color-tertiary-text', tertiaryText)

  // ---------------- BUTTONS (ALWAYS SET) ----------------
  setVar('--color-primary-button-color', data.primary_button_color)
  setVar('--color-primary-button-text-color', data.primary_button_text_color)
  setVar('--color-primary-button-hover-color', data.primary_button_hover_color)
  setVar('--color-primary-button-hover-text-color', data.primary_button_hover_text_color)

  setVar('--color-secondary-button-color', data.secondary_button_color)
  setVar('--color-secondary-button-text-color', data.secondary_button_text_color)
  setVar('--color-secondary-button-hover-color', data.secondary_button_hover_color)
  setVar('--color-secondary-button-hover-text-color', data.secondary_button_hover_text_color)

  // ---------------- TEXT ----------------
  root.style.setProperty(
    '--color-text',
    data.text_positive_color ?? '#000'
  )
}

export default defineNuxtPlugin(async () => {
  const settings = useSettingsData()

  await settings.getSettingsData({ force: true })

  const run = () => {
    const data = settings.settingsData.value
    if (!data) return
    applyTheme(data)
  }

  run()

  watch(
    () => settings.settingsData.value,
    (data) => {
      if (data) applyTheme(data)
    }
  )
})
