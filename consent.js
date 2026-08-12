'use strict';

/* ================================================================
   GA4 Consent Management — andrejkirbis.com
   Measurement ID: G-GXLELRGY99
   ================================================================

   Default: all consent denied.
   Accept analytics: grants analytics_storage only; ad_ categories
                     remain denied.
   Reject: GA4 never loads.
   Choice persisted in localStorage under key 'ak_analytics_consent'.
   Footer "Cookie settings" link calls window.openCookieSettings().
================================================================ */

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }

/* Step 1 — set defaults BEFORE any GA4 initialisation */
gtag('consent', 'default', {
  analytics_storage:   'denied',
  ad_storage:          'denied',
  ad_user_data:        'denied',
  ad_personalization:  'denied',
  wait_for_update:     500
});

var CONSENT_KEY = 'ak_analytics_consent';
var GA_ID       = 'G-GXLELRGY99';
var _ga4Loaded  = false;

/* Load GA4 and upgrade analytics consent */
function _loadGA4() {
  if (_ga4Loaded) return;
  _ga4Loaded = true;
  gtag('consent', 'update', { analytics_storage: 'granted' });
  var s   = document.createElement('script');
  s.async = true;
  s.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  s.onload = function () {
    gtag('js', new Date());
    gtag('config', GA_ID);
  };
}

/* ---- Banner styles (injected once) ---- */
var _CSS =
  '#ak-cb{position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
  'background:#0f1f3c;color:#fff;' +
  'padding:0.875rem 1.5rem;' +
  'font-family:var(--font-body,Inter,sans-serif);font-size:0.875rem;line-height:1.55;' +
  'box-shadow:0 -2px 16px rgba(0,0,0,0.2);' +
  'display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;' +
  'justify-content:space-between;}' +
  '#ak-cb.ak-hidden{display:none!important;}' +
  '#ak-cb-text{flex:1 1 240px;}' +
  '#ak-cb-text strong{display:block;margin-bottom:0.2rem;font-size:0.9375rem;font-weight:600;}' +
  '#ak-cb-btns{display:flex;gap:0.5rem;flex-shrink:0;}' +
  '#ak-cb-accept{' +
  'background:#fff;color:#0f1f3c;border:none;' +
  'padding:0.4rem 1rem;border-radius:4px;' +
  'font-size:0.8125rem;font-weight:600;cursor:pointer;white-space:nowrap;}' +
  '#ak-cb-accept:hover{background:#dde4f0;}' +
  '#ak-cb-reject{' +
  'background:transparent;color:rgba(255,255,255,0.8);' +
  'border:1px solid rgba(255,255,255,0.4);' +
  'padding:0.4rem 1rem;border-radius:4px;' +
  'font-size:0.8125rem;font-weight:500;cursor:pointer;white-space:nowrap;}' +
  '#ak-cb-reject:hover{color:#fff;border-color:rgba(255,255,255,0.75);}' +
  '@media(max-width:560px){' +
  '#ak-cb{flex-direction:column;}' +
  '#ak-cb-btns{width:100%;}' +
  '#ak-cb-accept,#ak-cb-reject{flex:1;text-align:center;}}';

function _injectCSS() {
  if (document.getElementById('ak-cb-css')) return;
  var st = document.createElement('style');
  st.id  = 'ak-cb-css';
  st.textContent = _CSS;
  document.head.appendChild(st);
}

/* Build and append the banner; wire up buttons */
function _injectBanner() {
  if (document.getElementById('ak-cb')) return;
  _injectCSS();
  var b = document.createElement('div');
  b.id  = 'ak-cb';
  b.setAttribute('role',       'dialog');
  b.setAttribute('aria-modal', 'false');
  b.setAttribute('aria-label', 'Privacy settings');
  b.innerHTML =
    '<div id="ak-cb-text">' +
      '<strong>Privacy settings</strong>' +
      'We use Google Analytics to understand website visits and improve content. ' +
      'Analytics is enabled only if you agree. ' +
      'See our <a href="privacy.html" ' +
        'style="color:rgba(255,255,255,0.75);text-underline-offset:2px;">' +
        'Privacy Policy</a>.' +
    '</div>' +
    '<div id="ak-cb-btns">' +
      '<button id="ak-cb-accept" type="button">Accept analytics</button>' +
      '<button id="ak-cb-reject" type="button">Reject</button>' +
    '</div>';
  document.body.appendChild(b);

  document.getElementById('ak-cb-accept').addEventListener('click', function () {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    _hideBanner();
    _loadGA4();
  });
  document.getElementById('ak-cb-reject').addEventListener('click', function () {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    _hideBanner();
  });
}

function _showBanner() {
  var b = document.getElementById('ak-cb');
  if (b) {
    b.classList.remove('ak-hidden');
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _injectBanner);
    } else {
      _injectBanner();
    }
  }
}

function _hideBanner() {
  var b = document.getElementById('ak-cb');
  if (b) b.classList.add('ak-hidden');
}

/* Public API: footer "Cookie settings" link calls this */
window.openCookieSettings = _showBanner;

/* ---- Initialise on load ---- */
var _stored = localStorage.getItem(CONSENT_KEY);

if (_stored === 'accepted') {
  /* Previously accepted — load GA4 immediately */
  _loadGA4();
} else if (_stored !== 'rejected') {
  /* No stored choice — show the banner after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _injectBanner);
  } else {
    _injectBanner();
  }
}
/* If 'rejected': honour silently; footer link can reopen the banner */
