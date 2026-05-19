import { ref } from 'vue'

let _headerPromise: Promise<any> | null = null
const headerData = ref<any>(null)
const loading = ref(false)

export function useHeaderData() {
  const { useRegion } = useRegionApi()

  const getHeaderData = async () => {
    if (headerData.value) return headerData.value
    if (_headerPromise) return _headerPromise

    loading.value = true

    _headerPromise = (async () => {
      const { data } = await useAsyncData('header', () =>
        useRegion('header')
      )

      headerData.value = data.value
      loading.value = false

      return headerData.value
    })()

    return _headerPromise
  }

  return {
    headerData,
    loading,
    getHeaderData,
  }
}