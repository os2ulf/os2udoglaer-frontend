import { decodeBase64 } from '~/utils/base64';
import { excludeEndpoints } from '~/config/excludedEndpoints';

// used for server side only.
export function getBackendDomain(headers?: Record<string, string>) {
  let allRoutes: Record<string, any> | null = null;
  let beEndpoint: string | null = null;

  if (process.env.PLATFORM_ROUTES) {
    try {
      const encodedPlatformRoutes = process.env.PLATFORM_ROUTES;
      const decodedRoutes = decodeBase64(encodedPlatformRoutes);
      allRoutes = JSON.parse(decodedRoutes);
    } catch (error) {
      console.error('Error decoding or parsing PLATFORM_ROUTES:', error);
      allRoutes = null;
    }
  }

  const extractBackendRoutes = () => {
    if (!allRoutes) {
      return null;
    }

    const backendUrls = Object.keys(allRoutes).filter(
      (url) =>
        allRoutes![url]?.upstream === 'backend' &&
        !excludeEndpoints.includes(url),
    );

    return backendUrls.length > 0 ? backendUrls : null;
  };

  const onlyBackendRoutes = extractBackendRoutes();

  const getDomainName = (url: string) => {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, '');
  };

  const assignBackendEndpoint = () => {
    const currentDomain =
      headers && (headers['x-forwarded-host'] || headers.host)
        ? headers['x-forwarded-host'] || headers.host
        : 'localhost';

    let selectedBackend = null;

    for (const route of onlyBackendRoutes!) {
      const backendDomain = getDomainName(route);

      if (currentDomain.includes(backendDomain.replace('api.', ''))) {
        selectedBackend = route;
        break;
      }
    }

    if (!selectedBackend) {
      throw new Error(
        'No matching backend route found for the current frontend domain',
      );
    }

    beEndpoint = selectedBackend.endsWith('/')
      ? selectedBackend.slice(0, -1)
      : selectedBackend;
  };

  if (headers && headers.host === 'localhost:3000') {
    beEndpoint = 'https://staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site';
  } else {
    assignBackendEndpoint();
  }

  return beEndpoint;
}
