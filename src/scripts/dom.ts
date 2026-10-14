/** Small DOM helpers shared by the client scripts. */

export const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(selector);

export const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] => [
  ...root.querySelectorAll<T>(selector),
];

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Runs `fn` at most once per animation frame. */
export function rafThrottle(fn: () => void): () => void {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
}
