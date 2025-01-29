import { decodeBase64 } from '~/utils/base64';
import { excludeEndpoints } from '~/config/excludedEndpoints';

export function getBackendDomain(currentFrontendDomain: string): string | null {
  const devEnv = 'localhost';
  let beEndpoint: string | null = null;

  // Assuming PLATFORM_ROUTES is already decoded in the config
  let allRoutes: Record<string, any> | null = null;

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

  // Extract backend routes
  const extractBackendRoutes = () => {
    if (!allRoutes) return null;
    const backendUrls = Object.keys(allRoutes).filter(
      (url) =>
        allRoutes![url]?.upstream === 'backend' &&
        !excludeEndpoints.includes(url),
    );
    return backendUrls.length > 0 ? backendUrls : null;
  };

  const onlyBackendRoutes = extractBackendRoutes();

  const getDomainName = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    return new URL(fullUrl).hostname.replace(/^www\./, '');
  };

  // Assign backend endpoint based on the frontend domain
  const assignBackendEndpoint = () => {
    if (!onlyBackendRoutes) return;

    const currentDomain = getDomainName(currentFrontendDomain);

    let selectedBackend = null;

    for (const route of onlyBackendRoutes) {
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

  // If devEnv is detected, use the dev endpoint
  if (currentFrontendDomain === devEnv) {
    beEndpoint =
      'https://api.ulfiaarhus.dk.staging-5em2ouy-4yghg26zberzk.eu-5.platformsh.site';
  } else {
    assignBackendEndpoint();
  }

  return beEndpoint;
}
