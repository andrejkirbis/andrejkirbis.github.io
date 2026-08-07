/* =============================================================
   Andrej Kirbiš — Academic Website
   script.js
   ============================================================= */

'use strict';

/* --- Navigation: scroll shadow --- */
(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* --- Navigation: mobile toggle --- */
(function () {
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const nav      = document.querySelector('.site-nav');
  if (!toggle || !navLinks) return;

  function openNav() {
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    navLinks.classList.contains('open') ? closeNav() : openNav();
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !nav.contains(e.target)) closeNav();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
})();

/* --- Navigation: active link --- */
(function () {
  const page = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    const isHome = (page === '' || page === 'index.html') && (href === 'index.html' || href === '');
    const isMatch = href === page;
    if (isHome || isMatch) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 82;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* --- Fade-in on scroll (respects prefers-reduced-motion) --- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.48s ease, transform 0.48s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.project-card, .interest-item, .timeline-item, .research-area, .contact-info-item, .profile-link'
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -56px 0px', threshold: 0.07 });

  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${Math.min(i % 4 * 55, 190)}ms`;
    obs.observe(el);
  });
})();
