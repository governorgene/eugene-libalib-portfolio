// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Hero role rotator =====
(function initRoleRotator() {
  const roles = [
    'GoHighLevel Specialist',
    'Marketing Automation Architect',
    'Web Developer',
    'AI Integrator',
    'Network Operations Engineer',
  ];
  const el = document.querySelector('.role-rotator__word');
  if (!el) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;

  setInterval(() => {
    i = (i + 1) % roles.length;
    if (reduced) {
      el.textContent = roles[i];
      return;
    }
    el.classList.add('is-leaving');
    setTimeout(() => {
      el.textContent = roles[i];
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
  const targets = document.querySelectorAll('.card, .project, .section__title, .about p, .badge');
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
(function initExpertiseToWorkLink() {
  document.querySelectorAll('.card[data-role]').forEach((card) => {
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    const activate = () => {
      const role = card.dataset.role;
      const chip = document.querySelector(`.chip[data-filter="${role}"]`);
      if (chip) chip.click();
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    };

    card.addEventListener('click', activate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
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
