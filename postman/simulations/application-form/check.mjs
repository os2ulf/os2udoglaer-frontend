import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = new URL(process.env.TEST_APP_URL || 'http://localhost:3100');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) {
  throw new Error('Run these submission fixtures against a local test app.');
}
const reports = mkdtempSync(join(tmpdir(), 'os2-typescript-api-'));
const cases = [
  {
    name: 'submission', method: 'POST', path: '/api/submit-application-form',
    origin: base.origin, body: { title: 'TypeScript regression fixture' },
    check: `pm.test('Success envelope and submitted JSON are preserved', () => {
      pm.response.to.have.status(200);
      const d = pm.response.json();
      pm.expect(d.statusCode).to.equal(201);
      pm.expect(d.message).to.equal('Success');
      pm.expect(d.data).to.deep.equal({ fixture: 'accepted', title: 'TypeScript regression fixture' });
    });`,
  },
  ...[undefined, 'http://different.example.test'].map((origin, index) => ({
    name: `forbidden-${index}`, method: 'POST', path: '/api/submit-application-form',
    origin, body: {},
    check: `pm.test('Missing or mismatched origin is rejected safely', () => {
      pm.response.to.have.status(200);
      pm.expect(pm.response.json().statusCode).to.equal(403);
    });`,
  })),
  {
    name: 'invalid-json', method: 'POST', path: '/api/submit-application-form',
    origin: base.origin, body: { fixture: 'invalid-json' },
    check: `pm.test('Upstream parsing errors keep the error envelope', () => {
      pm.response.to.have.status(200);
      const d = pm.response.json();
      pm.expect(d.statusCode).to.equal(500);
      pm.expect(d.error).to.be.a('string').that.is.not.empty;
    });`,
  },
  ...['', '?page=2'].map((query, index) => ({
    name: `sitemap-${index}`, method: 'GET', path: `/sitemap.xml${query}`,
    check: `pm.test('Sitemap URLs and stylesheet survive XML cleanup', () => {
      pm.response.to.have.status(200);
      const xml = pm.response.text();
      pm.expect(xml).to.include('https://example.test/${query ? 'paged-course' : 'course'}-one');
      pm.expect(xml).to.include('href="/sitemap.xsl"');
      pm.expect(xml).not.to.include('<xhtml:link');
    });`,
  })),
];

for (const item of cases) {
  const report = join(reports, `${item.name}.json`);
  const args = ['request', item.method, new URL(item.path, base).href,
    '--output', report, '--report-events=false', '--script-post-request', item.check];
  if (item.body) args.push('--header', 'Content-Type:application/json', '--body', JSON.stringify(item.body));
  // CLI header arguments truncate values containing colons; request scripts keep URLs intact.
  if (item.origin) args.push('--script-pre-request', `pm.request.headers.upsert(${JSON.stringify({ key: 'Origin', value: item.origin })});`);
  execFileSync(process.env.POSTMAN_CLI || 'postman', args, { stdio: 'pipe' });
  const { tests } = JSON.parse(readFileSync(report, 'utf8'));
  console.log(`${item.name}: ${tests.passed}/${tests.total} assertions passed`);
}
console.log(`Reports: ${reports}`);
