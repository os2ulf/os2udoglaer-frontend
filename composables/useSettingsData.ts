import { ref } from 'vue'

let _settingsPromise: Promise<void> | null = null
let _settingsFetched = false

const settingsData = ref<any>(null)
const isHeaderFixed = ref(false)

// non-reactive script storage
let cookieScript: string | null = null
let trackingScript: string | null = null

export function useSettingsData() {
  const { useRegion } = useRegionApi()

  const getSettingsData = async () => {
    // 👇 hard cache guard (stop duplicate calls)
    if (_settingsFetched) return
    if (_settingsPromise) return _settingsPromise

    _settingsPromise = (async () => {
      const { data } = await useAsyncData('settings', () =>
        useRegion('settings'),
      )

      const raw = data.value?.settings
      if (!raw) return

      cookieScript = raw.site_cookie_script ?? null
      trackingScript = raw.site_tracking_script ?? null

      delete raw.site_cookie_script
      delete raw.site_tracking_script

      settingsData.value = raw
      _settingsFetched = true
    })()

    return _settingsPromise
  }

  const getCookieScript = () => cookieScript
  const getTrackingScript = () => trackingScript

  const setIsHeaderFixed = (val: boolean) => {
    isHeaderFixed.value = val
  }

  return {
    settingsData,
    isHeaderFixed,
    getSettingsData,
    getCookieScript,
    getTrackingScript,
    setIsHeaderFixed,
  }
}
