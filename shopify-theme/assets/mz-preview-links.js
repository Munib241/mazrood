/* Mazrood — keep the theme preview on this theme when clicking links.
   In an unpublished theme preview, links without the preview parameter drop the
   visitor back onto the published (old) theme. Rewrite internal links to carry
   the parameter so clicking around stays on this theme. */
(function () {
  var previewId = new URLSearchParams(window.location.search).get('preview_theme_id');
  if (!previewId) return;
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
})();