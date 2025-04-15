export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('loadDawaAutocomplete', () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && window.dawaAutocomplete) {
        resolve()
        return
      }

      const existingScript = document.querySelector('script[src="https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/dawa-autocomplete2.min.js"]')
      if (existingScript) {
        const waitForGlobal = () => {
          if (window.dawaAutocomplete) {
            resolve()
          } else {
            setTimeout(waitForGlobal, 50)
          }
        }
        waitForGlobal()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/dawa-autocomplete2.min.js'
      script.async = true
      script.onload = () => {
        const waitForGlobal = () => {
          if (window.dawaAutocomplete) {
            resolve()
          } else {
            setTimeout(waitForGlobal, 50)
          }
        }
        waitForGlobal()
      }
      script.onerror = (err) => reject(err)
      document.head.appendChild(script)
    })
  })
})