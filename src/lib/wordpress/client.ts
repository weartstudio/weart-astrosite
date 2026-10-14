import { WP_APP_PASSWORD, WP_GRAPHQL_URL, WP_USER } from 'astro:env/server';

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

function authHeader(): Record<string, string> {
  if (!WP_USER || !WP_APP_PASSWORD) return {};
  const token = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD.replace(/\s+/g, '')}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

/** Runs a query against the WordPress GraphQL endpoint and throws on transport or GraphQL errors. */
export async function wpQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeader() },
    body: JSON.stringify({ query, variables }),
  });

  let body: GraphQLResponse<T>;
  try {
    body = (await response.json()) as GraphQLResponse<T>;
  } catch {
    throw new Error(`WordPress GraphQL: ${response.status} ${response.statusText}, the response is not JSON.`);
  }

  if (body.errors?.length) {
    const messages = body.errors.map((error) => error.message).join('\n  ');
    const hint = /authentication/i.test(messages)
      ? '\nSet WP_USER and WP_APP_PASSWORD in .env, or allow public access in WPGraphQL > Settings.'
      : '';
    throw new Error(`WordPress GraphQL error:\n  ${messages}${hint}`);
  }
  if (!response.ok || !body.data) {
    throw new Error(`WordPress GraphQL: ${response.status} ${response.statusText}`);
  }
  return body.data;
}
