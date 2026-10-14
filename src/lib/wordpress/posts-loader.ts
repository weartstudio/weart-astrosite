import type { Loader } from 'astro/loaders';
import { WP_GRAPHQL_URL } from 'astro:env/server';
import { wpQuery } from './client';
import {
  addHeadingIds,
  cleanExcerpt,
  decodeEntities,
  lazyLoadMedia,
  readingMinutes,
  rewriteInternalLinks,
  slugToId,
} from './html';

const POSTS_QUERY = /* GraphQL */ `
  query Posts($after: String) {
    posts(first: 100, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        title
        dateGmt
        modifiedGmt
        excerpt
        content
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            slug
            description
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  }
`;

interface WpPost {
  slug: string;
  title: string | null;
  dateGmt: string;
  modifiedGmt: string | null;
  excerpt: string | null;
  content: string | null;
  categories: { nodes: { name: string; slug: string }[] } | null;
  author: { node: { name: string; slug: string; description: string | null } | null } | null;
  featuredImage: {
    node: {
      sourceUrl: string | null;
      altText: string | null;
      mediaDetails: { width: number | null; height: number | null } | null;
    } | null;
  } | null;
}

interface PostsResponse {
  posts: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: WpPost[];
  };
}

async function fetchAllPosts(): Promise<WpPost[]> {
  const posts: WpPost[] = [];
  let after: string | null = null;
  do {
    const { posts: page }: PostsResponse = await wpQuery<PostsResponse>(POSTS_QUERY, { after });
    posts.push(...page.nodes);
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  return posts;
}

/** WPGraphQL returns GMT dates without a zone designator. */
const asUtc = (gmt: string): string => (/(Z|[+-]\d\d:?\d\d)$/i.test(gmt) ? gmt : `${gmt}Z`);

function toEntryData(post: WpPost, cmsOrigin: string, postSlugs: ReadonlySet<string>) {
  const content = lazyLoadMedia(rewriteInternalLinks(post.content ?? '', cmsOrigin, postSlugs));
  const image = post.featuredImage?.node;
  const author = post.author?.node;

  return {
    content,
    data: {
      title: decodeEntities(post.title ?? ''),
      excerpt: cleanExcerpt(post.excerpt ?? ''),
      date: asUtc(post.dateGmt),
      modified: asUtc(post.modifiedGmt ?? post.dateGmt),
      readingMinutes: readingMinutes(content),
      categories: (post.categories?.nodes ?? []).map(({ name, slug }) => ({ name: decodeEntities(name), slug })),
      author: author
        ? { name: author.name, slug: author.slug, description: decodeEntities(author.description ?? '') }
        : undefined,
      featuredImage:
        image?.sourceUrl && image.mediaDetails?.width && image.mediaDetails.height
          ? {
              src: image.sourceUrl,
              alt: decodeEntities(image.altText ?? ''),
              width: image.mediaDetails.width,
              height: image.mediaDetails.height,
            }
          : undefined,
    },
  };
}

/** Loads the published blog posts from the headless WordPress through WPGraphQL at build time. */
export function wordpressPostsLoader(): Loader {
  return {
    name: 'wordpress-posts',
    load: async ({ store, logger, parseData, generateDigest }) => {
      const cmsOrigin = new URL(WP_GRAPHQL_URL).origin;
      logger.info(`Fetching posts from ${WP_GRAPHQL_URL}`);
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
