import type { CollectionEntry } from 'astro:content';

export const projectFilters = ['weboldal', 'webshop', 'ujratervezes'] as const;
export type ProjectFilter = (typeof projectFilters)[number];

export const filterLabels: Record<ProjectFilter, string> = {
  weboldal: 'Weboldal',
  webshop: 'Webshop',
  ujratervezes: 'Újratervezés',
};

export const byOrder = (a: CollectionEntry<'projects'>, b: CollectionEntry<'projects'>): number =>
  a.data.order - b.data.order;
