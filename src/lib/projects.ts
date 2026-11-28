import { getCollection } from 'astro:content';

/**
 * Every project that should be visible in the current build.
 *
 * A project with `draft: true` in its frontmatter is hidden from production
 * builds (homepage grid, /work/, its own page, its social card) but still
 * shows up in `npm run dev`, so it can be worked on before it goes live.
 *
 * A build with PUBLIC_SHOW_DRAFTS=true (a hosted preview) shows drafts too.
 */
export const SHOW_DRAFTS =
  import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

export async function getProjects() {
  return getCollection('projects', ({ data }) => SHOW_DRAFTS || !data.draft);
}

// Display order on the home page and in the portfolio PDF. The suspension
// tool first, then Aurora, then the rest; anything unlisted goes last.
const ORDER = [
  'suspension-optimizer',
  'aurora-suspension',
  '3dx-plm',
  'utat-pintle',
  'window-fairing',
  'pcb-design',
  'buzzer-system',
];

const rank = (id: string) => {
  const i = ORDER.indexOf(id);
  return i === -1 ? ORDER.length : i;
};

export async function getOrderedProjects() {
  return (await getProjects()).sort((a, b) => rank(a.id) - rank(b.id));
}
