import { ref } from 'vue'

type GetSettingsDataOptions = {
  force?: boolean
}

let _settingsPromise: Promise<any> | null = null

const settingsData = ref<any>(null)
const isHeaderFixed = ref(false)

const cookieScript = ref<string | null>(null)
const trackingScript = ref<string | null>(null)

export function useSettingsData() {
  const { useRegion } = useRegionApi()

  const getSettingsData = async (options: GetSettingsDataOptions = {}) => {
    if (_settingsPromise) return _settingsPromise
    if (!options.force && settingsData.value) return settingsData.value

    _settingsPromise = (async () => {
      const data = await useRegion('settings')
      const raw = data?.settings
      if (!raw) return settingsData.value

      cookieScript.value = raw.site_cookie_script ?? null
      trackingScript.value = raw.site_tracking_script ?? null

      delete raw.site_cookie_script
      delete raw.site_tracking_script

      settingsData.value = raw
      return settingsData.value
    })()

    try {
      return await _settingsPromise
    } finally {
      _settingsPromise = null
    }
  }

  const getCookieScript = () => cookieScript.value
  const getTrackingScript = () => trackingScript.value

  const setIsHeaderFixed = (val: boolean) => {
    isHeaderFixed.value = val
  }

  return {
    settingsData,
    isHeaderFixed,
    cookieScript,
    trackingScript,
    getSettingsData,
    getCookieScript,
    getTrackingScript,
    setIsHeaderFixed,
  }
}
