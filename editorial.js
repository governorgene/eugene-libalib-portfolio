// Option B "Editorial": behaviour for editorial.html

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ===== Footer year =====
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ===== Hero role rotator =====
// All five roles stay on the page; the cyan highlight walks down the list.
(function initRoleRotator() {
  const list = document.querySelector('[data-rotator]');
  if (!list) return;
  const items = Array.from(list.children);
  if (items.length < 2 || prefersReducedMotion.matches) return;

  let i = Math.max(0, items.findIndex((el) => el.classList.contains('is-current')));

  setInterval(() => {
    items[i].classList.remove('is-current');
    i = (i + 1) % items.length;
    items[i].classList.add('is-current');
  }, 2200);
})();

// ===== Experience filter =====
(function initExperienceFilter() {
  const chips = Array.from(document.querySelectorAll('[data-filter]'));
  const rows = Array.from(document.querySelectorAll('[data-roles]'));
  const status = document.getElementById('filter-status');
  if (!chips.length || !rows.length) return;

  const apply = (filter) => {
    let shown = 0;

    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter));
    });

    rows.forEach((row) => {
      const roles = (row.dataset.roles || '').split(/\s+/);
      const show = filter === 'all' || roles.includes(filter);
      row.hidden = !show;
      if (show) shown += 1;
    });

    if (status) status.textContent = `Showing ${shown} of ${rows.length} entries`;
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => apply(chip.dataset.filter));
  });
})();

// ===== Expertise row → filter Experience =====
// The row's title is a real link to #work; clicking it also sets the matching filter.
(function initExpertiseToWorkLink() {
  document.querySelectorAll('[data-role]').forEach((row) => {
    const link = row.querySelector('a[href="#work"]');
    const chip = document.querySelector(`[data-filter="${row.dataset.role}"]`);
    if (!link || !chip) return;
    link.addEventListener('click', () => chip.click());
  });
})();

// ===== Smooth in-page anchors =====
// Done here rather than with CSS scroll-behavior so only real link clicks glide.
(function initSmoothAnchors() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest?.('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    try { history.pushState(null, '', `#${id}`); } catch (_) { /* file:// or sandboxed */ }
  });
})();

// ===== Website videos =====
// Each clip plays only while it is in view. The toggle records what the visitor
// wants, so a pause survives scrolling away and back.
(function initVideos() {
  const figures = Array.from(document.querySelectorAll('figure')).filter(
    (figure) => figure.querySelector('video') && figure.querySelector('[data-video-toggle]')
  );
  if (!figures.length) return;

  const states = figures.map((figure) => ({
    video: figure.querySelector('video'),
    toggle: figure.querySelector('[data-video-toggle]'),
    text: figure.querySelector('[data-video-toggle-text]'),
    name: figure.dataset.site || 'website',
    inView: !('IntersectionObserver' in window),
    userPaused: prefersReducedMotion.matches,
  }));

  const render = (state) => {
    const verb = state.userPaused ? 'Play' : 'Pause';
    state.toggle.setAttribute('aria-pressed', String(state.userPaused));
    state.toggle.setAttribute('aria-label', `${verb} the ${state.name} screen capture`);
    if (state.text) state.text.textContent = verb;
  };

  const update = (state) => {
    if (state.inView && !state.userPaused) {
      const attempt = state.video.play();
      if (attempt && attempt.catch) attempt.catch(() => {});
    } else {
      state.video.pause();
    }
  };

  states.forEach((state) => {
    state.video.muted = true;
    state.toggle.hidden = false;
    state.toggle.addEventListener('click', () => {
      state.userPaused = !state.userPaused;
      render(state);
      update(state);
    });
    render(state);
    update(state);
  });

  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = states.find((s) => s.video === entry.target);
        if (!state) return;
        state.inView = entry.isIntersecting;
        update(state);
      });
    },
    { threshold: 0.25 }
  );

  states.forEach((state) => io.observe(state.video));
})();

// ===== Scroll reveal =====
// The hiding class is added here, so without JS (or with reduced motion) everything just shows.
(function initScrollReveal() {
  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.section-head, .about__lede, .about__figure, .about__body, .discipline, .site, .filters, .entry, .contact__head, .contact__lede, .contact__mail-wrap, .contact__cv'
  );
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -48px 0px' }
  );

  targets.forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
})();

// ===== Menu drawer =====
(function initMenu() {
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const overlay = document.getElementById('menu-overlay');
  const backdrop = document.getElementById('menu-backdrop');
  if (!toggle || !overlay) return;

  const desktop = window.matchMedia('(min-width: 900px)');
  let lastFocused = null;

  const isOpen = () => overlay.classList.contains('is-open');

  const open = () => {
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    backdrop?.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
    close?.focus();
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!isOpen()) return;
    overlay.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (restoreFocus) lastFocused?.focus?.();
  };

  toggle.addEventListener('click', () => {
    if (isOpen()) closeMenu();
    else open();
  });

  close?.addEventListener('click', () => closeMenu());
  backdrop?.addEventListener('click', () => closeMenu());

  overlay.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    if (e.key !== 'Tab') return;

    // keep Tab inside the open drawer
    const focusable = Array.from(overlay.querySelectorAll('a[href], button'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // the drawer does not exist at desktop widths
  desktop.addEventListener?.('change', (e) => {
    if (e.matches) closeMenu({ restoreFocus: false });
  });
})();

// ===== Current section in the nav and the drawer =====
(function initCurrentSection() {
  const links = document.querySelectorAll('[data-nav]');
  const sections = ['top', 'about', 'expertise', 'websites', 'work', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const setCurrent = (id) => {
    links.forEach((link) => {
      const current = link.dataset.nav === id;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => io.observe(section));
})();
