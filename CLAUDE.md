# Portfolio site: context for Claude

Raphael Larroquette's engineering portfolio, live at https://raphael-larroquette.github.io.
This file is the handoff from earlier sessions. Read it before changing anything.
Where it disagrees with `SITE-GUIDE.md`, this file wins.

## Stack and deploy

- Astro 7, static output, built on the **Astro Haze** theme (`kpab/astro-haze`, MIT), heavily customised
- Every push to `main` runs `.github/workflows/deploy.yml` and publishes to GitHub Pages (Pages source: GitHub Actions)
- Static on purpose, so the site can move to self-hosting later without rework
- This is a **user site** at the domain root, so `astro.config.mjs` has `BASE = '/'`. The theme shipped `/astro-haze`; don't put it back

```sh
npm run dev       # http://localhost:3000 (theme sets port 3000, not 4321)
npm run build     # run before every push; catches schema errors dev lets through
npm run preview   # serves the real build output
```

### Working version vs live version (option A: local + branch)

- Work on the `dev` branch. `npm run dev` is the working version: it shows drafts and reloads on save
- `main` is the live site. Merge `dev` into `main` only to publish, since every push to `main` deploys
- Live projects: `suspension-optimizer`, `aurora-suspension`, `3dx-plm`, `utat-pintle`. `window-fairing`, `pcb-design`, `buzzer-system` are `draft: true`
- `PUBLIC_SHOW_DRAFTS=true` at build time also shows drafts (`SHOW_DRAFTS` in `src/lib/projects.ts`), ready if a hosted preview (option B, Cloudflare Pages on the `dev` branch) is ever wanted

## How Raphael wants to work

- He is a Mechanical Engineering student at U of T on Blue Sky Solar Racing (solar car) and the UofT Aerospace Team
- He gives raw material (voice notes, documents, screenshots); you turn it into page content and code
- **Never invent** accomplishments, numbers, scope or roles. Ask. A blank you can't fill is a question, not a gap to paper over
- **Never use em dashes or en dashes**, anywhere: page content, captions, commit messages, chat replies
- Keep his wording; fix typos and grammar only
- For big text rewrites, propose changes paragraph by paragraph, numbered, so he can reply "1 keep, 2 change X"
- Explain the why behind code changes; this is partly a learning exercise for him
- Look at the rendered page yourself before calling layout work done

### Writing project pages

- A project page is an **extended resume that walks through the project**: what he did and why, the decisions and trade-offs. Not a report
- Mostly **bullet points**, short. A sentence only where it reads better (one-line intros)
- Don't restate what an image already shows (no "min SF 3.84" under a sim plot). Text under a figure is his interpretation, not a caption
- Use the horizontal space: images beside text, comparisons side by side. Avoid big empty gaps

## Where things live

| To change | File |
| --- | --- |
| Name, nav, social links, footer links, feature toggles, accent colour | `src/site.config.ts` |
| Colours, fonts, spacing, container width | `src/styles/tokens.css` |
| Project write-ups (one file each) | `src/content/projects/*.md` |
| Project frontmatter schema | `src/content.config.ts` |
| Project page template | `src/pages/work/[...slug].astro` |
| Project list (`/work/`) | `src/pages/work/index.astro`, `src/components/portfolio/WorkArchive.astro` |
| Home | `src/pages/index.astro` (still theme demo copy) |
| About | `src/pages/about.astro` (still theme demo copy) |
| Header / footer | `src/components/common/Header.astro`, `Footer.astro` |

Routing is file based: `src/content/projects/aurora-suspension.md` becomes `/work/aurora-suspension/`.

## Project page conventions

### Frontmatter

- Required: `title`, `summary`, `cover`, `tech`, `role`, `year`
- Optional: `description`, `coverAlt`, `featured`, `draft`, `client`, `duration`, `links`
- `draft: true` hides a project from production builds (homepage, /work/, its page, its social card) but not from `npm run dev`. Always read projects through `getProjects()` in `src/lib/projects.ts`, never `getCollection('projects')`
- `summary` is the card text and hero subtitle. `description` is the lead line with the accent bar
- `client` renders as **Team**, `tech` renders as **Tools**
- `featured: true` puts a project on the home page. `/work/` lists everything, including smaller second-tier projects
- Any value containing an apostrophe needs **double quotes**. An apostrophe inside single quotes breaks the YAML, and the dev server silently keeps serving the old page
- Don't use the `images:` field. The theme's gallery ("Inside the work") was removed on purpose

### Layout blocks

Markdown can't do side-by-side layouts, so pages use raw HTML blocks with classes defined in `[...slug].astro`. See `src/content/projects/aurora-suspension.md` for working examples of all of them.

| Class | Use |
| --- | --- |
| `.split` | Two columns, text beside an image. Variants: `--text` (wider text), `--media` (wider image), `--top`, `--center` (text centred against a taller image), `--fill` (with `.fig--fill` on the image: the image column takes the text column's height, image contained in a white frame) |
| `.compare` > `.compare__col` | Three columns that line up row by row via subgrid: render / description / sim / sim notes |
| `.compare__name[data-badge="..."]` | Badge next to a variant name (e.g. "Chosen") |
| `.compare__col--chosen` | Accent border on the chosen variant's images |
| `.grid3` | Three equal figure tiles |
| `.grid3.grid3--frames` | Same three tiles, but each image sits in an identical 4:3 white frame (`object-fit: contain`), for images with different aspect ratios |
| `.cards` | Bordered text cards, two across |
| `.decision` | Highlighted decision box |
| `.stats`, `.stats--row` | Big-number stats, stacked or three across |
| `.fig` | Figure wrapper; wrap the `img` in an `a` to its full-size file |
| `.eyebrow` | Small accent label above a list |

**No blank lines inside an HTML block.** A blank line ends the block, and anything indented after it is parsed as a code block.

### Layout rules

- **Trim CAD renders** before using them: `node scripts/trim-renders.mjs file.png` (4% margin). For a row that must share one canvas, `--group` crops all files to the union box. It overwrites in place; originals stay in git history
- **One aspect ratio per row.** Images side by side share a canvas size, or go in `.grid3--frames`
- **Split vs full width.** If the text column is under ~60% of the image height: combine sections into one text column, use `--center`, narrow the image (`--text`), or crop the image (link the full one) and keep it beside the text. Wide tables and spreadsheets read better full width, or beside text if they are illustration rather than something to read
- **Height cap.** Full-width figures are capped at 75vh (`object-fit: contain`); the link still opens the full file
- **Drop what doesn't earn its space.** An image that repeats another, or a screenshot too small to read beside text, goes
- **Run the audit before calling a page done:** `npm run build && node scripts/review.mjs`. It writes screenshots at 1440 / 1024 / 390 px, `review/report.md` and crops of every flag to `review/issues/`. Known accepted flags: the `aurora/lca-sq.png` border (shares a square canvas with its row) and the unused files kept as sources

### Images and video

- Page images: `public/images/projects/<project>/`, referenced absolutely (`/images/projects/aurora/x.png`)
- Cover image only: `src/assets/images/projects/`, referenced relatively from the Markdown (`../../assets/images/projects/x.jpg`), because the schema runs it through `image()`
- Images in a comparison row should share one canvas size so the row lines up (white canvas for renders, same crop for sims)
- Raw source material lives beside the repo, e.g. `../Aurora_Sus_Redesign/`. Word docs often contain higher-res figures than screenshots; extract from `word/media/` inside the `.docx`. Render drawings from the PDF rather than screenshotting
- Videos: `public/video/`, H.264 720p, under ~15 MB, with a poster frame. AV1 or raw `.MOV` won't play everywhere:

```sh
ffmpeg -i in.mov -vf scale=1280:-2 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k out.mp4
ffmpeg -ss 15 -i in.mov -frames:v 1 -vf scale=1280:-2 -q:v 4 out-poster.jpg
```

## Customisations already made (don't undo)

- `--container-max` widened from 80rem to 96rem (`tokens.css`)
- Project template: sticky sidebar replaced by a horizontal facts strip; theme gallery removed; theme's global `.prose` 65ch cap lifted on project pages; one-line title; body text white and larger; layout blocks added
- `site.config.ts`: blog, landing, RSS and search off; nav is About / Projects / Contact (anchors on the single-scroll homepage); dark mode by default
- Colours: viridian accent (`hsl(165, 62%, 55%)` dark, `hsl(165, 65%, 34%)` light) and a blue/green aurora background

- Theme leftovers are hidden, not deleted: `src/pages/_about.astro`, `_blog/`, `_tags/` and `_rss.xml.ts`. The leading underscore stops Astro routing them. Rename to bring one back
- Open Graph card for the homepage (`/og-image.png`) is still the theme art. Needs a real one

## Gotchas

- **Dev server serves stale styles** after files are replaced from outside the editor (new markup, old CSS). Restart `npm run dev`
- **Don't delete `src/content/blog/`**, even though it's empty. `astro.config.mjs` reads that folder at startup and the build crashes without it
- Expected warnings on startup: the `landing` collection folder is missing, and the blog is empty. Both harmless
- `npm audit` shows vulnerabilities in build tooling. Don't run `npm audit fix --force`; it bumps majors and breaks the build
- On Windows, extract zips with `tar -xf`. PowerShell's `Expand-Archive` chokes on the brackets in `[...slug].astro`

## Status

**Done**

- Aurora Suspension & Steering Redesign (`aurora-suspension.md`). Use it as the reference for every other project page
- Suspension optimizer, 3DEXPERIENCE PLM and pintle pages built from specs, with some images and TODOs still open. Homepage is a single scroll (hero, who am I with slideshow, projects grid, resume + contact)

**Next**

- The five other projects are placeholders full of `TODO`s, with placeholder `year` and `role` values: `suspension-kinematics-app`, `utat-pintle`, `window-fairing`, `pcb-design`, `buzzer-system`. Get the raw material from Raphael first, then build each page the same way as Aurora
- Possible second-tier projects for `/work/` (ask before adding): BSSR Slack sign-up bot, shop PC fleet deployment, MIE243 drivetrain project
- Rebuild Home (hero, 3 or 4 featured projects, tools/skills, a few photos of him, the team and hobbies) and About, using the same layout blocks
- Font: undecided. Options shown: Inter (current), Space Grotesk headings, Instrument Serif headings, IBM Plex Sans + Mono
- Unused leftovers to clean up (check with grep before deleting): old `aurora-*` images and placeholder covers in `src/assets/images/projects/`, and the loose files at the top of `public/images/projects/` that were replaced by the `aurora/` subfolder

**Open questions on the Aurora page**

- The LCA sim shown is the (2, 0, 1) load case, while the UCA sims are (2, 1, -1)
- Confirm the `role` field wording
- Confirm `bearing-bore.png` is the right LCA bore detail

**Later**

- Turn the blog back on as a notebook: Raphael sends notes for a day, Claude writes the post and publishes
- Automated per-page PDF export
- Embed the live suspension kinematics app once the site is self-hosted
