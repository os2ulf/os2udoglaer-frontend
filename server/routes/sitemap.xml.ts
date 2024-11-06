import { getBackendDomain } from '~/composables/getBackendDomain';
import axios, { AxiosResponse } from 'axios';
import { appendHeader, getQuery } from 'h3';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export default defineEventHandler(async (event) => {
  appendHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  const headers = getRequestHeaders(event);
  const backendUrl = getBackendDomain(headers);
  const query = getQuery(event);
  const page = parseInt(query.page as string) || null;

  // If there's a query parameter for page
  if (page) {
    const sitemapReq: AxiosResponse<any> = await axios.get(
      `${backendUrl}/sitemap.xml?page=${page}`,
    );

    let response = sitemapReq.data;

    // Replace the external XSL stylesheet with the local one
    const externalStylesheet =
      '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
    response = response.replace(/<\?xml-stylesheet.*?\?>/, externalStylesheet);

    // Replace HTTP with HTTPS URLs
    const replaceHttp = new RegExp('http://', 'g');
    response = response.replace(replaceHttp, 'https://');

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    let xmlData = parser.parse(response);

    if (xmlData.urlset?.url) {
      xmlData.urlset.url.forEach((urlEntry) => {
        // Remove <xhtml:link> from each URL entry
        if (urlEntry['xhtml:link']) {
          delete urlEntry['xhtml:link'];
        }
      });
    }

    // Convert the modified JS object back to XML
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    response = builder.build(xmlData);

    return response;
  } else {
    const sitemapReq: AxiosResponse<any> = await axios.get(
      `${backendUrl}/sitemap.xml`,
    );
    let response = sitemapReq.data;

    // Replace the external XSL stylesheet with the local one
    const externalStylesheet =
      '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
    response = response.replace(/<\?xml-stylesheet.*?\?>/, externalStylesheet);

    // Replace HTTP with HTTPS URLs
    const replaceHttp = new RegExp('http://', 'g');
    response = response.replace(replaceHttp, 'https://');

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    let xmlData = parser.parse(response);

    if (xmlData.urlset?.url) {
      xmlData.urlset.url.forEach((urlEntry) => {
        // Remove <xhtml:link> if present
        if (urlEntry['xhtml:link']) {
          delete urlEntry['xhtml:link'];
        }
      });
    }

    // Convert the modified JS object back to XML
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    response = builder.build(xmlData);

    // if table of sitemap pagination
    if (response.includes('<sitemapindex')) {
      const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
      const parser = new XMLParser();
      const xmlData = parser.parse(response);
      const sitemaps = xmlData.sitemapindex.sitemap;

      const builder = new XMLBuilder({
        format: true,
        ignoreAttributes: false,
        suppressEmptyNode: true,
      });

      // Add the xmlns attribute only to <sitemapindex>
      const xmlBody = builder.build({
        sitemapindex: {
          '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
          sitemap: sitemaps,
        },
      });

      return xmlDeclaration + '\n' + xmlBody;
    }

    return response;
  }
});
