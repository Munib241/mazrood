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

  /* ── Product page: gallery carousel ── */
  var gallery = document.querySelector('[data-pp-gallery]');
  var goToMedia = null;
  var track = gallery && gallery.querySelector('[data-pp-track]');
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(gallery.querySelectorAll('[data-pp-dot]'));
    var countEl = gallery.querySelector('[data-pp-count]');
    var gidx = 0;
    function markMedia(i) {
      gidx = i;
      dots.forEach(function (d, j) { d.classList.toggle('is-on', j === i); });
      if (countEl) countEl.textContent = (i + 1) + ' / ' + slides.length;
    }
    function showMedia(i) {
      if (slides.length < 2) return;
      i = (i + slides.length) % slides.length;
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
      markMedia(i);
    }
    /* keep dots + counter in sync with finger swipes */
    var settle;
    track.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = Math.round(track.scrollLeft / (track.clientWidth || 1));
        markMedia(Math.max(0, Math.min(slides.length - 1, i)));
      }, 80);
    }, { passive: true });
    var prevBtn = gallery.querySelector('[data-pp-prev]');
    var nextBtn = gallery.querySelector('[data-pp-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { showMedia(gidx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showMedia(gidx + 1); });
    dots.forEach(function (d, j) { d.addEventListener('click', function () { showMedia(j); }); });
    goToMedia = function (mediaId) {
      for (var s = 0; s < slides.length; s++) {
        if (slides[s].getAttribute('data-media-id') === String(mediaId)) { showMedia(s); return; }
      }
    };
  }

  /* ── Product page: swatch + size variant picker ── */
  var SWATCH_COLORS = {
    black: '#15151a', onyx: '#15151a', charcoal: '#33333b', white: '#ffffff', ivory: '#f6f1e7',
    bone: '#e8e2d6', cream: '#f0e9dc', beige: '#e6d8c3', sand: '#dcc9a8', ecru: '#e4dcc8',
    tan: '#d2b48c', brown: '#7a5230', camel: '#c19a6b', cognac: '#9a5b2e', khaki: '#b6a271',
    stone: '#a8a396', navy: '#001f5c', blue: '#2a4bd7', royal: '#1f3fd0', sky: '#87ceeb',
    'light blue': '#9fc3e8', green: '#2e7d32', olive: '#6b6b2a', sage: '#a8b79a', forest: '#1e4d2b',
    mint: '#a9d8c0', teal: '#177e77', turquoise: '#3ec1c9', red: '#c0392b', burgundy: '#7b1f31',
    maroon: '#6d1a2d', pink: '#e8a7b6', purple: '#6a3aa0', lavender: '#c7b8e0', yellow: '#e6c744',
    gold: '#c9a227', orange: '#d97b29', grey: '#9a9aa2', gray: '#9a9aa2', silver: '#c9c9cf'
  };
  var vjson = document.querySelector('[data-pp-variants]');
  var form = document.getElementById('ppForm');
  if (vjson && form) {
    var variants = JSON.parse(vjson.textContent);
    var valueBtns = Array.prototype.slice.call(form.querySelectorAll('[data-pp-value]'));
    var idInput = form.querySelector('[data-pp-id]');
    var priceEl = document.querySelector('[data-pp-price]');
    var compareEl = document.querySelector('[data-pp-compare]');
    var stockEl = document.querySelector('[data-pp-stock]');
    var addBtn = form.querySelector('[data-pp-add]');

    var groupCount = (function () {
      var s = {};
      valueBtns.forEach(function (b) { s[b.getAttribute('data-pp-option-index')] = 1; });
      return Object.keys(s).length;
    })();
    var chosen = [];

    /* paint swatches with their color, or fall back to the first letter */
    form.querySelectorAll('.pp-sw').forEach(function (b) {
      var name = (b.getAttribute('data-pp-value') || '').toLowerCase().trim();
      var hex = null;
      for (var key in SWATCH_COLORS) {
        if (name === key || name.indexOf(key) !== -1) { hex = SWATCH_COLORS[key]; break; }
      }
      var dot = b.querySelector('.pp-sw-dot');
      if (dot) {
        if (hex) { dot.style.background = hex; }
        else { dot.textContent = (b.getAttribute('data-pp-value') || '?').charAt(0).toUpperCase(); }
      }
    });

    function findVariant() {
      for (var i = 0; i < variants.length; i++) {
        var v = variants[i];
        var opts = [v.option1, v.option2, v.option3].slice(0, chosen.length);
        var ok = opts.every(function (o, idx) { return o === chosen[idx]; });
        if (ok) return v;
      }
      return null;
    }

    function apply(v) {
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

    function render() {
      valueBtns.forEach(function (b) {
        var oi = parseInt(b.getAttribute('data-pp-option-index'), 10);
        b.classList.toggle('is-on', chosen[oi] === b.getAttribute('data-pp-value'));
      });
      form.querySelectorAll('[data-pp-group]').forEach(function (g) {
        var oi = parseInt(g.getAttribute('data-pp-group'), 10);
        var lab = g.querySelector('[data-pp-opt-value]');
        if (lab) lab.textContent = chosen[oi] || '';
      });
    }

    valueBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var oi = parseInt(b.getAttribute('data-pp-option-index'), 10);
        var val = b.getAttribute('data-pp-value');
        chosen[oi] = val;
        /* a color swatch jumps the carousel to that color's photo */
        if (goToMedia && b.classList.contains('pp-sw')) {
          for (var k = 0; k < variants.length; k++) {
            var vk = variants[k];
            if ([vk.option1, vk.option2, vk.option3][oi] === val && vk.featured_media) {
              goToMedia(vk.featured_media.id);
              break;
            }
          }
        }
        var v = findVariant();
        if (!v) {
          for (var i = 0; i < variants.length; i++) {
            var ov = [variants[i].option1, variants[i].option2, variants[i].option3][oi];
            if (variants[i].available && ov === chosen[oi]) { v = variants[i]; break; }
          }
        }
        if (v) {
          chosen = [v.option1, v.option2, v.option3].slice(0, groupCount);
          render();
          apply(v);
        } else {
          render();
        }
      });
    });

    /* start from the variant Shopify pre-selected (URL or first available) */
    var init = null;
    if (idInput) {
      var idv = parseInt(idInput.value, 10);
      for (var i = 0; i < variants.length; i++) { if (variants[i].id === idv) { init = variants[i]; break; } }
    }
    if (!init) init = variants[0];
    chosen = [init.option1, init.option2, init.option3].slice(0, groupCount);
    render();
  }

  /* ── Product page: AJAX add to cart, then open the drawer ── */
  var ppForm = document.getElementById('ppForm');
  if (ppForm) {
    ppForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var addBtn = ppForm.querySelector('[data-pp-add]');
      if (addBtn) { addBtn.disabled = true; addBtn.textContent = 'Adding…'; }
      fetch('/cart/add.js', { method: 'POST', body: new FormData(ppForm) })
        .then(function (r) {
          if (!r.ok) throw new Error('Add to cart failed');
          return r.json();
        })
        .then(function () {
          if (addBtn) { addBtn.disabled = false; addBtn.textContent = 'Add to cart'; }
          openDrawer();
        })
        .catch(function () { ppForm.submit(); });
    });
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

  /* ── Theme preview: keep preview_theme_id on internal links ──
     In an unpublished theme preview, links without the preview parameter drop
     the visitor back onto the published (old) theme. Rewrite internal links
     to carry the parameter so clicking around stays on this theme. */
  var previewId = new URLSearchParams(window.location.search).get('preview_theme_id');
  if (previewId) {
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var raw = a.getAttribute('href');
      if (!raw || raw.charAt(0) === '#') return;
      var u;
      try { u = new URL(raw, window.location.origin); } catch (err) { return; }
      if (u.origin !== window.location.origin) return;
      if (u.pathname.indexOf('/admin') === 0 || u.pathname === '/checkout') return;
      u.searchParams.set('preview_theme_id', previewId);
      a.setAttribute('href', u.pathname + u.search + u.hash);
    });
  }
})();