import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import Nav from "@/components/mazrood/Nav";
import BottomTabs from "@/components/mazrood/BottomTabs";
import { formatPrice } from "@/hooks/useShopifyProducts";
import { addToCart as addItemToCart } from "@/lib/cart";

export default function Product() {
  const { handle } = useParams();
  const [state, setState] = useState({ loading: true, product: null, error: false });
  const [selections, setSelections] = useState({});
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, product: null, error: false });
    setSelections({});
    setQty(1);
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
        if (first?.options?.length) {
          setSelections(
            Object.fromEntries(first.options.map((o) => [o.name, o.value]))
          );
        }
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
      const res = await base44.functions.invoke("shopify_checkout", {
        variantId: variant?.id,
        quantity: qty,
      });
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

  const handleAddToCart = () => {
    if (!variant?.id || allSoldOut || variant?.soldOut) return;
    addItemToCart({
      variantId: variant.id,
      handle: p.handle,
      name: p.name,
      price: variant.price,
      currency,
      image: variant.image || p.img,
      options: (variant.options || []).map((o) => o.value).join(" / "),
      qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
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
  const variants = p.variants || [];
  const optionNames = [];
  variants.forEach((v) =>
    (v.options || []).forEach((o) => {
      if (!optionNames.includes(o.name)) optionNames.push(o.name);
    })
  );
  const valuesFor = (name) => {
    const seen = new Set();
    return variants
      .flatMap((v) => v.options || [])
      .filter((o) => o.name === name && !seen.has(o.value) && seen.add(o.value))
      .map((o) => o.value);
  };
  const valueAvailable = (name, value) =>
    variants.some(
      (v) =>
        !v.soldOut &&
        (v.options || []).some((o) => o.name === name && o.value === value)
    );
  const findVariant = (sel) =>
    variants.find((v) => (v.options || []).every((o) => sel[o.name] === o.value)) ||
    null;
  const variant =
    findVariant(selections) || variants.find((v) => !v.soldOut) || variants[0] || null;
  const allSoldOut =
    p.variants && p.variants.length > 0
      ? p.variants.every((v) => v.soldOut)
      : p.soldOut;
  const price = variant ? variant.price : p.price;
  const currency = variant ? variant.currency : p.currency;

  // The selected variant's own photo leads the gallery; the product's full
  // image set follows, deduped. Declared after `variant` so a size/color
  // switch instantly shows that variant's photo first.
  const images = Array.from(
    new Set(
      [variant?.image, ...(p.images?.length ? p.images : [p.img, p.alt].filter(Boolean))].filter(
        Boolean
      )
    )
  );
  const shown = images[Math.min(imgIndex, images.length - 1)] || null;

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

            {allSoldOut ? (
              <p className="font-mono-tech mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                Currently sold out
              </p>
            ) : variant?.soldOut ? (
              <p className="font-mono-tech mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                Sold out in this combination
              </p>
            ) : (
              <p className="font-mono-tech mt-4 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                In stock
              </p>
            )}

            {p.description && (
              <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-75">
                {p.description}
              </p>
            )}

            {optionNames.length > 0 && variants.length > 1 && (
              <div className="mt-8 space-y-6">
                {optionNames.map((name) => {
                  const isColor = name.toLowerCase() === "color";
                  // A color swatch shows the fabric photo of that color's first variant.
                  const swatchFor = (value) =>
                    (
                      variants.find(
                        (v) =>
                          !v.soldOut &&
                          v.image &&
                          (v.options || []).some(
                            (o) => o.name === name && o.value === value
                          )
                      ) ||
                      variants.find(
                        (v) =>
                          v.image &&
                          (v.options || []).some(
                            (o) => o.name === name && o.value === value
                          )
                      )
                    )?.image || null;
                  return (
                    <div key={name}>
                      <p className="font-mono-tech mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                        {name}
                        {isColor && selections[name] && (
                          <span className="ml-2 normal-case tracking-[0.1em] text-[hsl(var(--foreground))]">
                            {selections[name]}
                          </span>
                        )}
                      </p>
                      <div className={isColor ? "flex flex-wrap items-center gap-3" : "flex flex-wrap gap-2"}>
                        {valuesFor(name).map((value) => {
                          const available = valueAvailable(name, value);
                          const selected = selections[name] === value;
                          const swatch = isColor ? swatchFor(value) : null;
                          return (
                            <button
                              key={value}
                              type="button"
                              disabled={!available}
                              title={value}
                              aria-label={`${name}: ${value}`}
                              onClick={() => {
                                setImgIndex(0);
                                setSelections((s) => ({ ...s, [name]: value }));
                              }}
                              className={
                                isColor
                                  ? `h-10 w-10 overflow-hidden rounded-full border transition ${
                                      selected
                                        ? "border-[hsl(var(--foreground))] shadow-[0_0_0_2px_hsl(var(--background)),0_0_0_3.5px_hsl(var(--primary))]"
                                        : "border-[hsl(var(--border))]"
                                    } ${!available ? "cursor-not-allowed opacity-30" : "hover:opacity-80"}`
                                  : `rounded-sm border px-4 py-2.5 font-mono-tech text-xs uppercase tracking-[0.2em] transition ${
                                      selected
                                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                                        : "border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
                                    } ${!available ? "cursor-not-allowed line-through opacity-40" : ""}`
                              }
                            >
                              {swatch ? (
                                <img
                                  src={swatch}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : isColor ? (
                                <span className="font-mono-tech text-[0.6rem]">{value.slice(0, 2)}</span>
                              ) : (
                                value
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!allSoldOut && !variant?.soldOut && (
              <div className="mt-8">
                <p className="font-mono-tech mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-[hsl(var(--border))]">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="px-4 py-2.5 font-mono-tech text-base text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--primary))] disabled:opacity-30"
                  >
                    &minus;
                  </button>
                  <span
                    aria-live="polite"
                    className="font-mono-tech w-12 text-center text-sm text-[hsl(var(--foreground))]"
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    disabled={qty >= 10}
                    aria-label="Increase quantity"
                    className="px-4 py-2.5 font-mono-tech text-base text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--primary))] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10">
              {allSoldOut || variant?.soldOut ? (
                <span className="inline-flex rounded-sm border border-[hsl(var(--border))] px-6 py-3.5 font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                  Sold out
                </span>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!variant?.id}
                    className="btn-ghost rounded-sm px-8 py-4 font-mono-tech text-xs uppercase tracking-[0.25em] disabled:opacity-50"
                  >
                    {added ? "Added ✓" : "Add to cart"}
                  </button>
                  <button
                    type="button"
                    onClick={startCheckout}
                    disabled={busy || !variant?.id}
                    className="btn-solid rounded-sm px-8 py-4 font-mono-tech text-xs uppercase tracking-[0.25em] disabled:opacity-50"
                  >
                    {busy ? "Starting checkout…" : "Checkout"}
                  </button>
                </div>
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