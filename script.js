// ===== JS flag =====
// Styles that only make sense with scripting (video toggles) key off this class.
document.documentElement.classList.add('js');

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Smooth anchor scroll =====
// Done here instead of `html { scroll-behavior: smooth }` so that only real
// link clicks animate; programmatic scrolling stays instant.
(function initAnchorScroll() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
      try { history.pushState(null, '', '#' + id); } catch (_) { /* file:// can refuse */ }

      // keep keyboard and screen reader position in step with the scroll
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
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
  const isOpen = () => overlay.classList.contains('is-open');

  const open = () => {
    overlay.classList.add('is-open');
    backdrop?.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
    close?.focus();
  };

  const closeMenu = ({ returnFocus = true } = {}) => {
    if (!isOpen()) return;
    overlay.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => (isOpen() ? closeMenu() : open()));
  close?.addEventListener('click', () => closeMenu());
  backdrop?.addEventListener('click', () => closeMenu());

  // a section link closes the drawer and hands focus to the section it opens
  overlay.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => closeMenu({ returnFocus: false }));
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    if (e.key !== 'Tab') return;

    // keep Tab inside the open dialog
    const focusable = overlay.querySelectorAll('a[href], button:not([disabled])');
    if (!focusable.length) return;
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
  desktop.addEventListener('change', (e) => {
    if (e.matches) closeMenu({ returnFocus: false });
  });
})();

// ===== Current section highlight =====
(function initSectionSpy() {
  const links = document.querySelectorAll('[data-spy]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const sections = ['top', 'about', 'expertise', 'websites', 'work', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.dataset.spy === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  // a thin band just above the middle of the viewport decides the section
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => io.observe(section));
})();

// ===== Experience filter =====
(function initLedgerFilter() {
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
      if (show) shown += 1;
      if (show && row.hidden) {
        // a returning row animates in on its own, so drop any pending scroll reveal
        row.classList.remove('reveal', 'is-visible');
        row.classList.add('is-entering');
      }
      row.hidden = !show;
    });

    if (status) status.textContent = `Showing ${shown} of ${rows.length} roles`;
  };

  rows.forEach((row) => {
    row.addEventListener('animationend', () => row.classList.remove('is-entering'));
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => apply(chip.dataset.filter));
  });
})();

// ===== Expertise module → filter Experience =====
// The link itself scrolls to #work (see Smooth anchor scroll); this sets the filter.
(function initModuleToLedgerLink() {
  document.querySelectorAll('[data-role]').forEach((module) => {
    const link = module.querySelector('.module__link');
    const chip = document.querySelector(`[data-filter="${module.dataset.role}"]`);
    if (!link || !chip) return;
    link.addEventListener('click', () => chip.click());
  });
})();

// ===== Website videos =====
// Each clip plays only while it is on screen. A user pause wins over that and
// survives scrolling away and back. Reduced motion starts every clip paused.
(function initSiteVideos() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.site').forEach((figure) => {
    const video = figure.querySelector('video');
    const toggle = figure.querySelector('[data-video-toggle]');
    if (!video) return;

    const name = figure.querySelector('.site__name')?.textContent.trim() || 'website';
    const text = toggle?.querySelector('[data-video-toggle-text]');
    const state = { inView: false, userPaused: reduced };

    video.muted = true;

    const sync = () => {
      if (state.inView && !state.userPaused) {
        const attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(() => {});
      } else {
        video.pause();
      }
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', String(state.userPaused));
      toggle.setAttribute('aria-label', `${state.userPaused ? 'Play' : 'Pause'} the ${name} screen capture`);
      if (text) text.textContent = state.userPaused ? 'PLAY' : 'PAUSE';
    };

    toggle?.addEventListener('click', () => {
      state.userPaused = !state.userPaused;
      sync();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            state.inView = entry.isIntersecting;
            sync();
          });
        },
        { threshold: 0.25 }
      ).observe(video);
    } else {
      state.inView = true;
    }

    sync();
  });
})();

// ===== Scroll reveal =====
// The hiding class is added here, never in the markup, so no-JS shows everything.
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll(
    '.section__head, .about__photo, .about__lede, .about__para, .about__badges, .module, .site, ' +
    '.ledger__filter, .ledger__row, .contact__lead, .contact__side'
  );

  const reveal = (el) => {
    el.classList.add('is-visible');
    // hand the element back to its own transitions once the reveal has played
    setTimeout(() => el.classList.remove('reveal', 'is-visible'), 700);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // also catch anything that was jumped past without ever intersecting
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
        io.unobserve(entry.target);
        reveal(entry.target);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
})();
