// Layout review harness.
//
//   npm run build
//   node scripts/review.mjs            (starts `astro preview` itself if nothing is on :4321)
//
// Writes full-page screenshots to review/<page>-<width>.png, a gap audit to
// review/report.md, and a cropped screenshot of every flagged element to
// review/issues/. review/ is gitignored.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const BASE = 'http://localhost:4321';
const OUT = 'review';
const ISSUES = join(OUT, 'issues');
const WIDTHS = [1440, 1024, 390];
const AUDIT_WIDTH = 1440;
const VIEWPORT_H = 900;

// thresholds (see CLAUDE.md "Layout rules")
const SPLIT_RATIO = 1.6;
const SPLIT_DIFF = 200;
const ROW_SPREAD = 0.15;
const BLOCK_GAP = 160;
const TALL_IMAGE = 0.8;
const BORDER_SHARE = 0.25;

// ---------- server ----------

async function up() {
  try {
    return (await fetch(BASE)).ok;
  } catch {
    return false;
  }
}

let server;
if (!(await up())) {
  server = spawn('npx', ['astro', 'preview', '--port', '4321'], { shell: true, stdio: 'ignore' });
  for (let i = 0; i < 60 && !(await up()); i++) await new Promise((r) => setTimeout(r, 500));
  if (!(await up())) throw new Error('astro preview did not start; run npm run build first');
}

// ---------- pages ----------

const projectSlugs = readdirSync('dist/work').filter(
  (d) => statSync(join('dist/work', d)).isDirectory(),
);
const pages = [
  { name: 'home', path: '/' },
  ...projectSlugs.map((s) => ({ name: s, path: `/work/${s}/` })),
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(ISSUES, { recursive: true });

const browser = await chromium.launch();

async function open(width, path) {
  const page = await browser.newPage({ viewport: { width, height: VIEWPORT_H } });
  // no animations, no reveal-on-scroll delays
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  // scroll through once so reveal-on-scroll observers fire, then force lazy images to load
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
    await Promise.all(
      [...document.images].map((i) =>
        i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r))),
      ),
    );
  });
  await page.waitForTimeout(400);
  return page;
}

// ---------- screenshots ----------

for (const p of pages) {
  for (const w of WIDTHS) {
    const page = await open(w, p.path);
    await page.screenshot({ path: join(OUT, `${p.name}-${w}.png`), fullPage: true });
    await page.close();
  }
}

// ---------- in-page audit ----------

const flags = []; // { page, kind, detail, rect }
const usedImages = new Set();

for (const p of pages) {
  const page = await open(AUDIT_WIDTH, p.path);
  const found = await page.evaluate(
    ({ SPLIT_RATIO, SPLIT_DIFF, ROW_SPREAD, BLOCK_GAP, TALL_IMAGE }) => {
      const out = [];
      const sy = window.scrollY;
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y + sy, width: r.width, height: r.height };
      };
      const label = (el) => {
        let h = el.previousElementSibling;
        while (h && !/^H[23]$/.test(h.tagName)) h = h.previousElementSibling;
        const inner = el.querySelector('h3');
        return (inner?.textContent || h?.textContent || '').trim().slice(0, 60);
      };
      const prose = document.querySelector('.prose');

      // splits: short text beside a tall image
      document.querySelectorAll('.prose .split').forEach((s) => {
        const kids = [...s.children];
        if (kids.length !== 2) return;
        const [a, b] = kids.map((k) => k.getBoundingClientRect().height);
        const hi = Math.max(a, b);
        const lo = Math.min(a, b);
        // centred / filled splits share the difference above and below, so only
        // flag them when each side would still be a big hole
        const centred = s.matches('.split--center, .split--fill');
        const bad = centred
          ? (hi - lo) / 2 > SPLIT_DIFF
          : hi / lo > SPLIT_RATIO || hi - lo > SPLIT_DIFF;
        if (lo > 0 && bad) {
          out.push({
            kind: 'split-imbalance',
            detail: `"${label(s)}": columns ${Math.round(a)} px vs ${Math.round(b)} px (${(hi / lo).toFixed(2)}x)`,
            rect: box(s),
          });
        }
      });

      // rows of images with different heights
      const rows = [
        ...[...document.querySelectorAll('.prose .grid3, .prose .cards')].map((r) => [r, [...r.querySelectorAll('img')]]),
      ];
      // compare: images in the same subgrid row = same position within each column
      document.querySelectorAll('.prose .compare').forEach((c) => {
        const cols = [...c.querySelectorAll('.compare__col')].map((col) => [...col.querySelectorAll('img')]);
        const n = Math.max(0, ...cols.map((x) => x.length));
        for (let i = 0; i < n; i++) rows.push([c, cols.map((x) => x[i]).filter(Boolean)]);
      });
      rows.forEach(([r, imgs]) => {
        if (imgs.length < 2) return;
        const hs = imgs.map((i) => i.getBoundingClientRect().height);
        const max = Math.max(...hs);
        const min = Math.min(...hs);
        if (min > 0 && (max - min) / max > ROW_SPREAD) {
          out.push({
            kind: 'row-heights',
            detail: `"${label(r)}": image heights ${hs.map(Math.round).join(' / ')} px`,
            rect: box(r),
          });
        }
      });

      // big vertical gaps between consecutive blocks
      if (prose) {
        const blocks = [...prose.children].filter((e) => e.getBoundingClientRect().height > 0);
        for (let i = 1; i < blocks.length; i++) {
          const prev = blocks[i - 1].getBoundingClientRect();
          const cur = blocks[i].getBoundingClientRect();
          const gap = cur.top - prev.bottom;
          if (gap > BLOCK_GAP) {
            out.push({
              kind: 'block-gap',
              detail: `${Math.round(gap)} px gap before <${blocks[i].tagName.toLowerCase()} class="${blocks[i].className}"> "${(blocks[i].textContent || '').trim().slice(0, 40)}"`,
              rect: { x: prev.x, y: prev.bottom - 40 + sy, width: prev.width, height: gap + 80 },
            });
          }
        }
        // empty space inside a block: the tallest child that is mostly blank below its content
      }

      // gap between the end of .prose and whatever comes next
      const actions = document.querySelector('.case-actions');
      if (prose && actions) {
        const gap = actions.getBoundingClientRect().top - prose.getBoundingClientRect().bottom;
        if (gap > BLOCK_GAP) {
          out.push({
            kind: 'block-gap',
            detail: `${Math.round(gap)} px gap before the project links`,
            rect: { x: 0, y: prose.getBoundingClientRect().bottom - 40 + sy, width: window.innerWidth, height: gap + 120 },
          });
        }
      }

      // images and other checks
      const seen = new Map();
      const imgs = [...document.querySelectorAll('main img')];
      imgs.forEach((i) => {
        const r = i.getBoundingClientRect();
        if (r.height > window.innerHeight * TALL_IMAGE) {
          out.push({
            kind: 'tall-image',
            detail: `${i.getAttribute('src')} renders ${Math.round(r.height)} px tall (${Math.round((r.height / window.innerHeight) * 100)}% of viewport)`,
            rect: box(i),
          });
        }
        if (!i.hasAttribute('alt') || (i.getAttribute('alt') || '').trim() === '') {
          out.push({ kind: 'missing-alt', detail: i.getAttribute('src'), rect: box(i) });
        }
        const src = i.getAttribute('src');
        if (src && src.startsWith('/images/')) {
          if (seen.has(src)) {
            out.push({ kind: 'duplicate-image', detail: `${src} appears more than once`, rect: box(i) });
          }
          seen.set(src, true);
        }
      });

      const text = document.querySelector('main')?.innerText || '';
      for (const word of ['TODO', 'placeholder', 'Placeholder', 'lorem']) {
        if (text.includes(word)) out.push({ kind: 'leftover-text', detail: `"${word}" in page text`, rect: null });
      }
      document.querySelectorAll('main img').forEach((i) => {
        if (/placeholder/i.test(i.alt)) out.push({ kind: 'leftover-text', detail: `placeholder alt: ${i.alt}`, rect: box(i) });
      });

      const used = imgs.map((i) => i.getAttribute('src')).filter(Boolean);
      document.querySelectorAll('main a[href^="/images/"]').forEach((a) => used.push(a.getAttribute('href')));
      document.querySelectorAll('main video[poster]').forEach((v) => used.push(v.getAttribute('poster')));
      return { flags: out, used };
    },
    { SPLIT_RATIO, SPLIT_DIFF, ROW_SPREAD, BLOCK_GAP, TALL_IMAGE },
  );

  found.used.forEach((u) => usedImages.add(decodeURIComponent(u.split('?')[0])));

  for (const f of found.flags) {
    const n = flags.length + 1;
    let crop = null;
    if (f.rect && f.rect.width > 0 && f.rect.height > 0) {
      crop = join(ISSUES, `${String(n).padStart(2, '0')}-${p.name}-${f.kind}.png`);
      const pad = 24;
      await page.screenshot({
        path: crop,
        fullPage: true,
        clip: {
          x: Math.max(0, f.rect.x - pad),
          y: Math.max(0, f.rect.y - pad),
          width: Math.min(AUDIT_WIDTH, f.rect.width + pad * 2),
          height: Math.min(4000, f.rect.height + pad * 2),
        },
      });
    }
    flags.push({ page: p.name, ...f, crop });
  }
  await page.close();
}

await browser.close();
if (server) server.kill();

// ---------- image files ----------

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const fileFlags = [];
// unused/ folders hold kept source images that aren't on any page
const imageFiles = walk('public/images/projects').filter(
  (f) => /\.(png|jpe?g|webp)$/i.test(f) && !/[\\/]unused[\\/]/.test(f),
);
for (const f of imageFiles) {
  const url = '/' + relative('public', f).split('\\').join('/');
  if (!usedImages.has(url)) fileFlags.push({ kind: 'unused-file', detail: url });
  try {
    const meta = await sharp(f).metadata();
    const { info } = await sharp(f)
      .flatten({ background: '#ffffff' })
      .trim({ background: '#ffffff', threshold: 12 })
      .toBuffer({ resolveWithObject: true });
    const share = 1 - (info.width * info.height) / (meta.width * meta.height);
    if (share > BORDER_SHARE) {
      fileFlags.push({
        kind: 'border',
        detail: `${url}: ${Math.round(share * 100)}% plain border (${meta.width}x${meta.height}, content ${info.width}x${info.height})`,
      });
    }
  } catch {
    // trim throws on a fully uniform image; ignore
  }
}

// ---------- report ----------

let md = `# Layout review\n\nAudit at ${AUDIT_WIDTH} px. Screenshots at ${WIDTHS.join(', ')} px in \`review/\`.\n\n`;
let i = 0;
for (const p of pages) {
  const mine = flags.filter((f) => f.page === p.name);
  if (!mine.length) continue;
  md += `## ${p.name} (${p.path})\n\n`;
  for (const f of mine) {
    i++;
    md += `${i}. **${f.kind}**: ${f.detail}${f.crop ? ` ([crop](${relative(OUT, f.crop).split('\\').join('/')}))` : ''}\n`;
  }
  md += '\n';
}
if (fileFlags.length) {
  md += `## Image files\n\n`;
  for (const f of fileFlags) md += `${++i}. **${f.kind}**: ${f.detail}\n`;
}
if (!i) md += 'No issues flagged.\n';
writeFileSync(join(OUT, 'report.md'), md);
console.log(`${i} flags, report at review/report.md`);
