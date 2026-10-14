import { $, $$, prefersReducedMotion } from './dom';

/** Fills every `.space` scene with random stars and a few 4-point sparkles. */
function fillStarfields(): void {
  const reduceMotion = prefersReducedMotion();
  for (const space of $$<SVGSVGElement>('.space')) {
    const starsGroup = $<SVGGElement>('.stars', space);
    if (!starsGroup || starsGroup.childElementCount) continue;

    const density = space.classList.contains('space--contact') ? 0.7 : 1;
    const count = Math.round((window.innerWidth < 768 ? 70 : 150) * density);
    let markup = '';
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 1440).toFixed(0);
      const y = (Math.random() * 900).toFixed(0);
      const twinkle = `--tw:${(2.5 + Math.random() * 5).toFixed(1)}s;--twd:${(-Math.random() * 6).toFixed(1)}s`;
      if (i % 18 === 0) {
        const r = 5 + Math.random() * 5;
        markup += `<path class="sparkle" style="${twinkle}" transform="translate(${x} ${y})" d="M0 ${-r}Q1 -1 ${r} 0Q1 1 0 ${r}Q-1 1 ${-r} 0Q-1 -1 0 ${-r}Z"/>`;
      } else {
        const radius = (0.6 + Math.random() * 1.5).toFixed(1);
        const opacity = (0.35 + Math.random() * 0.6).toFixed(2);
        markup += `<circle style="${twinkle}" cx="${x}" cy="${y}" r="${radius}" opacity="${opacity}"/>`;
      }
    }
    starsGroup.innerHTML = markup;

    // reduced motion: freeze the rocket mid-route and the moon in place
    if (reduceMotion) {
      $$('animateMotion, animate', space).forEach((el) => el.remove());
      $('.rocket', space)?.setAttribute('transform', 'translate(700 520) rotate(-62)');
      $('.moon', space)?.setAttribute('transform', 'translate(940 960)');
    }
  }
}

fillStarfields();
