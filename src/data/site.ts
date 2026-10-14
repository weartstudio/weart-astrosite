export const site = {
  name: 'Weart',
  url: 'https://weart.hu',
  themeColor: '#051A2D',
  email: 'info@weart.hu',
  phone: { href: 'tel:+36301958114', label: '+36 30 / 195 8114', schema: '+36301958114' },
  foundedYear: 2019,
  socials: {
    facebook: 'https://facebook.com/weartweb',
    github: 'https://github.com/weartstudio',
  },
  legalUrl: 'https://new.weart.hu/legal/',
  aboutUrl: 'https://new.weart.hu/about/',
} as const;

export type NavKey = 'home' | 'work' | 'blog';

/** Main navigation, the same on every page: section links always point to the matching part of the home page. */
export const navLinks = [
  { label: 'Munkáink', href: '/#munkaink', key: 'work' },
  { label: 'Szolgáltatások', href: '/#szolgaltatasok', key: null },
  { label: 'Rólunk', href: '/#rolunk', key: null },
  { label: 'Blog', href: '/posts/', key: 'blog' },
] as const satisfies readonly { label: string; href: string; key: NavKey | null }[];

export const navCta = { label: 'Kapcsolat', href: '/#kapcsolat' } as const;
