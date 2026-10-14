import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectFilters } from './data/projects';
import { wordpressPostsLoader } from './lib/wordpress/posts-loader';

const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: z.object({
    /** Client name, shown as the card eyebrow. */
    name: z.string(),
    /** Shorter name for the home page cards; falls back to `name`. */
    shortName: z.string().optional(),
    title: z.string(),
    lead: z.string().optional(),
    /** Case study link. Missing while the project is still a draft. */
    url: z.url().optional(),
    filters: z.array(z.enum(projectFilters)).min(1),
    labels: z.array(z.string()),
    /** Label inside the screenshot placeholders. */
    shotLabel: z.string().optional(),
    phoneLabel: z.string().optional(),
    featured: z.boolean().default(false),
    showOnHome: z.boolean().default(false),
    order: z.number().int(),
  }),
});

const posts = defineCollection({
  loader: wordpressPostsLoader(),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    modified: z.coerce.date(),
    readingMinutes: z.number().int().positive(),
    /** The first category is the primary one (card eyebrow, breadcrumb). */
    categories: z.array(z.object({ name: z.string(), slug: z.string() })),
    author: z.object({ name: z.string(), slug: z.string(), description: z.string() }).optional(),
    featuredImage: z
      .object({ src: z.url(), alt: z.string(), width: z.number().int(), height: z.number().int() })
      .optional(),
  }),
});

export const collections = { projects, posts };
