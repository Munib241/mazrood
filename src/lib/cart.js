// Session cart kept in localStorage and announced via a custom window event,
// so the header badge and the cart drawer stay in sync without a provider.
const KEY = "mazrood_cart_v1";
const EVENT = "mazrood:cart";

export const readCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: cart }));
};

export const addToCart = (item) => {
  const cart = readCart();
  const existing = cart.find((i) => i.variantId === item.variantId);
  if (existing) {
    existing.qty = Math.min(existing.qty + (item.qty || 1), 10);
  } else {
    cart.push({ ...item, qty: Math.min(item.qty || 1, 10) });
  }
  writeCart(cart);
};

export const setQty = (variantId, qty) => {
  writeCart(
    readCart().map((i) =>
      i.variantId === variantId ? { ...i, qty: Math.min(Math.max(qty, 1), 10) } : i
    )
  );
};

export const removeFromCart = (variantId) => {
  writeCart(readCart().filter((i) => i.variantId !== variantId));
};

export const clearCart = () => writeCart([]);

export const cartCount = (cart) =>
  (cart || readCart()).reduce((n, i) => n + (i.qty || 1), 0);

export const cartLines = (items) =>
  (items || []).map((i) => ({ variantId: i.variantId, quantity: i.qty }));

export const onCartChange = (cb) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};