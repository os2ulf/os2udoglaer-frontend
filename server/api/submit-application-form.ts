import { useApiRouteStore } from '~/stores/apiRouteEndpoint';

export default defineEventHandler(async (event) => {
  const apiRouteStore = useApiRouteStore();
  const backEndDomain = apiRouteStore.apiRouteEndpoint;
  console.log('backEndDomain', backEndDomain);

  const config = useRuntimeConfig();

  const body = await readBody(event);
  const credentials = `${config.REST_API_USER}:${config.REST_API_USER_PASS}`;
  const encodedCredentials = btoa(credentials);
  console.log('body', body);

  const normalizeDomain = (domain: string) => {
    if (!domain) {
      return;
    }

    return domain.replace(/https?:\/\//, '').replace(/:\d+/, '');
  };

  const currentDomain = normalizeDomain(event.node.req.headers.host);
  const requestOrigin = normalizeDomain(event.node.req.headers.origin);
  console.log('currentDomain', currentDomain);
  console.log('requestOrigin', requestOrigin);

  // BASIC ORIGIN HEADER CHECK
  // This is only a basic measure protection, real protection (if needed) should be implemented in the BE.
  if (!requestOrigin || requestOrigin !== currentDomain) {
    return {
      statusCode: 403,
      message: 'Forbidden: Not allowed to access.',
    };
  }

  try {
    const response = await fetch(backEndDomain + '/node?_format=json', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    const responseStatus = response.status;

    if (responseStatus === 200 || responseStatus === 201) {
      return {
        statusCode: responseStatus,
        message: 'Success',
        data: responseData,
      };
    }

    if (responseStatus === 400) {
      return {
        statusCode: responseStatus,
        message: 'Bad request',
        error: responseData,
      };
    }

    if (responseStatus === 401) {
      return {
        statusCode: responseStatus,
        message: 'Unauthorized',
        error: responseData,
      };
    }

    if (responseStatus === 403) {
      return {
        statusCode: 403,
        message: 'Forbidden',
        error: responseData,
      };
    }

    if (responseStatus === 404) {
      return {
        statusCode: 404,
        message: 'Not found',
        error: responseData,
      };
    }

    if (responseStatus === 500) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        error: responseData,
      };
    }

    // Handle any other status codes or errors
    return {
      statusCode: 500,
      message: 'Error on the external API level',
      error: responseData,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Error on the external API level',
      error: error.message,
    };
  }
});
