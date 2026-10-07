/* Mazrood Studio — theme.js (cart drawer, nav, product page) */
(function () {
  var CURRENCY = window.MZ_CURRENCY || '$';
  function money(cents) { return CURRENCY + (cents / 100).toFixed(2); }

  /* ── Cart drawer ── */
  var drawer = document.getElementById('CartDrawer');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    loadCart();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); openDrawer(); return; }
    if (e.target.closest('[data-cd-close]')) { e.preventDefault(); closeDrawer(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  function fetchJSON(url, opts) {
    return fetch(url, opts).then(function (r) {
      if (!r.ok) throw new Error('Cart request failed');
      return r.json();
    });
  }

  function loadCart() {
    if (!drawer) return;
    fetchJSON('/cart.js').then(function (cart) {
      renderItems(cart);
      updateCounts(cart);
    }).catch(function () {});
  }

  function renderItems(cart) {
    var items = drawer.querySelector('[data-cd-items]');
    var foot = drawer.querySelector('[data-cd-foot]');
    if (!items) return;
    items.innerHTML = '';
    if (!cart.item_count) {
      items.innerHTML =
        '<p class="cd-empty">Your cart is empty.</p>' +
        '<a class="cd-continue" href="/collections/all">Continue shopping</a>';
      if (foot) foot.style.display = 'none';
      return;
    }
    if (foot) foot.style.display = '';
    cart.items.forEach(function (it) {
      var row = document.createElement('div');
      row.className = 'cd-item';
      row.setAttribute('data-cd-key', it.key);
      var img = it.image ? it.image.replace(/(\.[a-zA-Z]+)(\?|$)/, '_180x$1$2') : '';
      row.innerHTML =
        '<a class="cd-item-img" href="' + it.url + '">' + (img ? '<img src="' + img + '" alt="">' : '') + '</a>' +
        '<div class="cd-item-info">' +
          '<a href="' + it.url + '">' + (it.product_title || '') + '</a>' +
          (it.variant_title && it.variant_title !== 'Default Title' ? '<p class="cd-variant">' + it.variant_title + '</p>' : '') +
          '<div class="cd-qty">' +
            '<button type="button" data-cd-minus aria-label="Decrease quantity">&minus;</button>' +
            '<span>' + it.quantity + '</span>' +
            '<button type="button" data-cd-plus aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<button type="button" class="cd-remove" data-cd-remove>Remove</button>' +
        '</div>' +
        '<p class="cd-price">' + money(it.final_line_price) + '</p>';
      items.appendChild(row);
    });
    var sub = drawer.querySelector('[data-cd-subtotal]');
    if (sub) sub.textContent = money(cart.total_price);
  }

  function updateCounts(cart) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = cart.item_count;
      el.hidden = cart.item_count === 0;
    });
    if (drawer) {
      var c = drawer.querySelector('[data-cd-count]');
      if (c) c.textContent = cart.item_count;
    }
  }

  function changeQty(key, qty) {
    fetchJSON('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (cart) {
      renderItems(cart);
      updateCounts(cart);
    }).catch(function () {});
  }

  document.addEventListener('click', function (e) {
    var minus = e.target.closest('[data-cd-minus]');
    var plus = e.target.closest('[data-cd-plus]');
    var rem = e.target.closest('[data-cd-remove]');
    if (!minus && !plus && !rem) return;
    var row = e.target.closest('[data-cd-key]');
    if (!row) return;
    var span = row.querySelector('.cd-qty span');
    var q = span ? parseInt(span.textContent, 10) || 1 : 1;
    if (rem) q = 0;
    if (minus) q = Math.max(0, q - 1);
    if (plus) q = q + 1;
    changeQty(row.getAttribute('data-cd-key'), q);
  });

  /* ── Mobile nav ── */
  var hdr = document.getElementById('SiteHeader');
  var burger = hdr && hdr.querySelector('[data-nav-toggle]');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = hdr.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ── Header: glass panel once scrolled off the home hero ── */
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Product page: gallery ── */
  var mainImg = document.querySelector('[data-pp-main]');
  if (mainImg) {
    document.querySelectorAll('[data-pp-thumb]').forEach(function (t) {
      t.addEventListener('click', function () {
        mainImg.src = t.getAttribute('data-pp-thumb');
        document.querySelectorAll('[data-pp-thumb]').forEach(function (x) { x.classList.remove('is-on'); });
        t.classList.add('is-on');
      });
    });
  }

  /* ── Product page: variant picker ── */
  var vjson = document.querySelector('[data-pp-variants]');
  var form = document.getElementById('ppForm');
  if (vjson && form) {
    var variants = JSON.parse(vjson.textContent);
    var selects = Array.prototype.slice.call(form.querySelectorAll('[data-pp-option-index]'));
    var idInput = form.querySelector('[data-pp-id]');
    var priceEl = document.querySelector('[data-pp-price]');
    var compareEl = document.querySelector('[data-pp-compare]');
    var stockEl = document.querySelector('[data-pp-stock]');
    var addBtn = form.querySelector('[data-pp-add]');

    function current() {
      var chosen = selects.map(function (s) { return s.value; });
      for (var i = 0; i < variants.length; i++) {
        var v = variants[i];
        var opts = [v.option1, v.option2, v.option3].slice(0, selects.length);
        var ok = opts.every(function (o, idx) { return o === chosen[idx]; });
        if (ok) return v;
      }
      return null;
    }

    function update() {
      var v = current();
      if (!v) return;
      if (idInput) idInput.value = v.id;
      if (priceEl) priceEl.textContent = money(v.price);
      if (compareEl) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          compareEl.textContent = money(v.compare_at_price);
          compareEl.hidden = false;
        } else {
          compareEl.hidden = true;
        }
      }
      if (addBtn) {
        if (v.available) { addBtn.disabled = false; addBtn.textContent = 'Add to cart'; }
        else { addBtn.disabled = true; addBtn.textContent = 'Sold out'; }
      }
      if (stockEl) stockEl.textContent = v.available ? 'In stock' : 'Sold out';
      if (v.url && history.replaceState) history.replaceState({}, '', v.url);
    }

    selects.forEach(function (s) { s.addEventListener('change', update); });
    update();
  }

  /* ── Auto-submitting selects (collection sort) ── */
  document.querySelectorAll('[data-auto-submit]').forEach(function (f) {
    f.addEventListener('change', function () { f.submit(); });
  });

  /* ── Recover password toggle ── */
  var rt = document.querySelector('[data-recover-toggle]');
  var rec = document.getElementById('recover');
  var loginForm = document.getElementById('customerLogin');
  if (rt && rec) {
    rt.addEventListener('click', function (e) {
      e.preventDefault();
      rec.hidden = !rec.hidden;
      if (!rec.hidden && loginForm) loginForm.hidden = true;
    });
  }
})();