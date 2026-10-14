import { $$, prefersReducedMotion } from './dom';

/** Fades `.reveal` elements in on scroll, staggers grid siblings and runs `[data-count]` counters. */

function runCounter(el: HTMLElement): void {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? '';
  if (prefersReducedMotion() || target < 3) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const duration = 1600;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(target * eased)}${p === 1 ? suffix : ''}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initReveal(): void {
  const revealEls = $$('.reveal');

  for (const grid of $$('.benefit-grid, .service-grid, .work-grid')) {
    $$(':scope > .reveal', grid).forEach((el, i) => el.style.setProperty('--rd', `${i * 110}ms`));
  }
  $$('.hero-copy .reveal').forEach((el, i) => el.style.setProperty('--rd', `${150 + i * 120}ms`));

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    $$('[data-count]').forEach(runCounter);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        $$('[data-count]', entry.target).forEach(runCounter);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -40px 0px' },
  );
  revealEls.forEach((el) => io.observe(el));
}

initReveal();
