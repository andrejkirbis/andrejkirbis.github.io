'use strict';

/* --- Mobile nav toggle --- */
(function () {
  var toggle  = document.getElementById('nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  function openNav() {
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = '';
  }

  function closeNav() {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    mobileNav.classList.contains('open') ? closeNav() : openNav();
  });

  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeNav();
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 768) closeNav();
    }, 100);
  }, { passive: true });
})();

/* --- Active nav highlight --- */
(function () {
  var page = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  var selectors = ['.main-nav a', '.mobile-nav a'];
  selectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (a) {
      var href   = (a.getAttribute('href') || '').split('/').pop();
      var isHome = (page === '' || page === 'index.html') && (href === 'index.html' || href === '');
      if (isHome || href === page) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  });
})();

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var id     = a.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
    var top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* --- Footer year --- */
var fy = document.getElementById('footer-year');
if (fy) fy.textContent = new Date().getFullYear();

/* --- Subtle fade-in on scroll --- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var style = document.createElement('style');
  style.textContent =
    '.will-fade { opacity: 0; transform: translateY(10px); transition: opacity 0.4s ease, transform 0.4s ease; }' +
    '.will-fade.in-view { opacity: 1; transform: none; }';
  document.head.appendChild(style);

  var targets = document.querySelectorAll(
    '.theme-item, .hp-pub-item, .project-row, .project-entry, ' +
    '.research-item, .timeline-item, .profile-tile'
  );

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

  targets.forEach(function (el, i) {
    el.classList.add('will-fade');
    el.style.transitionDelay = Math.min((i % 5) * 40, 160) + 'ms';
    obs.observe(el);
  });
})();
