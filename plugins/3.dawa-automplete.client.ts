export default defineNuxtPlugin(() => {
  if (process.client) {
    const script = document.createElement('script');
    script.src =
      'https://cdn.dataforsyningen.dk/dawa/assets/dawa-autocomplete2/1.0.2/dawa-autocomplete2.min.js';
    script.async = true;
    document.head.appendChild(script);
  }
});
