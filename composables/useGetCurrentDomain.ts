export default function useGetCurrentDomain() {
  let currentDomain = '';

  if (process.server) {
    const event = useRequestEvent();

    if (event) {
      const hostHeader = event.node.req.headers;
      const rawDomain = hostHeader['x-forwarded-host'] || hostHeader.host || '';
      currentDomain = `https://${rawDomain}`;
    }
  } else if (process.client) {
    const rawDomain = window.location.hostname;
    currentDomain = `https://${rawDomain}`;
  }

  return currentDomain;
}
