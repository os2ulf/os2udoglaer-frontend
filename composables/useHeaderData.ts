import { ref } from 'vue'

const headerData = ref<any>(null)
let promise: Promise<any> | null = null

export function useHeaderData() {
  const { useRegion } = useRegionApi()

  const getHeaderData = async () => {
    if (headerData.value) return headerData.value
    if (promise) return promise

    promise = (async () => {
      const data = await useRegion('header')
      headerData.value = data
      return headerData.value
    })()

    return promise
  }

  return {
    headerData,
    getHeaderData,
  }
}