(function () {
  'use strict';

  function initHeader(root) {
    if (!root || root.dataset.ngHeaderInit === 'true') return;
    root.dataset.ngHeaderInit = 'true';

    var header = root.querySelector('#ng-header');
    if (!header) return;

    var navToggle = header.querySelector('#ng-nav-toggle');
    var triggers = header.querySelectorAll('[data-ng-trigger]');

    function closeAll(except) {
      triggers.forEach(function (t) {
        if (t === except) return;
        t.setAttribute('aria-expanded', 'false');
        if (t.parentElement) t.parentElement.classList.remove('is-open');
      });
    }

    triggers.forEach(function (t) {
      t.addEventListener('click', function () {
        var open = t.getAttribute('aria-expanded') === 'true';
        closeAll(t);
        t.setAttribute('aria-expanded', String(!open));
        if (t.parentElement) t.parentElement.classList.toggle('is-open', !open);
      });
    });

    if (navToggle) {
      navToggle.addEventListener('click', function () {
        var open = header.classList.toggle('is-nav-open');
        navToggle.setAttribute('aria-expanded', String(open));
        if (!open) closeAll();
      });
    }

    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        closeAll();
        header.classList.remove('is-nav-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var openTrigger = header.querySelector('[data-ng-trigger][aria-expanded="true"]');
      closeAll();
      header.classList.remove('is-nav-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      if (openTrigger) openTrigger.focus();
    });
  }

  function initOffers(root) {
    var bar = root.querySelector('[data-ng-offers]');
    if (!bar) return;

    var items = bar.querySelectorAll('[data-ng-offer-item]');
    if (items.length) items[0].classList.add('is-active');
    if (items.length <= 1) return;

    var intervalMs = parseInt(bar.getAttribute('data-rotate-interval'), 10) || 4000;
    var pauseOnHover = bar.getAttribute('data-pause-hover') === 'true';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var desktopMq = window.matchMedia('(min-width: 768px)');
    var index = 0;
    var timer = null;

    function show(next) {
      items[index].classList.remove('is-active');
      index = next;
      items[index].classList.add('is-active');
    }

    function tick() {
      show((index + 1) % items.length);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      // Desktop only — mobile uses CSS marquee
      if (!desktopMq.matches || reduceMotion) return;
      timer = window.setInterval(tick, intervalMs);
    }

    start();

    if (typeof desktopMq.addEventListener === 'function') {
      desktopMq.addEventListener('change', start);
    } else if (typeof desktopMq.addListener === 'function') {
      desktopMq.addListener(start);
    }

    if (pauseOnHover) {
      bar.addEventListener('mouseenter', stop);
      bar.addEventListener('mouseleave', start);
      bar.addEventListener('focusin', stop);
      bar.addEventListener('focusout', start);
    }
  }

  function boot() {
    var root = document.querySelector('[data-ng-header-root]');
    if (!root) return;
    initHeader(root);
    initOffers(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target && e.target.querySelector && e.target.querySelector('[data-ng-header-root]')) {
      var root = e.target.querySelector('[data-ng-header-root]');
      if (root) {
        delete root.dataset.ngHeaderInit;
        initHeader(root);
        initOffers(root);
      }
    }
  });
})();
