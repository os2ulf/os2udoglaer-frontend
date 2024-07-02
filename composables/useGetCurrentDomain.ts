export default function useGetCurrentDomain() {
  let currentDomain = '';

  if (process.server) {
    const hostHeader = useRequestHeaders();
    currentDomain = hostHeader['x-forwarded-host'] || hostHeader.host;

    if (
      !currentDomain.startsWith('http://') &&
      !currentDomain.startsWith('https://')
    ) {
      currentDomain = 'https://' + currentDomain;
    }
  } else if (process.client) {
    currentDomain = window.location.hostname;
  }

  return currentDomain;
}
