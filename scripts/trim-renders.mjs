// Trim plain white borders off CAD renders and re-pad to a consistent margin.
//
//   node scripts/trim-renders.mjs [--margin 0.04] [--group] file1.png file2.png ...
//
// Overwrites each file in place (originals stay in git history / source folders).
// --group crops every file to the UNION of their content boxes, so a row of
// renders keeps one shared canvas size and the parts stay at the same scale.
import sharp from 'sharp';

const args = process.argv.slice(2);
let margin = 0.04;
let group = false;
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--margin') margin = Number(args[++i]);
  else if (args[i] === '--group') group = true;
  else files.push(args[i]);
}

async function box(f) {
  const meta = await sharp(f).metadata();
  const { info } = await sharp(f)
    .flatten({ background: '#ffffff' })
    .trim({ background: '#ffffff', threshold: 12 })
    .toBuffer({ resolveWithObject: true });
  const left = -info.trimOffsetLeft;
  const top = -info.trimOffsetTop;
  return { left, top, right: left + info.width, bottom: top + info.height, W: meta.width, H: meta.height };
}

const boxes = await Promise.all(files.map(box));
let shared;
if (group) {
  shared = boxes.reduce((a, b) => ({
    left: Math.min(a.left, b.left),
    top: Math.min(a.top, b.top),
    right: Math.max(a.right, b.right),
    bottom: Math.max(a.bottom, b.bottom),
  }));
}

for (let i = 0; i < files.length; i++) {
  const b = shared ?? boxes[i];
  const w = b.right - b.left;
  const h = b.bottom - b.top;
  const pad = Math.round(Math.max(w, h) * margin);
  const buf = await sharp(files[i])
    .flatten({ background: '#ffffff' })
    .extract({ left: b.left, top: b.top, width: w, height: h })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#ffffff' })
    .png()
    .toBuffer();
  await sharp(buf).toFile(files[i]);
  console.log(`${files[i]}: ${boxes[i].W}x${boxes[i].H} -> ${w + 2 * pad}x${h + 2 * pad}`);
}
