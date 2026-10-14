import type { Loader } from 'astro/loaders';
import { wpRestAll, wpSiteUrl } from './client';
import {
  addHeadingIds,
  cleanExcerpt,
  decodeEntities,
  lazyLoadMedia,
  readingMinutes,
  rewriteInternalLinks,
  slugToId,
} from './html';

interface WpTerm {
  taxonomy: string;
  name: string;
  slug: string;
}

interface WpPost {
  slug: string;
  title: { rendered: string };
  date_gmt: string;
  modified_gmt: string | null;
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    author?: { name: string; slug: string; description?: string }[];
    /** One array per taxonomy (categories, tags). */
    'wp:term'?: WpTerm[][];
    'wp:featuredmedia'?: {
      source_url?: string;
      alt_text?: string;
      media_details?: { width?: number; height?: number };
    }[];
  };
}

/** Newest first; the embedded author, terms and featured image save a request per post. */
const fetchAllPosts = (): Promise<WpPost[]> =>
  wpRestAll<WpPost>('wp/v2/posts', {
    status: 'publish',
    orderby: 'date',
    order: 'desc',
    _embed: 'author,wp:term,wp:featuredmedia',
    _fields: 'slug,title,date_gmt,modified_gmt,excerpt,content,_links,_embedded',
  });

/** WordPress returns GMT dates without a zone designator. */
const asUtc = (gmt: string): string => (/(Z|[+-]\d\d:?\d\d)$/i.test(gmt) ? gmt : `${gmt}Z`);

function toEntryData(post: WpPost, cmsOrigin: string, postSlugs: ReadonlySet<string>) {
  const content = lazyLoadMedia(rewriteInternalLinks(post.content.rendered, cmsOrigin, postSlugs));
  const image = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const categories = (post._embedded?.['wp:term'] ?? []).flat().filter((term) => term.taxonomy === 'category');

  return {
    content,
    data: {
      title: decodeEntities(post.title.rendered),
      excerpt: cleanExcerpt(post.excerpt.rendered),
      date: asUtc(post.date_gmt),
      modified: asUtc(post.modified_gmt ?? post.date_gmt),
      readingMinutes: readingMinutes(content),
      categories: categories.map(({ name, slug }) => ({ name: decodeEntities(name), slug })),
      author: author
        ? {
            name: decodeEntities(author.name),
            slug: author.slug,
            description: decodeEntities(author.description ?? ''),
          }
        : undefined,
      featuredImage:
        image?.source_url && image.media_details?.width && image.media_details.height
          ? {
              src: image.source_url,
              alt: decodeEntities(image.alt_text ?? ''),
              width: image.media_details.width,
              height: image.media_details.height,
            }
          : undefined,
    },
  };
}

/** Loads the published blog posts from the headless WordPress through the REST API at build time. */
export function wordpressPostsLoader(): Loader {
  return {
    name: 'wordpress-posts',
    load: async ({ store, logger, parseData, generateDigest }) => {
      const cmsOrigin = new URL(wpSiteUrl).origin;
      logger.info(`Fetching posts from ${wpSiteUrl}`);
      const posts = await fetchAllPosts();

      const postSlugs = new Set(posts.map((post) => slugToId(post.slug)));

      store.clear();
      for (const post of posts) {
        const id = slugToId(post.slug);
        const { content, data: raw } = toEntryData(post, cmsOrigin, postSlugs);
        const data = await parseData({ id, data: raw });
        const { html, headings } = addHeadingIds(content);
        store.set({
          id,
          data,
          digest: generateDigest({ modified: raw.modified, html }),
          rendered: { html, metadata: { headings } },
        });
      }
      logger.info(`Loaded ${posts.length} posts`);
    },
  };
}
