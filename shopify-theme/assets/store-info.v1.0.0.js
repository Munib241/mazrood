const ccThemeRole = Shopify.theme.role ?? 'unknown';
const scriptElement = document.querySelector('script[src*=store-info]');
const ccLSCheckKey = `cc-settings-loaded-${(scriptElement === null || scriptElement === void 0 ? void 0 : scriptElement.dataset.theme) ?? ''}`;

if (!localStorage.getItem(ccLSCheckKey) || localStorage.getItem(ccLSCheckKey) !== ccThemeRole) {
  const decode = (t) => new DOMParser().parseFromString(t, 'text/html').documentElement.textContent.trim();

  const getStoreName = () => {var _document$querySelect, _document$title;
    const ogContent = (_document$querySelect = document.querySelector('meta[property="og:site_name"]')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.getAttribute('content');
    if (ogContent) return decode(ogContent);

    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
    for (const script of scripts) {
      try {var _data$find;
        const data = [].concat(JSON.parse(script.textContent));
        const name = (_data$find = data.find((obj) => {var _obj$Type;return (obj === null || obj === void 0 || (_obj$Type = obj['@type']) === null || _obj$Type === void 0 ? void 0 : _obj$Type.toLowerCase()) === 'organization';})) === null || _data$find === void 0 ? void 0 : _data$find.name;
        if (name) return decode(String(name));
      } catch (e) {/* Skip */}
    }

    return ((_document$title = document.title) === null || _document$title === void 0 || (_document$title = _document$title.split(/\s[–—\-|]\s/).pop()) === null || _document$title === void 0 ? void 0 : _document$title.trim()) || '';
  };

  fetch('https://check.cleancanvas.co.uk/', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    mode: 'cors',
    body: new URLSearchParams({
      shop: Shopify.shop,
      theme: (scriptElement === null || scriptElement === void 0 ? void 0 : scriptElement.dataset.theme) ?? '',
      version: (scriptElement === null || scriptElement === void 0 ? void 0 : scriptElement.dataset.version) ?? '',
      role: ccThemeRole,
      storeName: getStoreName(),
      country: Shopify.country,
      contact: (scriptElement === null || scriptElement === void 0 ? void 0 : scriptElement.dataset.contact) ?? ''
    })
  }).
  then((response) => {
    if (response.ok) {
      localStorage.setItem(ccLSCheckKey, ccThemeRole);
    }
  });
}