import { productionDomains } from '~/config/productionDomains';

export default defineEventHandler((event) => {
  if (event.node.req.url !== '/robots.txt') {
    return;
  }

  let robotsTxt = '';
  const host = event.node.req.headers.host;

  const prodRobotTxt = `
    User-agent: *
    Allow: /
    Disallow: /node/*
    Disallow: /search*



    # Sitemap
    Sitemap: https://${host}/sitemap.xml
  `;

  const stagingRobotTxt = `
    User-agent: *
    Disallow: /
    `;

  if (host && productionDomains.includes(host)) {
    robotsTxt = prodRobotTxt;
  } else {
    robotsTxt = stagingRobotTxt;
  }

  event.node.res.setHeader('Content-Type', 'text/plain');
  event.node.res.end(robotsTxt);
});
