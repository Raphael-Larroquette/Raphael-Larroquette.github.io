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
