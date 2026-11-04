const http = require('node:http');

// This fixture checks the frontend's transport and response envelopes. It does
// not validate Drupal entity fields or persist application submissions.
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'POST' && url.pathname === '/node') {
    if (url.searchParams.get('_format') !== 'json') {
      res.writeHead(400).end();
      return;
    }
    const fixtureAuthorization = `Basic ${Buffer.from('fixture-user:fixture-pass').toString('base64')}`;
    if (req.headers.authorization !== fixtureAuthorization) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Expected local fixture credentials' }));
      return;
    }
    if (req.body?.fixture === 'invalid-json') {
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON fixture');
      return;
    }
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ fixture: 'accepted', title: req.body?.title }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/sitemap.xml') {
    const path = url.searchParams.has('page') ? 'paged-course' : 'course';
    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(`<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="http://example.test/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>http://example.test/${path}-one</loc><xhtml:link rel="alternate" href="http://example.test/alternate" /></url>
  <url><loc>http://example.test/${path}-two</loc><lastmod>2026-10-28</lastmod></url>
</urlset>`);
    return;
  }

  res.writeHead(501, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'This fixture does not model this endpoint' }));
}).listen(process.env.PORT || 4901, '127.0.0.1');
