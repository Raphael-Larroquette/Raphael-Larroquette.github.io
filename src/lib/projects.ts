import { getCollection } from 'astro:content';

/**
 * Every project that should be visible in the current build.
 *
 * A project with `draft: true` in its frontmatter is hidden from production
 * builds (homepage grid, /work/, its own page, its social card) but still
 * shows up in `npm run dev`, so it can be worked on before it goes live.
 */
export async function getProjects() {
  return getCollection(
    'projects',
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
}
