/* Mazrood theme scripts: AJAX add-to-cart + toast, mobile menu. */
(function () {
  'use strict';

  /* AJAX add-to-cart: product forms stay on the page. */
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    var action = form.getAttribute('action') || '';
    if (!/\/cart\/add(\.js)?$/.test(action)) return;

    event.preventDefault();
    var button = form.querySelector('[type="submit"]');
    var label = button ? button.textContent : '';
    if (button) { button.disabled = true; button.textContent = 'Adding…'; }

    fetch('/cart/add.js', { method: 'POST', body: new FormData(form) })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status) throw new Error(data.description || 'Could not add to cart');
        toast('Added to cart');
        return fetch('/cart.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
        });
      })
      .catch(function () { toast('Could not add to cart'); })
      .then(function () {
        if (button) { button.disabled = false; button.textContent = label; }
      });
  });

  function toast(message) {
    var el = document.getElementById('CartToast');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.hidden = true; }, 2400);
  }

  /* Mobile menu toggle. */
  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-menu-toggle]');
    if (!toggle) return;
    var nav = document.getElementById(toggle.getAttribute('aria-controls') || 'MobileNav');
    if (nav) nav.classList.toggle('open');
  });
})();