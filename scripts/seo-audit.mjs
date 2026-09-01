const baseUrl = (process.env.SEO_AUDIT_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const publicRoutes = ['/', '/gold', '/currencies', '/crypto', '/gold/calculator', '/karat/k24'];
const expectedNotFound = ['/pricing', '/karat/k99', '/news/not-a-real-item'];

let failed = false;

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  return { response, body: await response.text() };
}

for (const path of publicRoutes) {
  const { response, body } = await request(path);
  const canonical = body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  const h1Count = (body.match(/<h1[\s>]/gi) || []).length;
  const hasLegacyBrand = /nezzel/i.test(body);
  const passed = response.status === 200 && canonical?.startsWith('https://mersadna.com') && h1Count === 1 && !hasLegacyBrand;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${path} status=${response.status} h1=${h1Count} canonical=${canonical || 'missing'}`);
  failed ||= !passed;
}

for (const path of expectedNotFound) {
  const { response } = await request(path);
  const passed = response.status === 404;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${path} status=${response.status}`);
  failed ||= !passed;
}

const [{ response: robotsResponse, body: robots }, { response: sitemapResponse, body: sitemap }] = await Promise.all([
  request('/robots.txt'),
  request('/sitemap.xml'),
]);
const crawlFilesPassed = robotsResponse.status === 200 && sitemapResponse.status === 200 &&
  /https:\/\/mersadna\.com\/sitemap\.xml/.test(robots) &&
  !/nezzel|\/pricing/i.test(sitemap);
console.log(`${crawlFilesPassed ? 'PASS' : 'FAIL'} crawl files`);
failed ||= !crawlFilesPassed;

if (failed) process.exitCode = 1;
