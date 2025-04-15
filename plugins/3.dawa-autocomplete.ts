export default defineNuxtPlugin(() => {
  if (process.client) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/dawa-autocomplete2@2.0.0/dist/js/dawa-autocomplete2.min.js'
    script.async = true
    document.head.appendChild(script)
  }
})