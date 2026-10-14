import { WP_APP_PASSWORD, WP_URL, WP_USER } from 'astro:env/server';

function authHeader(): Record<string, string> {
  if (!WP_USER || !WP_APP_PASSWORD) return {};
  const token = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD.replace(/\s+/g, '')}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

/** Root URL of the WordPress site, without a trailing slash. */
export const wpSiteUrl = WP_URL.replace(/\/+$/, '');

/** Absolute URL of a WordPress REST route, e.g. `wpRestUrl('gf/v2/forms/2')`. */
export const wpRestUrl = (route: string): string => `${wpSiteUrl}/wp-json/${route.replace(/^\//, '')}`;

async function wpRestRequest<T>(route: string): Promise<{ data: T; headers: Headers }> {
  const url = wpRestUrl(route);
  const response = await fetch(url, { headers: { Accept: 'application/json', ...authHeader() } });
  const text = await response.text();
  // short excerpt of the raw response, so a WAF/CDN block (e.g. Cloudflare) is identifiable from the build log
  const excerpt = `\n  Response: ${text.slice(0, 500)}\n  Server: ${response.headers.get('server') ?? '?'}, cf-ray: ${response.headers.get('cf-ray') ?? '-'}`;
  if (!response.ok) {
    throw new Error(`WordPress REST ${url}: ${response.status} ${response.statusText}${excerpt}`);
  }
  try {
    return { data: JSON.parse(text) as T, headers: response.headers };
  } catch {
    throw new Error(
      `WordPress REST ${url}: ${response.status} ${response.statusText}, the response is not JSON.${excerpt}`,
    );
  }
}

/** GET request to the WordPress REST API (with the application password, if set); throws on non-2xx or non-JSON responses. */
export async function wpRest<T>(route: string): Promise<T> {
  return (await wpRestRequest<T>(route)).data;
}

/** Fetches every page of a REST collection (e.g. `wp/v2/posts`), following the `X-WP-TotalPages` header. */
export async function wpRestAll<T>(route: string, params: Record<string, string> = {}): Promise<T[]> {
  const items: T[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page++) {
    const query = new URLSearchParams({ ...params, per_page: '100', page: String(page) });
    const { data, headers } = await wpRestRequest<T[]>(`${route}?${query}`);
    items.push(...data);
    totalPages = Number(headers.get('x-wp-totalpages')) || 1;
  }
  return items;
}
