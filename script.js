// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Touch press states =====
// iOS Safari has long applied :active on touch only when a touchstart listener exists.
// An empty passive listener is enough, and a passive one never holds up scrolling.
document.addEventListener('touchstart', () => {}, { passive: true });

// ===== Hero role rotator =====
// Each role carries its own article ("an AI Integrator"), swapped while the word is hidden.
// It runs through the roles once and stops back on the first, so a screen reader hears each
// role once instead of a new one every 2.2 s for as long as the page is open.
(function initRoleRotator() {
  const roles = [
    ['a', 'GoHighLevel Specialist'],
    ['a', 'Marketing Automation Architect'],
    ['a', 'Web Developer'],
    ['an', 'AI Integrator'],
    ['a', 'Network Operations Engineer'],
  ];
  const el = document.querySelector('.role-rotator__word');
  const article = document.querySelector('.role-rotator__article');
  if (!el) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;
  const show = () => {
    const [a, role] = roles[i];
    el.textContent = role;
    if (article) article.textContent = a;
  };

  const timer = setInterval(() => {
    i = (i + 1) % roles.length;
    if (i === 0) clearInterval(timer);
    if (reduced) {
      show();
      return;
    }
    el.classList.add('is-leaving');
    setTimeout(() => {
      show();
      el.classList.remove('is-leaving');
      el.classList.add('is-entering');
      requestAnimationFrame(() => el.classList.remove('is-entering'));
    }, 250);
  }, 2200);
})();

// ===== Project filter =====
(function initProjectFilter() {
  const chips = document.querySelectorAll('.chip');
  const projects = document.querySelectorAll('.project');
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;

      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', String(active));
      });

      projects.forEach((p) => {
        const roles = (p.dataset.roles || '').split(/\s+/);
        const show = filter === 'all' || roles.includes(filter);
        p.classList.toggle('is-hidden', !show);
      });
    });
  });
})();

// ===== Scroll reveal =====
(function initScrollReveal() {
  const targets = document.querySelectorAll('.card, .project, .case, .section__title, .about p, .badge');
  targets.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
  );

  targets.forEach((el) => io.observe(el));
})();

// ===== Expertise card → filter Work =====
// Each card's title is a real link to #work, which handles the scroll and the keyboard.
// This only applies the matching filter on the way there.
(function initExpertiseToWorkLink() {
  document.querySelectorAll('.card[data-role] .card__link').forEach((link) => {
    link.addEventListener('click', () => {
      const role = link.closest('.card').dataset.role;
      document.querySelector(`.chip[data-filter="${role}"]`)?.click();
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

  let lastFocused = null;

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

  const closeMenu = () => {
    overlay.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    lastFocused?.focus?.();
  };

  toggle.addEventListener('click', () => {
    if (overlay.classList.contains('is-open')) closeMenu();
    else open();
  });

  close?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);

  overlay.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeMenu();
  });
})();

// ===== Menu active link tracker =====
(function initMenuActiveSection() {
  const links = document.querySelectorAll('.menu__link[data-section]');
  const counter = document.getElementById('menu-counter');
  if (!links.length) return;

  const sectionMap = {
    home: document.getElementById('top'),
    about: document.getElementById('about'),
    expertise: document.getElementById('expertise'),
    cases: document.getElementById('case-studies'),
    work: document.getElementById('work'),
    contact: document.getElementById('contact'),
  };

  const setActive = (key) => {
    let activeNum = '00';
    links.forEach((link) => {
      const isActive = link.dataset.section === key;
      link.classList.toggle('is-active', isActive);
      if (isActive) activeNum = link.querySelector('.menu__num')?.textContent || '00';
    });
    if (counter) counter.textContent = activeNum;
  };

  if (!('IntersectionObserver' in window)) {
    setActive('home');
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const key = Object.keys(sectionMap).find((k) => sectionMap[k] === target);
        if (key) setActive(key);
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  Object.values(sectionMap).forEach((el) => el && io.observe(el));

  // Default state before first intersect
  setActive('home');
})();

// ===== Nav section counter =====
(function initNavCounter() {
  const counter = document.getElementById('nav-counter');
  if (!counter) return;
  const sections = document.querySelectorAll('.section[data-counter]');
  if (!sections.length) return;

  if (!('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counter.textContent = entry.target.dataset.counter;
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  );

  sections.forEach((s) => io.observe(s));
})();

// ===== Background ripple =====
// A faint dot grid sits on a fixed canvas behind the whole page. A click or tap on the
// background sends a ring out through it: dots are pushed outward and light up in the accent colour as
// the front passes, then settle back. The grid only redraws while a ripple is alive.
// Reduced motion keeps the static grid and never ripples.
(function initBackgroundRipple() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.className = 'ripple-field';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);

  const SPACING = 22;      // grid pitch, CSS px
  const DOT = 1;           // dot radius at rest
  const REST_ALPHA = 0.05; // above ~0.05 a dot pixel takes --text-dim below 4.5:1. 0 hides the grid
  const TRAVEL = 1.1;      // seconds for the front to reach its full radius
  const LIFE = 1.4;        // seconds until a ripple has faded out
  const REACH = 180;       // px the front travels
  const BAND = 26;         // px width of the front
  const PUSH = 14;         // px a dot is pushed outward on the crest
  const MAX_RIPPLES = 5;
  const DRAG_PX = 6;       // a drag or a text selection is not a click
  const CONTROLS = 'a, button, input, textarea, select, summary, label, [role="button"]';

  const css = getComputedStyle(document.documentElement);
  const rgb = (hex) => {
    const n = parseInt(hex.trim().replace('#', ''), 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  };
  const ink = rgb(css.getPropertyValue('--text') || '#f5f0eb');
  const glow = rgb(css.getPropertyValue('--accent') || '#00e5ff');
  const easeOut = (t) => 1 - (1 - t) ** 3;

  let width = 0;
  let height = 0;
  let ratio = 0;
  let ripples = [];
  let frame = 0;

  function draw(now) {
    ripples = ripples.filter((r) => now - r.start < LIFE);
    ctx.clearRect(0, 0, width, height);

    // Resting dots go into one path. Dots the wave is touching are drawn after it, one by one.
    const lit = [];
    ctx.fillStyle = `rgba(${ink}, ${REST_ALPHA})`;
    ctx.beginPath();
    for (let y = SPACING / 2; y < height; y += SPACING) {
      for (let x = SPACING / 2; x < width; x += SPACING) {
        let dx = 0;
        let dy = 0;
        let hit = 0;
        for (const r of ripples) {
          const age = now - r.start;
          const ox = x - r.x;
          const oy = y - r.y;
          const dist = Math.hypot(ox, oy) || 1;
          const front = easeOut(Math.min(age / TRAVEL, 1)) * REACH;
          const k = Math.exp(-(((dist - front) / BAND) ** 2)) * (1 - age / LIFE);
          if (k < 0.01) continue;
          dx += (ox / dist) * k * PUSH;
          dy += (oy / dist) * k * PUSH;
          hit = Math.max(hit, k);
        }
        if (hit) {
          lit.push([x + dx, y + dy, Math.min(1, hit * 1.5)]);
        } else {
          ctx.moveTo(x + DOT, y);
          ctx.arc(x, y, DOT, 0, Math.PI * 2);
        }
      }
    }
    ctx.fill();

    for (const [x, y, k] of lit) {
      ctx.fillStyle = `rgba(${glow}, ${REST_ALPHA + k * 0.85})`;
      ctx.beginPath();
      ctx.arc(x, y, DOT * (1 + k * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }

    // A faint ring marks the front until it stops travelling.
    ctx.lineWidth = 1;
    for (const r of ripples) {
      const t = (now - r.start) / TRAVEL;
      if (t >= 1) continue;
      ctx.strokeStyle = `rgba(${glow}, ${0.3 * (1 - t)})`;
      ctx.beginPath();
      ctx.arc(r.x, r.y, easeOut(t) * REACH, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function tick() {
    draw(performance.now() / 1000);
    frame = ripples.length ? requestAnimationFrame(tick) : 0;
  }

  // The canvas is 100lvh tall, so a phone's address bar sliding away doesn't change its size.
  // Skip the redraw when nothing changed, since some phones fire resize on every scroll.
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const r = Math.min(window.devicePixelRatio || 1, 2);
    if (w === width && h === height && r === ratio) return;
    width = w;
    height = h;
    ratio = r;
    canvas.width = Math.round(w * r);
    canvas.height = Math.round(h * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
    draw(performance.now() / 1000);
  }
  resize();
  window.addEventListener('resize', resize);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Only clicks that land where the background shows: not on a control, not on an image,
  // and not on an opaque card, panel or the nav bar.
  const onBackground = (el) => {
    if (!el || el.closest(CONTROLS)) return false;
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      if (/^(img|svg|video|canvas|iframe)$/i.test(node.tagName)) return false;
      const channels = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
      const alpha = !channels ? 0 : channels.length > 3 ? +channels[3] : 1;
      if (alpha >= 0.5) return false;
    }
    return true;
  };

  // Pointer events rather than click: iOS Safari doesn't pass a tap on plain text or empty space
  // up to the document as a click. A scroll ends in pointercancel, not pointerup, so it never
  // ripples, and the keyboard never sends pointer events at all.
  let downAt = null;
  document.addEventListener('pointerdown', (e) => {
    downAt = e.isPrimary && e.button === 0 ? { x: e.clientX, y: e.clientY } : null;
  }, { passive: true });

  document.addEventListener('pointerup', (e) => {
    const start = downAt;
    downAt = null;
    if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_PX) return;
    if (document.body.classList.contains('menu-open')) return;
    if (!window.getSelection().isCollapsed) return; // a double-click that selected a word
    if (!onBackground(e.target)) return;

    if (ripples.length >= MAX_RIPPLES) ripples.shift();
    ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() / 1000 });
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });
})();
