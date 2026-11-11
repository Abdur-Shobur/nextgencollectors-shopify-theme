(function () {
  'use strict';

  function initShopBy(root) {
    if (!root || root.dataset.ngShopByInit === 'true') return;
    root.dataset.ngShopByInit = 'true';

    var track = root.querySelector('[data-ng-shop-by-track]');
    var prev = root.querySelector('[data-ng-shop-by-prev]');
    var next = root.querySelector('[data-ng-shop-by-next]');
    if (!track) return;

    function step() {
      var item = track.querySelector('.ng-shop-by__item');
      if (!item) return 200;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return item.getBoundingClientRect().width + gap;
    }

    function updateNav() {
      if (!prev || !next) return;
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -step() * 2, behavior: 'smooth' });
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: step() * 2, behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
  }

  function boot() {
    document.querySelectorAll('[data-ng-shop-by]').forEach(initShopBy);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target && e.target.querySelector
      ? e.target.querySelector('[data-ng-shop-by]')
      : null;
    if (root) {
      delete root.dataset.ngShopByInit;
      initShopBy(root);
    }
  });
})();
