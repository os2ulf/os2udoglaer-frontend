type GetSettingsDataOptions = {
  force?: boolean
}

export function useSettingsData() {
  const { useRegion } = useRegionApi()
  const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
    _settingsPromise?: Promise<any> | null
  }

  const settingsData = useState<any>('settings-data', () => null)
  const isHeaderFixed = useState('is-header-fixed', () => false)
  const cookieScript = useState<string | null>('settings-cookie-script', () => null)
  const trackingScript = useState<string | null>('settings-tracking-script', () => null)

  const getSettingsData = async (options: GetSettingsDataOptions = {}) => {
    if (nuxtApp._settingsPromise) return nuxtApp._settingsPromise
    if (!options.force && settingsData.value) return settingsData.value

    nuxtApp._settingsPromise = (async () => {
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
      return await nuxtApp._settingsPromise
    } finally {
      nuxtApp._settingsPromise = null
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
