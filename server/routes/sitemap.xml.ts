import axios, { AxiosResponse } from 'axios';
import { appendHeader } from 'h3';

export default defineEventHandler(async (event) => {
  appendHeader(event, 'Content-Type', 'application/xml; charset=utf-8');

  // Have to use NUXT_PUBLIC_API_BASE_URL because simply API_BASE_URL doesnt work on the server. However this solution doesnt work on localhost out of the box
  // so for the workaround, create a var in .env file with NUXT_PUBLIC_API_BASE_URL containing the same value as API_BASE_URL
  const sitemapReq: AxiosResponse<any> = await axios.get(
    `${process.env.NUXT_PUBLIC_API_BASE_URL}/sitemap.xml`,
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
  console.log(response);

  return response;
});
