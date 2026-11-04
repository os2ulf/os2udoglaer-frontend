export default function useGetCurrentDomain() {
  let currentDomain = '';

  if (import.meta.server) {
    const hostHeader = useRequestHeaders();
    const rawDomain = hostHeader['x-forwarded-host'] || hostHeader.host || '';
    currentDomain = `https://${rawDomain}`;
  } else if (import.meta.client) {
    const rawDomain = window.location.hostname;
    currentDomain = `https://${rawDomain}`;
  }

  return currentDomain;
}
