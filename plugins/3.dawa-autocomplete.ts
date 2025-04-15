export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('loadDawaAutocomplete', () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && window.dawaAutocomplete) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/dawa-autocomplete2.min.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = (err) => reject(err)
      document.head.appendChild(script)
    })
  })
})