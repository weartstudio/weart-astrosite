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
      // root URL of the headless WordPress; posts come from its REST API (/wp-json/wp/v2/posts)
      WP_URL: envField.string({
        context: 'server',
        access: 'public',
        url: true,
        default: 'https://content.weart.hu',
      }),
      // WordPress username + application password, needed to read the Gravity Forms form definition
      WP_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      WP_APP_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
