export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);
  const beDataWellEndpoint = config.public.API_BASE_URL;
  const credentials = `${config.REST_API_USER}:${config.REST_API_USER_PASS}`;
  const encodedCredentials = btoa(credentials);

  const normalizeDomain = (domain: string) => {
    if (!domain) {
      return;
    }

    return domain.replace(/https?:\/\//, '').replace(/:\d+/, '');
  };

  console.log('creds', credentials);
  console.log('encodedCreds', encodedCredentials);
  console.log('beDataWellEndpoint', beDataWellEndpoint);

  const currentDomain = normalizeDomain(event.node.req.headers.host);
  const requestOrigin = normalizeDomain(event.node.req.headers.origin);

  // BASIC ORIGIN CHECK
  if (requestOrigin) {
    console.log('current FE Domain:', currentDomain);
    console.log('request Origin:', requestOrigin);

    if (requestOrigin !== currentDomain) {
      return {
        statusCode: 403,
        message: 'Forbidden: CORS policy does not allow this origin.',
      };
    }
  } else {
    return {
      statusCode: 403,
      message: 'Forbidden: CORS policy does not allow this origin.',
    };
  }

  try {
    const response = await fetch(beDataWellEndpoint + '/node?_format=json', {
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
        statusCode: 200,
        message: 'Success',
        data: responseData,
      };
    }

    if (responseStatus === 400) {
      return {
        statusCode: 400,
        message: 'Bad request',
        error: responseData,
      };
    }

    if (responseStatus === 401) {
      return {
        statusCode: 401,
        message: 'Unauthorized',
        error: responseData,
      };
    }

    if (responseStatus === 403) {
      console.log('Forbidden console log 403', responseData);

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
      message: 'Error while contacting the external API',
      error: responseData,
    };
  } catch (error) {
    // Handle any potential errors during the request
    return {
      statusCode: 500,
      message: 'Error while contacting the external API',
      error: error.message,
    };
  }
});
