# Site guide

Astro renders everything to static HTML at build time. No server, no runtime.
`npm run build` produces `dist/`, and that is what GitHub Pages serves.

## Daily loop

```sh
npm run dev      # http://localhost:3000 - save a file, browser reloads
npm run build    # catches schema errors dev is lenient about - run before pushing
```

Ship it:

```sh
git add -A
git commit -m "what changed"
git push
```

Push to `main` triggers `.github/workflows/deploy.yml`. Live in ~1-2 min.

## Where things live

| To change | Edit |
| --- | --- |
| Name, nav, social links, footer, feature toggles | `src/site.config.ts` |
| Site URL, integrations | `astro.config.mjs` |
| A project's text | `src/content/projects/<name>.md` |
| What fields a project requires | `src/content.config.ts` |
| Home page | `src/pages/index.astro` |
| About page | `src/pages/about.astro` |
| Colors, fonts, spacing | `src/styles/tokens.css` |
| Glass effects | `src/styles/glass.css` |
| Project card / archive markup | `src/components/portfolio/` |
| Header, footer, theme toggle | `src/components/common/` |

Routing is file-based: `src/pages/about.astro` -> `/about/`.
Projects are generated from Markdown by `src/pages/work/[...slug].astro`,
so `aurora-suspension.md` -> `/work/aurora-suspension/`.

## Adding a project

New `.md` file in `src/content/projects/`. Filename becomes the URL.
Required frontmatter: `title`, `summary`, `cover`, `tech`, `role`, `year`.
Miss one and the build fails naming the file. Copy an existing file's block.

Optional: `description`, `coverAlt`, `images` (gallery), `featured`,
`client`, `duration`, `links.live`, `links.github`.

## Images - the one gotcha

Two separate systems:

- **`src/assets/`** - processed by Astro. Auto WebP/AVIF + responsive srcset.
  Referenced **relatively from the Markdown file**:
  `'../../assets/images/projects/foo.jpg'`
  Use for photos, renders, screenshots.
- **`public/`** - copied verbatim, untouched. Referenced **absolutely**:
  `/resume.pdf`
  Use for PDFs, favicons, anything that must keep its exact filename.

Gallery on a project page:

```yaml
images:
  - '../../assets/images/projects/aurora-upright.jpg'
  - '../../assets/images/projects/aurora-test-chassis.jpg'
```

## Colors and fonts

Everything is a CSS custom property in `src/styles/tokens.css`.
Change the token, not individual rules.

- `--color-accent` - re-tints the whole site
- `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`
- `--aurora-1` .. `--aurora-4` - background gradient blobs
- `--glass-bg`, `--glass-blur`, `--glass-border` - the glass effect
- `--font-sans`, `--font-mono`
- `--text-xs` .. `--text-5xl` - type scale
- `--space-xs` .. - spacing scale

Light and dark values are defined separately in that file.

## Expected warnings

- `landing` base directory does not exist - that collection is declared but
  unused. Harmless.
- No files found in `src/content/blog` - blog is off by design. Harmless.

Do not delete `src/content/blog/` itself. `astro.config.mjs` reads that
directory at config load; if it is missing the build crashes before it starts.

## npm audit

16 vulnerabilities is expected and nearly all in build tooling. A static site
has no server, no user input, no database. Do not run `npm audit fix --force`
- it bumps majors and is a likely way to break the build for no benefit.
