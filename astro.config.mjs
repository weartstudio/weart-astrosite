// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://weart.hu',
  trailingSlash: 'always',
  integrations: [sitemap()],
  image: {
    // featured images and inline post images come from the headless WordPress
    domains: ['content.weart.hu'],
  },
  env: {
    schema: {
      WP_GRAPHQL_URL: envField.string({
        context: 'server',
        access: 'public',
        url: true,
        default: 'https://content.weart.hu/graphql',
      }),
      // WordPress username + application password, needed while the GraphQL endpoint is restricted to logged-in users
      WP_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      WP_APP_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
