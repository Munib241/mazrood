import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/hooks/useShopifyProducts";

// "Complete the look" — the product's hand-picked matching pieces
// (Shopify's custom.pairs_with metafield) or the store's latest stand-ins.
export default function RelatedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="mt-20 md:mt-28">
      <p className="font-mono-tech text-[0.65rem] uppercase tracking-[0.4em] text-[hsl(var(--muted-foreground))]">
        Matching Sets &amp; Outfits
      </p>
      <h2 className="mt-3 font-heading text-3xl font-light tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-4xl">
        Complete the <span className="font-bold">look.</span>
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {products.map((p) => (
          <Link key={p.handle} to={`/product/${p.handle}`} className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <Image
                src={p.img}
                alt={`${p.name} — Mazrood.`}
                fittingType="fill"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {p.soldOut && (
                <span className="absolute right-3 top-3 rounded-sm bg-[hsl(var(--destructive))] px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--destructive-foreground))]">
                  Sold out
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
    </section>
  );
}