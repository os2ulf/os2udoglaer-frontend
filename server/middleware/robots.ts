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
    Disallow: /maintenance
    Disallow: /forbidden



    # Sitemap
    Sitemap: https://${host}/sitemap.xml
  `;

  const stagingRobotTxt = `
    User-agent: *
    Disallow: /
    `;

  const prodDomains = [
    'aabenaalborg.dk',
    'www.aabenaalborg.dk',
    'ulfiaarhus.dk',
    'www.ulfiaarhus.dk',
    'udsynmodarbejdsliv.dk',
    'www.udsynmodarbejdsliv.dk',
    'mitvadehav.dk',
    'www.mitvadehav.dk',
    'ude.nu',
    'www.ude.nu',
    'udoglaer.randers.dk',
    'www.udoglaer.randers.dk',
    'udoglaer.dk',
    'www.udoglaer.dk',
    'laeringsportalenskive.dk',
    'www.laeringsportalenskive.dk',
    'rum.thisted.dk',
    'www.rum.thisted.dk',
    'udoglaer.vejle.dk',
    'www.udoglaer.vejle.dk',
    'klcviborg.dk',
    'www.klcviborg.dk',
  ];

  if (host && prodDomains.includes(host)) {
    robotsTxt = prodRobotTxt;
  } else {
    robotsTxt = stagingRobotTxt;
  }

  event.node.res.setHeader('Content-Type', 'text/plain');
  event.node.res.end(robotsTxt);
});
