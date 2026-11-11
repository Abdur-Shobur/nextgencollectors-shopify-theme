(function () {
  'use strict';

  function initTabs(root) {
    if (!root || root.dataset.ngPtInit === 'true') return;
    root.dataset.ngPtInit = 'true';

    var tabs = root.querySelectorAll('[data-ng-pt-tab]');
    var panels = root.querySelectorAll('[data-ng-pt-panel]');
    var viewAll = root.querySelector('[data-ng-pt-view-all]');
    if (!tabs.length || !panels.length) return;

    function activate(index) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });

      panels.forEach(function (panel, i) {
        var on = i === index;
        panel.classList.toggle('is-active', on);
        panel.hidden = !on;
      });

      if (viewAll) {
        var active = tabs[index];
        var url = active && active.getAttribute('data-collection-url');
        if (url) viewAll.setAttribute('href', url);
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activate(index);
      });

      tab.addEventListener('keydown', function (e) {
        var next = index;
        if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        else return;
        e.preventDefault();
        activate(next);
        tabs[next].focus();
      });
    });

    activate(0);
  }

  function boot() {
    document.querySelectorAll('[data-ng-product-tabs]').forEach(initTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target && e.target.querySelector
      ? e.target.querySelector('[data-ng-product-tabs]')
      : null;
    if (root) {
      delete root.dataset.ngPtInit;
      initTabs(root);
    }
  });
})();
