/** Headline numbers. `count` animates on scroll; entries without it stay static. */
export interface Stat {
  label: string;
  value: string;
  count?: number;
  suffix?: string;
}

export const stats = {
  delivered: { label: 'átadott weboldal', value: '150+', count: 150, suffix: '+' },
  clients: { label: 'elégedett ügyfél', value: '90+', count: 90, suffix: '+' },
  years: { label: 'év tapasztalat', value: '10+', count: 10, suffix: '+' },
  team: { label: 'fős csapat', value: '2' },
  failed: { label: 'sikertelen projekt', value: '1', count: 1 },
} satisfies Record<string, Stat>;
