import GithubSlugger from 'github-slugger';

/** Helpers that turn WordPress-rendered HTML into what the Astro pages need. */

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
};

export function decodeEntities(input: string): string {
  return input.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const point = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(point) ? match : String.fromCodePoint(point);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

export const stripTags = (html: string): string => html.replace(/<[^>]*>/g, ' ');

/** Plain text from an HTML fragment: tags removed, entities decoded, whitespace collapsed. */
export const toPlainText = (html: string): string => decodeEntities(stripTags(html)).replace(/\s+/g, ' ').trim();

/** WordPress excerpt without the trailing "[…]" / "Read more" decoration. */
export const cleanExcerpt = (html: string): string =>
  toPlainText(html)
    .replace(/\s*\[(…|&hellip;|\.\.\.)\]\s*$/, '…')
    .trim();

/** Reading time in whole minutes at ~200 words per minute (minimum 1). */
export function readingMinutes(html: string): number {
  const words = toPlainText(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Gives every h2/h3 an id (keeps the one WordPress already set) and collects them for the table of contents.
 */
export function addHeadingIds(html: string): { html: string; headings: Heading[] } {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, attrs: string, inner: string) => {
      const text = toPlainText(inner).replace(/:$/, '');
      const existing = /\sid="([^"]+)"/.exec(attrs)?.[1];
      const slug = existing ?? slugger.slug(text);
      headings.push({ depth: Number(level), slug, text });
      const withId = existing ? attrs : `${attrs} id="${slug}"`;
      return `<h${level}${withId}>${inner}</h${level}>`;
    },
  );
  return { html: out, headings };
}

const CONTACT_PATHS = new Set(['/kapcsolat', '/contact']);

/**
 * Points links on the CMS domain at this site: posts (any old permalink format: `/posts/x/`, `/blog/x/`, `/x/`),
 * the contact page and the home page. Uploads and unknown pages keep pointing at the CMS.
 */
export function rewriteInternalLinks(html: string, cmsOrigin: string, postSlugs: ReadonlySet<string>): string {
  const escaped = cmsOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`href="${escaped}(/[^"]*)?"`, 'g'), (match, rawPath: string | undefined) => {
    const [path = '/', hash = ''] = (rawPath ?? '/').split('#');
    const trimmed = path.replace(/\/+$/, '') || '/';
    if (trimmed === '/') return 'href="/"';
    if (CONTACT_PATHS.has(trimmed)) return 'href="/#kapcsolat"';
    const slug = slugToId(trimmed.split('/').pop() ?? '');
    if (postSlugs.has(slug) && /^\/((posts|blog)\/)?[^/]+$/.test(trimmed)) {
      return `href="/posts/${slug}/${hash ? `#${hash}` : ''}"`;
    }
    return match;
  });
}

/** Lazy-loads inline images and iframes that WordPress did not already mark. */
export const lazyLoadMedia = (html: string): string =>
  html.replace(/<(img|iframe)\b(?![^>]*\sloading=)/g, '<$1 loading="lazy"');

export function safeDecodeUri(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Entry id / URL segment for a WordPress slug: percent-decoded and NFC-normalized, so it is stable across file systems. */
export const slugToId = (slug: string): string => safeDecodeUri(slug).normalize('NFC');
