export default function useGetCurrentDomain() {
  let currentDomain = '';

  if (process.server) {
    const hostHeader = useRequestHeaders();
    const rawDomain = hostHeader['x-forwarded-host'] || hostHeader.host || '';
    currentDomain = `https://${rawDomain}`;
  } else if (process.client) {
    const rawDomain = window.location.hostname;
    currentDomain = `https://${rawDomain}`;
  }

  return currentDomain;
}
