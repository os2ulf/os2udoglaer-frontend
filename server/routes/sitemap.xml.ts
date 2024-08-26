import { getBackendDomain } from '~/composables/getBackendDomain';
import axios, { AxiosResponse } from 'axios';
import { appendHeader } from 'h3';

export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event);
  const backendUrl = getBackendDomain(headers);

  appendHeader(event, 'Content-Type', 'application/xml; charset=utf-8');

  const sitemapReq: AxiosResponse<any> = await axios.get(
    `${backendUrl}/sitemap.xml`,
  );

  console.log('backendUrl', backendUrl);

  let response = sitemapReq.data;

  // Replace the external XSL stylesheet with the local one
  const externalStylesheet =
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
  response = response.replace(/<\?xml-stylesheet.*?\?>/, externalStylesheet);

  // Replacing HTTP links with HTTPS URLs
  const replaceHttp = new RegExp('http://', 'g');
  response = response.replace(replaceHttp, 'https://');

  console.log('response sitemap', response);
  return response;
});
