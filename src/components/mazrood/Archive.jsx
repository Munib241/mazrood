import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/hooks/useShopifyProducts";

const COLLECTION = "fw25-26";

// "The Archive" — final pieces from last season's studio collection, live
// from the sale collection. Presented as an archive, never as a sale:
// muted "Final Piece" tags, crossed-out original prices, no discount badges.
export default function Archive({ refreshKey = 0 }) {
  const [state, setState] = useState({ loading: true, products: [] });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    base44.functions
      .invoke("shopify_products", { collection: COLLECTION })
      .then((res) => {
        if (cancelled) return;
        const live = Array.isArray(res?.data?.products) ? res.data.products : [];
        setState({ loading: false, products: live });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, products: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section id="archive" aria-labelledby="archive-heading" className="relative border-t border-[hsl(var(--border))] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
              02 — The Archive
            </p>
            <h2 id="archive-heading" className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl">
              Final pieces, <span className="font-bold italic">quietly reduced.</span>
            </h2>
          </div>
          <Link
            to={`/store/${COLLECTION}`}
            className="group inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--foreground))] opacity-70 transition hover:opacity-100 hover:text-[hsl(var(--primary))]"
          >
            View the Archive
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {state.loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-sm bg-[hsl(var(--secondary))]" />
                <div className="mt-4 h-4 w-2/3 rounded-sm bg-[hsl(var(--secondary))]" />
                <div className="mt-2 h-3 w-1/3 rounded-sm bg-[hsl(var(--secondary))]" />
              </div>
            ))
          ) : state.products.length === 0 ? (
            <p className="col-span-2 border border-[hsl(var(--border))] px-6 py-14 text-center font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] md:col-span-4">
              The Archive is being restocked.
            </p>
          ) : (
            state.products.map((p) => (
              <Link key={p.handle} to={`/product/${p.handle}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  <Image
                    src={p.img}
                    alt={`${p.name} — Mazrood Archive.`}
                    fittingType="fill"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15" />
                  {p.was != null && !p.soldOut && (
                    <span className="absolute left-3 top-3 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                      Final Piece
                    </span>
                  )}
                  {p.soldOut && (
                    <span className="absolute right-3 top-3 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                      Sold out
                    </span>
                  )}
                </div>
                <p className="mt-4 font-body text-sm font-medium text-[hsl(var(--foreground))]">{p.name}</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono-tech text-sm text-[hsl(var(--foreground))]">
                    {formatPrice(p.price, p.currency)}
                  </span>
                  {p.was != null && (
                    <s className="font-mono-tech text-xs text-[hsl(var(--muted-foreground))]">
                      {formatPrice(p.was, p.currency)}
                    </s>
                  )}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}