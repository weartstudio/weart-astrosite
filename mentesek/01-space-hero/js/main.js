(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---------- header: scrolled state ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- glowing dot field (bioluminescence) ---------- */
  const glow = ['#00C2CB', '#AEDFDC', '#C0EBF1', '#6EC9C4', '#00A0AA'];
  $$('.dot-field').forEach((svg, idx) => {
    const w = 1200, h = 800;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const id = `blur-${idx}`;
    svg.innerHTML = `<defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('filter', `url(#${id})`);
    const count = window.innerWidth < 768 ? 26 : 48;
    for (let i = 0; i < count; i++) {
      const c = document.createElementNS(SVG_NS, 'circle');
      // bias the dots towards the right side, behind the visual
      const x = idx === 0 ? w * (0.35 + Math.random() * 0.65) : Math.random() * w;
      c.setAttribute('cx', x.toFixed(0));
      c.setAttribute('cy', (Math.random() * h).toFixed(0));
      c.setAttribute('r', (4 + Math.random() * 14).toFixed(1));
      c.setAttribute('fill', glow[i % glow.length]);
      c.setAttribute('opacity', (0.18 + Math.random() * 0.25).toFixed(2));
      c.style.setProperty('--d', `${18 + Math.random() * 26}s`);
      c.style.setProperty('--delay', `${-Math.random() * 30}s`);
      c.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`);
      c.style.setProperty('--dy', `${(Math.random() - 0.5) * 120}px`);
      g.appendChild(c);
    }
    svg.appendChild(g);
  });

  /* ---------- hero: starfield (dots + a few playful 4-point sparkles) ---------- */
  const space = $('.space');
  if (space) {
    const starsG = $('.stars', space);
    const n = window.innerWidth < 768 ? 70 : 150;
    let out = '';
    for (let i = 0; i < n; i++) {
      const x = (Math.random() * 1440).toFixed(0), y = (Math.random() * 900).toFixed(0);
      const tw = `--tw:${(2.5 + Math.random() * 5).toFixed(1)}s;--twd:${(-Math.random() * 6).toFixed(1)}s`;
      if (i % 18 === 0) {
        const r = 5 + Math.random() * 5;
        out += `<path class="sparkle" style="${tw}" transform="translate(${x} ${y})" d="M0 ${-r}Q1 -1 ${r} 0Q1 1 0 ${r}Q-1 1 ${-r} 0Q-1 -1 0 ${-r}Z"/>`;
      } else {
        out += `<circle style="${tw}" cx="${x}" cy="${y}" r="${(0.6 + Math.random() * 1.5).toFixed(1)}" opacity="${(0.35 + Math.random() * 0.6).toFixed(2)}"/>`;
      }
    }
    starsG.innerHTML = out;
    // reduced motion: freeze the rocket mid-route and the moon in place
    if (reduceMotion) {
      $$('animateMotion, animate', space).forEach((am) => am.remove());
      $('.rocket', space).setAttribute('transform', 'translate(700 520) rotate(-62)');
      $('.moon', space).setAttribute('transform', 'translate(940 960)');
    }
  }

  /* ---------- typed code in hero card ---------- */
  const codeEl = $('#typed-code');
  const codeLines = [
    ['c', '// Egyedi funkció, plugin helyett'],
    ['k', 'add_action'],
    ['', "( "],
    ['s', "'init'"],
    ['', ", "],
    ['k', 'function'],
    ['', '() {\n  '],
    ['k', 'register_post_type'],
    ['', '( '],
    ['s', "'referencia'"],
    ['', ' );\n} );\n'],
    ['c', '// Gyors, tiszta, karbantartható ✓'],
  ];
  // a newline after the first comment
  codeLines[0][1] += '\n';

  const renderStatic = () => {
    codeEl.innerHTML = codeLines.map(([cls, txt]) => cls ? `<span class="${cls}">${escapeHtml(txt)}</span>` : escapeHtml(txt)).join('');
  };
  function escapeHtml(s) { return s.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch])); }

  if (codeEl) {
    if (reduceMotion) {
      renderStatic();
    } else {
      const typeLoop = async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        while (true) {
          codeEl.innerHTML = '';
          for (const [cls, txt] of codeLines) {
            const node = cls ? document.createElement('span') : document.createTextNode('');
            if (cls) node.className = cls;
            codeEl.appendChild(node);
            for (const ch of txt) {
              node.textContent += ch;
              await sleep(ch === '\n' ? 180 : 28 + Math.random() * 40);
            }
          }
          await sleep(4200);
        }
      };
      setTimeout(typeLoop, 900);
    }
  }

  /* ---------- parallax on hero floating cards ---------- */
  const visual = $('.hero-visual');
  if (visual && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const cards = $$('[data-depth]', visual);
    const hero = $('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      cards.forEach((c) => {
        const d = Number(c.dataset.depth);
        c.style.transform = `translate(${(nx * d).toFixed(1)}px, ${(ny * d).toFixed(1)}px)`;
      });
    });
    hero.addEventListener('pointerleave', () => cards.forEach((c) => (c.style.transform = '')));
  }

  /* ---------- work card light follows cursor ---------- */
  // + the screenshot stack tilts slightly toward the pointer, as one unit
  $$('.work').forEach((card) => {
    const frame = $('.work-frame', card);
    const stack = $('.work-stack', card);
    card.addEventListener('pointermove', (e) => {
      const r = frame.getBoundingClientRect();
      frame.style.setProperty('--mx', `${e.clientX - r.left}px`);
      frame.style.setProperty('--my', `${e.clientY - r.top}px`);
      if (reduceMotion || e.pointerType !== 'mouse') return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      stack.style.setProperty('--ry', `${(px * 6).toFixed(2)}deg`);
      stack.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      stack.style.removeProperty('--rx');
      stack.style.removeProperty('--ry');
    });
  });

  /* ---------- marquee: duplicate items for a seamless loop ---------- */
  const track = $('.marquee-track');
  if (track && !reduceMotion) {
    $$('li', track).forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ---------- reveal on scroll + stagger ---------- */
  const revealEls = $$('.reveal');
  // stagger siblings inside the same grid
  $$('.benefit-grid, .service-grid, .work-grid').forEach((grid) => {
    $$(':scope > .reveal', grid).forEach((el, i) => el.style.setProperty('--rd', `${i * 110}ms`));
  });
  $$('.hero-copy .reveal').forEach((el, i) => el.style.setProperty('--rd', `${150 + i * 120}ms`));

  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || target < 3) { el.textContent = target + suffix; return; }
    const dur = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        $$('[data-count]', entry.target).forEach(runCounter);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    counters.forEach(runCounter);
  }

  /* ---------- about quote: words light up while scrolling ---------- */
  const quote = $('.quote-text');
  if (quote && !reduceMotion) {
    const wrapWords = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else {
          wrapWords(child);
        }
      });
    };
    wrapWords(quote);
    const words = $$('.w', quote);
    let ticking = false;
    const light = () => {
      ticking = false;
      const r = quote.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the quote's top reaches 85% of the viewport, 1 when its bottom reaches 45%
      const start = vh * 0.85, end = vh * 0.45;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const lit = Math.round(p * words.length * 1.15);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    };
    const onQuoteScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(light); } };
    window.addEventListener('scroll', onQuoteScroll, { passive: true });
    window.addEventListener('resize', onQuoteScroll);
    light();
  }

  /* ---------- manual sliders (testimonials, process steps): one slide at a time, no autoplay ---------- */
  const initSlider = (root, slideSel, dotSel) => {
    if (!root) return;
    const track = $('.slider-track', root);
    const slides = $$(slideSel, track);
    const dots = $$(dotSel, root);
    const prev = $('.qs-prev', root);
    const next = $('.qs-next', root);
    const current = () => Math.round(track.scrollLeft / track.clientWidth);
    const goTo = (i) => {
      const idx = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[idx].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    const sync = () => {
      const i = current();
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      slides.forEach((s, k) => s.setAttribute('aria-hidden', String(k !== i)));
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
      track.style.height = `${slides[i].offsetHeight}px`;
    };
    let queued = false;
    track.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; sync(); }); } }, { passive: true });
    prev.addEventListener('click', () => goTo(current() - 1));
    next.addEventListener('click', () => goTo(current() + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => goTo(k)));
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current() - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current() + 1); }
    });
    window.addEventListener('resize', () => { goTo(current()); sync(); });
    sync();
  };
  initSlider($('.quote-slider'), '.quote', '.qs-dot');
  initSlider($('.process-slider'), '.pslide', '.pdot');

  /* ---------- active nav link ---------- */
  const navLinks = $$('.main-nav a[href^="#"]:not(.btn)');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navIo.observe(s));
  }

  /* ---------- FAQ: one open at a time, animated height ---------- */
  const details = $$('.faq details');
  details.forEach((d) => {
    const summary = $('summary', d);
    const body = document.createElement('div');
    body.className = 'faq-body';
    while (summary.nextSibling) body.appendChild(summary.nextSibling);
    d.appendChild(body);

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const opening = !d.open;
      if (opening) details.filter((o) => o !== d && o.open).forEach(close);
      opening ? open(d) : close(d);
    });
  });
  function open(d) {
    const body = $('.faq-body', d);
    d.open = true;
    if (reduceMotion) return;
    const h = body.scrollHeight;
    body.style.height = '0px';
    requestAnimationFrame(() => { body.style.height = `${h}px`; });
    body.addEventListener('transitionend', () => { body.style.height = ''; }, { once: true });
  }
  function close(d) {
    const body = $('.faq-body', d);
    if (reduceMotion) { d.open = false; return; }
    body.style.height = `${body.scrollHeight}px`;
    requestAnimationFrame(() => { body.style.height = '0px'; });
    body.addEventListener('transitionend', () => { d.open = false; body.style.height = ''; }, { once: true });
  }

  /* ---------- contact form ---------- */
  // Nincs backend: érvényes kitöltés után a látogató levelezőjében nyit egy
  // előre kitöltött e-mailt az info@weart.hu címre. Éles oldalon cseréld
  // Gravity Forms-ra vagy saját végpontra.
  const form = $('#contact-form');
  const status = $('.form-status', form);
  const messages = {
    valueMissing: 'Ezt a mezőt kérlek, töltsd ki.',
    typeMismatch: 'Kérlek, valós e-mail címet adj meg.',
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;
    $$('input, textarea', form).forEach((input) => {
      const field = input.closest('.field');
      $('.error-msg', field)?.remove();
      field.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      if (!input.checkValidity()) {
        const msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.id = `${input.id}-err`;
        msg.textContent = input.validity.typeMismatch ? messages.typeMismatch : messages.valueMissing;
        field.appendChild(msg);
        field.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', msg.id);
        firstInvalid ??= input;
      }
    });
    if (firstInvalid) { firstInvalid.focus(); status.textContent = ''; return; }

    const data = new FormData(form);
    const subject = `Ajánlatkérés: ${data.get('type')} – ${data.get('name')}`;
    const body = [
      `Név: ${data.get('name')}`,
      `E-mail: ${data.get('email')}`,
      `Telefon: ${data.get('phone')}`,
      `Téma: ${data.get('type')}`,
      '',
      data.get('message'),
    ].join('\n');
    window.location.href = `mailto:info@weart.hu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Megnyitottuk a levelezőprogramodat az előre kitöltött üzenettel – csak küldd el!';
  });

  /* ---------- mobile sticky CTA ---------- */
  const mobileCta = $('.mobile-cta');
  const heroEl = $('.hero');
  const contactEl = $('#kapcsolat');
  if (mobileCta && 'IntersectionObserver' in window) {
    let heroVisible = true, contactVisible = false;
    const update = () => mobileCta.classList.toggle('is-shown', !heroVisible && !contactVisible);
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }, { threshold: 0.1 }).observe(heroEl);
    new IntersectionObserver(([e]) => { contactVisible = e.isIntersecting; update(); }, { threshold: 0.05 }).observe(contactEl);
  }

  /* ---------- about: dashed connectors lead from each name to its photo ---------- */
  const teamPanel = $('.team-panel');
  if (teamPanel) {
    const net = $('.team-net', teamPanel);
    const drawNet = () => {
      const P = teamPanel.getBoundingClientRect();
      if (!P.width) return;
      net.setAttribute('viewBox', `0 0 ${P.width} ${P.height}`);
      net.innerHTML = $$('.team-member').map((m) => {
        const n = $('.team-name', m).getBoundingClientRect();
        const f = $('.team-photo .placeholder', m).getBoundingClientRect();
        const f1 = (v) => v.toFixed(1);
        // start just under the role, wander across the panel (data-via, panel fractions), end on the photo's rim
        const t = $('.team-name strong', m).getBoundingClientRect();   // the text itself, not the padded box
        const sx = t.left - P.left + 6, sy = n.bottom - P.top + 12;
        const cx = f.left - P.left + f.width / 2, cy = f.top - P.top + f.height / 2;
        const r = f.width / 2 + 8;
        const th = (Number(m.dataset.angle) || 0) * Math.PI / 180;
        const ex = cx + Math.cos(th) * r, ey = cy + Math.sin(th) * r;
        const via = (m.dataset.via || '').trim().split(/\s+/).filter(Boolean)
          .map((xy) => { const [x, y] = xy.split(',').map(Number); return [x * P.width, y * P.height]; });
        const pts = [[sx, sy], ...via, [ex, ey]];
        // Catmull-Rom → cubic Bézier for one smooth, meandering stroke
        let d = `M${f1(sx)} ${f1(sy)}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
          d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
        }
        return `<path d="${d}"/><circle class="node-start" cx="${f1(sx)}" cy="${f1(sy)}" r="4"/><circle class="node-end" cx="${f1(ex)}" cy="${f1(ey)}" r="3"/>`;
      }).join('');
    };
    drawNet();
    window.addEventListener('resize', drawNet);
    window.addEventListener('load', drawNet);
    if (document.fonts) document.fonts.ready.then(drawNet);
  }

  /* ---------- year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
