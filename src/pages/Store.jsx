import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { categoryLabel } from "@/lib/shopMenu";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import Nav from "@/components/mazrood/Nav";
import BottomTabs from "@/components/mazrood/BottomTabs";
import { formatPrice } from "@/hooks/useShopifyProducts";

export default function Store() {
  const { collection = "all" } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const [state, setState] = useState({ loading: true, products: [], error: false });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, products: [], error: false });
    // One retry: a transient storefront failure used to leave the grid
    // permanently empty until another navigation.
    const load = (attempt = 0) => {
      base44.functions
        // "all" isn't a Shopify collection — the shop's latest products load instead.
        .invoke("shopify_products", collection === "all" ? {} : { collection, type })
        .then((res) => {
          if (cancelled) return;
          if (res?.data?.error && attempt < 1) {
            window.setTimeout(() => !cancelled && load(attempt + 1), 1500);
            return;
          }
          const live = Array.isArray(res?.data?.products) ? res.data.products : [];
          setState({ loading: false, products: live, error: live.length === 0, title: res?.data?.title ?? null });
        })
        .catch(() => {
          if (cancelled) return;
          if (attempt < 1) {
            window.setTimeout(() => !cancelled && load(attempt + 1), 1500);
            return;
          }
          setState({ loading: false, products: [], error: true });
        });
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [collection, type]);

  const label = [state.title || "Store", categoryLabel(collection, type)]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1600px] px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
          Store
        </p>
        <h1 className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl">
          {label} <span className="font-bold">collection.</span>
        </h1>

        {state.loading ? (
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-sm bg-[hsl(var(--secondary))]" />
                <div className="mt-4 h-4 w-2/3 rounded-sm bg-[hsl(var(--secondary))]" />
                <div className="mt-2 h-3 w-1/3 rounded-sm bg-[hsl(var(--secondary))]" />
              </div>
            ))}
          </div>
        ) : state.error || state.products.length === 0 ? (
          <div className="mt-14 border border-[hsl(var(--border))] px-6 py-16 text-center">
            <p className="font-heading text-xl text-[hsl(var(--foreground))]">
              Nothing here yet.
            </p>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              This collection is empty or the store couldn't be reached. Browse
              another collection from the menu.
            </p>
            <Link
              to="/store"
              className="btn-ghost mt-6 inline-flex rounded-sm px-5 py-2.5 font-mono-tech text-xs uppercase tracking-[0.2em]"
            >
              View all
            </Link>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {state.products.map((p) => (
              <Link key={p.handle} to={`/product/${p.handle}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  <Image
                    src={p.img}
                    alt={`${p.name} — Mazrood store.`}
                    fittingType="fill"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15" />
                  {p.soldOut && (
                    <span className="absolute right-3 top-3 rounded-sm bg-[hsl(var(--destructive))] px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--destructive-foreground))]">
                      Sold out
                    </span>
                  )}
                  {p.was != null && !p.soldOut && (
                    <span className="absolute left-3 top-3 rounded-sm bg-[hsl(var(--background))] px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
                      Sale
                    </span>
                  )}
                </div>
                <p className="mt-4 font-body text-sm font-medium text-[hsl(var(--foreground))]">
                  {p.name}
                </p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono-tech text-sm text-[hsl(var(--primary))]">
                    {formatPrice(p.price, p.currency)}
                  </span>
                  {p.was != null && (
                    <s className="font-mono-tech text-xs text-[hsl(var(--muted-foreground))]">
                      {formatPrice(p.was, p.currency)}
                    </s>
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <div className="h-20 md:hidden" />
      <BottomTabs />
    </div>
  );
}