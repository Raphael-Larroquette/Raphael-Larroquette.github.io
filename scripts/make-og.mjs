// Build the social preview card (public/og-image.png, 1200x630): the image
// Slack, LinkedIn, iMessage etc. show when the site link is shared.
//
//   node scripts/make-og.mjs ../Headshot/headshot.jpg
//
// Text on the left in the site's colours, headshot on the right fading into
// the background. Re-run when the photo or wording changes, then commit.
import sharp from 'sharp';

const photo = process.argv[2] ?? '../Headshot/headshot.jpg';
const W = 1200;
const H = 630;
const PHOTO_W = 500;
const ACCENT = '#45d9b4'; // hsl(165, 62%, 55%), the site accent on dark

const bg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="30%" cy="35%" r="75%">
      <stop offset="0" stop-color="#11505a"/>
      <stop offset="0.55" stop-color="#0c2a31"/>
      <stop offset="1" stop-color="#0a1418"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
</svg>`);

const head = await sharp(photo)
  .resize(PHOTO_W, H, { fit: 'cover', position: 'top' })
  .toBuffer();

// fade the photo's left edge into the background
const fade = Buffer.from(`
<svg width="${PHOTO_W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="f" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.28" stop-color="#fff" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="${PHOTO_W}" height="${H}" fill="url(#f)"/>
</svg>`);
const headFaded = await sharp(head)
  .ensureAlpha()
  .composite([{ input: fade, blend: 'dest-in' }])
  .png()
  .toBuffer();

const font = `'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;
const text = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="72" y="150" width="8" height="250" rx="4" fill="${ACCENT}"/>
  <text x="108" y="182" font-family="${font}" font-size="24" font-weight="700"
        letter-spacing="5" fill="${ACCENT}">ENGINEERING PORTFOLIO</text>
  <text x="104" y="268" font-family="${font}" font-size="80" font-weight="700"
        letter-spacing="-2" fill="#ffffff">Raphael</text>
  <text x="104" y="352" font-family="${font}" font-size="80" font-weight="700"
        letter-spacing="-2" fill="#ffffff">Larroquette</text>
  <text x="108" y="400" font-family="${font}" font-size="28" fill="#b9c9cc">Mechanical Engineering, University of Toronto</text>
  <text x="76" y="560" font-family="${font}" font-size="24" fill="#7f9599">raphael-larroquette.github.io</text>
</svg>`);

await sharp(bg)
  .composite([
    { input: headFaded, left: W - PHOTO_W, top: 0 },
    { input: text, left: 0, top: 0 },
  ])
  .png()
  .toFile('public/og-image.png');
console.log('public/og-image.png written');
