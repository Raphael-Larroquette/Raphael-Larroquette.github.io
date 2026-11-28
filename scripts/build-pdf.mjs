// Turn the built /print/ page into dist/Raphael_Larroquette_Portfolio.pdf.
//
//   npm run build && npm run pdf      (or: npm run build:full)
//
// Serves dist/ on a throwaway local port, opens /print/ in headless Chromium,
// waits for every image, then prints A4 with a page footer. The PDF is a build
// output: never committed, regenerated on every deploy.

import { createServer } from 'node:http';
import { copyFileSync, createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const DIST = 'dist';
const OUT = join(DIST, 'Raphael_Larroquette_Portfolio.pdf');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
};

if (!existsSync(join(DIST, 'print', 'index.html'))) {
  throw new Error('dist/print/index.html missing: run `npm run build` first');
}

const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let file = join(DIST, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(normalize(DIST)) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/print/`, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((i) =>
      i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r))),
    ),
  );
});

const footer = `
  <div style="width:100%; padding:0 15mm; font:8px system-ui, sans-serif; color:#55606a; display:flex; justify-content:space-between;">
    <span>Raphael Larroquette, Engineering Portfolio</span>
    <span>page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  </div>`;

await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: footer,
});

await browser.close();
server.close();

// Also drop a copy in public/ (gitignored) so the download buttons work under
// `npm run dev` too, which serves public/ but never sees dist/.
copyFileSync(OUT, join('public', 'Raphael_Larroquette_Portfolio.pdf'));
const mb = statSync(OUT).size / 1024 / 1024;
console.log(`${OUT}: ${mb.toFixed(1)} MB`);
if (mb > 10) console.warn('Over the 10 MB target: downscale page images');
