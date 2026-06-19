export function useHeaderData() {
  const { useRegion } = useRegionApi()
  const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & {
    _headerPromise?: Promise<any> | null
  }

  const headerData = useState<any>('header-data', () => null)

  const getHeaderData = async () => {
    if (headerData.value) return headerData.value
    if (nuxtApp._headerPromise) return nuxtApp._headerPromise

    nuxtApp._headerPromise = (async () => {
      const data = await useRegion('header')
      headerData.value = data
      return headerData.value
    })()

    try {
      return await nuxtApp._headerPromise
    } finally {
      nuxtApp._headerPromise = null
    }
  }

  return {
    headerData,
    getHeaderData,
  }
}
