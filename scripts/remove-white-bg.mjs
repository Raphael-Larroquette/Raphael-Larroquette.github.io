// Make the plain white background of a CAD render transparent, then trim and
// re-pad it (4% transparent margin).
//
//   node scripts/remove-white-bg.mjs in.png [out.png]
//
// Only white connected to the image border is removed (flood fill), so white
// highlights and faces inside the part stay opaque. Edge pixels that are
// nearly white fade out instead of leaving a white halo on the dark theme.
import sharp from 'sharp';

const [input, output = input] = process.argv.slice(2);
const MARGIN = 0.04;
const BG_MIN = 236; // a pixel is background if every channel is at least this
const FEATHER_FROM = 200; // edge pixels brighter than this fade out

const { data, info } = await sharp(input)
  .flatten({ background: '#ffffff' })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 4;
const isBg = (i) => data[i] >= BG_MIN && data[i + 1] >= BG_MIN && data[i + 2] >= BG_MIN;

// flood fill from every border pixel
const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push([x, 0], [x, H - 1]);
for (let y = 0; y < H; y++) stack.push([0, y], [W - 1, y]);
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const k = y * W + x;
  if (bg[k] || !isBg(k * 4)) continue;
  bg[k] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const k = y * W + x;
    const i = k * 4;
    if (bg[k]) {
      data[i + 3] = 0;
      continue;
    }
    // anti-aliased edge: next to background and still light
    const touches =
      (x > 0 && bg[k - 1]) || (x < W - 1 && bg[k + 1]) || (y > 0 && bg[k - W]) || (y < H - 1 && bg[k + W]);
    if (touches) {
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum > FEATHER_FROM) {
        data[i + 3] = Math.round(255 * Math.min(1, (255 - lum) / (255 - FEATHER_FROM)));
      }
    }
  }
}

const trimmed = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
  .png()
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
  .toBuffer({ resolveWithObject: true });
const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * MARGIN);
await sharp(trimmed.data)
  .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(output);
console.log(`${output}: ${W}x${H} -> ${trimmed.info.width + 2 * pad}x${trimmed.info.height + 2 * pad}, transparent background`);
