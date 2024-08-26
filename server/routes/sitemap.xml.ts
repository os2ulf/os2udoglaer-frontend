import { getBackendDomain } from '~/composables/getBackendDomain';
import axios, { AxiosResponse } from 'axios';
import { appendHeader } from 'h3';

export default defineEventHandler(async (event) => {
  // Get the request headers
  const headers = getRequestHeaders(event);

  // Get the backend URL using the utility function
  const backendUrl = getBackendDomain(headers);
  console.log('backendUrl', backendUrl);

  appendHeader(event, 'Content-Type', 'application/xml; charset=utf-8');

  const sitemapReq: AxiosResponse<any> = await axios.get(
    `${backendUrl}/sitemap.xml`,
  );

  // Get the response data
  let response = sitemapReq.data;

  // Dont render XSL stylesheet cross-domain
  const removeStylesheet =
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';

  response = sitemapReq.data.replace(removeStylesheet, '');

  // Replacing HTTP links with https url!
  const replaceHttp = new RegExp('http://', 'g');

  response = response.replace(replaceHttp, 'https://');
  console.log('Sitemap', response);

  return response;
});
