import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export interface Category {
  name: string;
  slug: string;
}

export const POSTS_PATH = '/posts/';
/** Query parameter that preselects a category filter on the post list. */
export const CATEGORY_PARAM = 'kategoria';

export const postHref = (post: Post): string => `${POSTS_PATH}${post.id}/`;
export const categoryHref = (category: Category): string => `${POSTS_PATH}?${CATEGORY_PARAM}=${category.slug}`;
export const primaryCategory = (post: Post): Category | undefined => post.data.categories[0];

/** Short job titles shown next to the author name; the bio itself comes from WordPress. */
const authorRoles: Record<string, string> = {
  fanni: 'IT projektmenedzser',
  weart: 'WordPress fejlesztő',
};
export const authorRole = (slug: string): string | undefined => authorRoles[slug];

const TIME_ZONE = 'Europe/Budapest';
const labelFormat = new Intl.DateTimeFormat('hu-HU', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: TIME_ZONE,
});
// en-CA formats as YYYY-MM-DD
const isoFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });

/** `2025.08.01.` style date in Hungarian time, plus the ISO date for `<time datetime>`. */
export function formatDate(date: Date): { label: string; iso: string } {
  return { label: labelFormat.format(date).replace(/\s/g, ''), iso: isoFormat.format(date) };
}

export const byDateDesc = (a: Post, b: Post): number => b.data.date.valueOf() - a.data.date.valueOf();

/** Categories used by the posts, most used first, with the catch-all "Egyéb" last. */
export function collectCategories(posts: Post[]): Category[] {
  const counts = new Map<string, { category: Category; count: number }>();
  for (const category of posts.flatMap((post) => post.data.categories)) {
    const entry = counts.get(category.slug) ?? { category, count: 0 };
    entry.count++;
    counts.set(category.slug, entry);
  }
  const isCatchAll = (slug: string) => slug.startsWith('egyeb');
  return [...counts.values()]
    .sort((a, b) => Number(isCatchAll(a.category.slug)) - Number(isCatchAll(b.category.slug)) || b.count - a.count)
    .map(({ category }) => category);
}

/** Newest posts sharing the primary category, topped up with the newest others. */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const primary = primaryCategory(post)?.slug;
  const others = all.filter((candidate) => candidate.id !== post.id).sort(byDateDesc);
  const sameCategory = others.filter((candidate) => candidate.data.categories.some((c) => c.slug === primary));
  return [...new Set([...sameCategory, ...others])].slice(0, limit);
}
