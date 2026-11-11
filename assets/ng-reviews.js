(function () {
  'use strict';

  function initReviews(root) {
    if (!root || root.dataset.ngReviewsInit === 'true') return;
    root.dataset.ngReviewsInit = 'true';

    var track = root.querySelector('[data-ng-reviews-track]');
    var prev = root.querySelector('[data-ng-reviews-prev]');
    var next = root.querySelector('[data-ng-reviews-next]');
    if (!track) return;

    function step() {
      var card = track.querySelector('.ng-reviews__card');
      if (!card) return 320;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function updateNav() {
      if (!prev || !next) return;
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    }

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: 'smooth' });
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
  }

  function boot() {
    document.querySelectorAll('[data-ng-reviews]').forEach(initReviews);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target && e.target.querySelector
      ? e.target.querySelector('[data-ng-reviews]')
      : null;
    if (root) {
      delete root.dataset.ngReviewsInit;
      initReviews(root);
    }
  });
})();
