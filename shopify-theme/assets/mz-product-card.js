/* mz-product-card — swatch crossfade + scroll reveal */
(function () {
  document.addEventListener('click', function (e) {
    var sw = e.target.closest('[data-mzp-sw]');
    if (!sw) return;
    e.preventDefault();
    var card = sw.closest('[data-mzp]');
    if (!card) return;
    var i = sw.getAttribute('data-mzp-sw');
    card.querySelectorAll('[data-mzp-view]').forEach(function (v) {
      v.classList.toggle('mzp-on', v.getAttribute('data-mzp-view') === i);
    });
    card.querySelectorAll('[data-mzp-sw]').forEach(function (b) {
      b.classList.toggle('mzp-sw-on', b === sw);
    });
    var label = card.querySelector('[data-mzp-sw-label]');
    if (label) label.textContent = sw.getAttribute('data-mzp-sw-name') || '';
  });

  function reveal() {
    var els = document.querySelectorAll('.mzp-card:not(.mzp-vis)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('mzp-vis'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('mzp-vis'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reveal);
  else reveal();
  document.addEventListener('shopify:section:load', reveal);
})();
