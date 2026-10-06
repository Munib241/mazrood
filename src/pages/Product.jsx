import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import Nav from "@/components/mazrood/Nav";
import BottomTabs from "@/components/mazrood/BottomTabs";
import { formatPrice } from "@/hooks/useShopifyProducts";

export default function Product() {
  const { handle } = useParams();
  const [state, setState] = useState({ loading: true, product: null, error: false });
  const [variantId, setVariantId] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, product: null, error: false });
    setVariantId(null);
    setImgIndex(0);
    setCheckoutError(null);
    base44.functions
      .invoke("shopify_products", { handles: [handle] })
      .then((res) => {
        if (cancelled) return;
        const p = res?.data?.products?.[0] || null;
        setState({ loading: false, product: p, error: !p });
        const first =
          p?.variants?.find((v) => !v.soldOut) || p?.variants?.[0] || null;
        if (first) setVariantId(first.id);
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, product: null, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  const startCheckout = async () => {
    setBusy(true);
    setCheckoutError(null);
    // Shopify checkout refuses to load inside a frame (like the editor
    // preview), so there it opens in a new tab — opened now, while the tap
    // still counts, so popup blockers allow it.
    const tab = window.self !== window.top ? window.open("", "_blank") : null;
    try {
      const res = await base44.functions.invoke("shopify_checkout", { variantId });
      const url = res?.data?.checkoutUrl;
      if (url) {
        (tab || window.top).location.href = url;
        if (tab) setBusy(false);
        return;
      }
      setCheckoutError("Could not start checkout. Please try again.");
    } catch {
      setCheckoutError("Could not start checkout. Please try again.");
    }
    tab?.close();
    setBusy(false);
  };

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--border))] border-t-[hsl(var(--primary))]" />
      </div>
    );
  }

  if (state.error || !state.product) {
    return (
      <div className="relative min-h-screen bg-[hsl(var(--background))]">
        <div className="light-leak" />
        <Nav />
        <main className="relative z-10 mx-auto max-w-xl px-6 pb-24 pt-40 text-center">
          <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
            404
          </p>
          <h1 className="font-heading text-4xl font-light text-[hsl(var(--foreground))]">
            Product not found.
          </h1>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            This piece may have sold out or left the store.
          </p>
          <Link
            to="/store"
            className="btn-ghost mt-8 inline-flex rounded-sm px-6 py-3 font-mono-tech text-xs uppercase tracking-[0.25em]"
          >
            Back to the store
          </Link>
        </main>
      </div>
    );
  }

  const p = state.product;
  const images = [p.img, p.alt].filter(Boolean);
  const shown = images[Math.min(imgIndex, images.length - 1)] || null;
  const variant = p.variants?.find((v) => v.id === variantId) || null;
  const allSoldOut =
    p.variants && p.variants.length > 0
      ? p.variants.every((v) => v.soldOut)
      : p.soldOut;
  const price = variant ? variant.price : p.price;
  const currency = variant ? variant.currency : p.currency;

  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1400px] px-6 pb-24 pt-28 md:px-10 md:pt-36">
        <Link
          to="/store"
          className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]"
        >
          &larr; Back to the store
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              {shown && (
                <Image
                  src={shown}
                  alt={`${p.name} — Mazrood.`}
                  fittingType="fill"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`h-16 w-14 overflow-hidden rounded-sm border transition ${
                      i === imgIndex
                        ? "border-[hsl(var(--primary))]"
                        : "border-[hsl(var(--border))] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fittingType="fill" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
              Mazrood Studio
            </p>
            <h1 className="mt-4 font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-5xl">
              {p.name}
            </h1>

            <p className="mt-5 flex items-baseline gap-3">
              <span className="font-mono-tech text-xl text-[hsl(var(--primary))]">
                {formatPrice(price, currency)}
              </span>
              {p.was != null && (
                <s className="font-mono-tech text-sm text-[hsl(var(--muted-foreground))]">
                  {formatPrice(p.was, p.currency)}
                </s>
              )}
            </p>

            {p.description && (
              <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-75">
                {p.description}
              </p>
            )}

            {p.variants && p.variants.length > 1 && (
              <div className="mt-8">
                <p className="font-mono-tech mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                  Option
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={v.soldOut}
                      onClick={() => setVariantId(v.id)}
                      className={`rounded-sm border px-4 py-2.5 font-mono-tech text-xs uppercase tracking-[0.2em] transition ${
                        v.id === variantId
                          ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                          : "border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
                      } ${v.soldOut ? "cursor-not-allowed line-through opacity-40" : ""}`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              {allSoldOut ? (
                <span className="inline-flex rounded-sm border border-[hsl(var(--border))] px-6 py-3.5 font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                  Sold out
                </span>
              ) : (
                <button
                  type="button"
                  onClick={startCheckout}
                  disabled={busy || !variantId}
                  className="btn-solid rounded-sm px-8 py-4 font-mono-tech text-xs uppercase tracking-[0.25em] disabled:opacity-50"
                >
                  {busy ? "Starting checkout…" : "Checkout"}
                </button>
              )}
              {checkoutError && (
                <p className="mt-4 text-sm text-[hsl(var(--destructive))]">
                  {checkoutError}
                </p>
              )}
              <p className="mt-4 font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                Secure checkout on Shopify
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className="h-20 md:hidden" />
      <BottomTabs />
    </div>
  );
}