import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/hooks/useShopifyProducts";
import {
  readCart,
  setQty,
  removeFromCart,
  clearCart,
  cartLines,
  onCartChange,
} from "@/lib/cart";

export default function CartDrawer({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setItems(readCart());
    return onCartChange((cart) => setItems(cart));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);
  const currency = items[0]?.currency || "USD";

  // Same checkout handoff as the product page: Shopify refuses to render
  // inside the editor preview frame, so there it opens in a fresh tab.
  const checkout = async () => {
    setBusy(true);
    setError(null);
    const tab = window.self !== window.top ? window.open("", "_blank") : null;
    try {
      const res = await base44.functions.invoke("shopify_checkout", {
        lines: cartLines(items),
      });
      const url = res?.data?.checkoutUrl;
      if (url) {
        (tab || window.top).location.href = url;
        clearCart();
        if (tab) setBusy(false);
        return;
      }
      setError(res?.data?.error || "Could not start checkout. Please try again.");
    } catch {
      setError("Could not start checkout. Please try again.");
    }
    tab?.close();
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-5">
          <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
            Cart ({items.reduce((n, i) => n + i.qty, 0)})
          </p>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))]"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-heading text-xl text-[hsl(var(--foreground))]">
              Your cart is empty.
            </p>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Add pieces from the store to see them here.
            </p>
            <Link
              to="/store"
              onClick={onClose}
              className="btn-ghost mt-6 inline-flex rounded-sm px-5 py-2.5 font-mono-tech text-xs uppercase tracking-[0.2em]"
            >
              Browse the store
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 border-b border-[hsl(var(--border))] py-5"
                >
                  <Link
                    to={`/product/${item.handle}`}
                    onClick={onClose}
                    className="h-20 w-16 shrink-0 overflow-hidden rounded-sm border border-[hsl(var(--border))]"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fittingType="fill"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/product/${item.handle}`}
                      onClick={onClose}
                      className="font-body block text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
                    >
                      {item.name}
                    </Link>
                    {item.options && (
                      <p className="font-mono-tech mt-1 truncate text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                        {item.options}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(item.variantId, item.qty - 1)}
                        aria-label="Decrease quantity"
                        className="border border-[hsl(var(--border))] px-2.5 py-1 text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--primary))]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono-tech w-5 text-center text-sm text-[hsl(var(--foreground))]">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.variantId, item.qty + 1)}
                        disabled={item.qty >= 10}
                        aria-label="Increase quantity"
                        className="border border-[hsl(var(--border))] px-2.5 py-1 text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--primary))] disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variantId)}
                        aria-label={`Remove ${item.name}`}
                        className="font-mono-tech ml-2 text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--destructive))]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-mono-tech shrink-0 text-sm text-[hsl(var(--primary))]">
                    {formatPrice(item.price * item.qty, item.currency)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[hsl(var(--border))] px-6 py-5">
              <div className="flex items-baseline justify-between">
                <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                  Subtotal
                </p>
                <p className="font-mono-tech text-lg text-[hsl(var(--foreground))]">
                  {formatPrice(subtotal, currency)}
                </p>
              </div>
              <p className="font-mono-tech mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                Shipping &amp; taxes at checkout
              </p>
              <button
                type="button"
                onClick={checkout}
                disabled={busy}
                className="btn-solid mt-4 w-full rounded-sm px-6 py-4 font-mono-tech text-xs uppercase tracking-[0.25em] disabled:opacity-50"
              >
                {busy ? "Starting checkout…" : "Checkout"}
              </button>
              {error && (
                <p className="mt-3 text-sm text-[hsl(var(--destructive))]">{error}</p>
              )}
              <p className="font-mono-tech mt-3 text-[0.6rem] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                Secure checkout on Shopify
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}