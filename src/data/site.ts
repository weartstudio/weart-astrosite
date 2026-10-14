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

/** Main navigation. On the home page the in-page links stay as plain hashes so the active-section highlight works. */
export function getNavLinks(current: NavKey) {
  const home = current === 'home';
  return [
    { label: 'Munkáink', href: home ? '#munkaink' : '/munkaink/', key: 'work' },
    { label: 'Szolgáltatások', href: home ? '#szolgaltatasok' : '/#szolgaltatasok', key: null },
    { label: 'Rólunk', href: home ? '#rolunk' : '/#rolunk', key: null },
    { label: 'Blog', href: '/posts/', key: 'blog' },
  ] as const;
}
