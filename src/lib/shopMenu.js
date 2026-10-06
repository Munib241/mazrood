// Shop-by-category groups shown under the main menu's Men / Women / Kids.
// Every route below points at a live, in-stock Shopify collection.
export const CATEGORIES = {
  men: [
    { title: "T-Shirts", route: "/store/men-t-shirts" },
    { title: "Shirts", route: "/store/men-shirts" },
    { title: "Hoodies & Sweaters", route: "/store/men-hoodies-sweaters" },
    { title: "Jackets & Vests", route: "/store/men-jackets-vests" },
    { title: "Pants & Shorts", route: "/store/men-pants-shorts" },
    { title: "Underwear", route: "/store/men-underwear" },
    { title: "Ski", route: "/store/ski-men" },
  ],
  women: [
    { title: "T-Shirts", route: "/store/women-t-shirts" },
    { title: "Shirts", route: "/store/women-shirts" },
    { title: "Hoodies & Sweaters", route: "/store/women-hoodies-sweaters" },
    { title: "Jackets & Vests", route: "/store/women-jackets-vests" },
    { title: "Pants & Shorts", route: "/store/women-pants-shorts" },
    { title: "Ski", route: "/store/ski-women" },
  ],
  kids: [
    { title: "Hoodies & Sweaters", route: "/store/kids?type=hoodie,sweater" },
    { title: "Shirts & Tops", route: "/store/kids?type=shirt,top" },
    { title: "Shorts", route: "/store/kids?type=shorts" },
  ],
};

// Label for a "?type=" category inside a collection (e.g. Kids → Shorts).
export const categoryLabel = (handle, type) =>
  type
    ? CATEGORIES[handle]?.find((c) => c.route === `/store/${handle}?type=${type}`)?.title || null
    : null;

// Turns a Shopify menu URL into an in-app route.
const toRoute = (url) => {
  if (!url) return null;
  try {
    const path = new URL(url, "https://www.mazrood.com").pathname.replace(/\/$/, "");
    if (path === "") return "/";
    if (path.startsWith("/collections/")) return `/store/${path.split("/")[2]}`;
    if (path.startsWith("/products/")) return `/product/${path.split("/")[2]}`;
    if (path === "/collections") return "/store";
    return null;
  } catch {
    return null;
  }
};

const routeOf = (item) => (item.handle ? `/store/${item.handle}` : toRoute(item.url));

// Shopify main-menu → header links, with category dropdowns attached.
export const buildMenu = (items) =>
  (items || [])
    .map((item) => {
      const route = routeOf(item);
      if (!route) return null;
      const children =
        CATEGORIES[item.handle] ||
        (item.items || [])
          .map((c) => ({ title: c.title, route: routeOf(c) }))
          .filter((c) => c.route);
      return { title: item.title, route, children };
    })
    .filter(Boolean);

// Mirrors the Shopify main menu so the header never shows empty while loading.
export const FALLBACK_MENU = buildMenu([
  { title: "Home", url: "/" },
  { title: "SS23", handle: "summer23" },
  { title: "Men", handle: "men" },
  { title: "Women", handle: "women" },
  { title: "Kids", handle: "kids" },
  { title: "Accessories", handle: "accessories", items: [{ title: "Headwear", handle: "caps" }] },
  { title: "Gift Cards", handle: "mazrood-gift-card" },
]);