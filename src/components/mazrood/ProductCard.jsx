import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatPrice } from "@/hooks/useShopifyProducts";
import { FEATURED_HANDLES } from "@/lib/featuredPieces";
import FadeImage from "@/components/mazrood/FadeImage";

// Kith-style grid card: square photo on a flat surface, hover crossfades to
// the alternate product shot, and name / color / price stack below the image.
export default function ProductCard({ p }) {
  const hoverImg = (p.images || []).find((im) => im && im !== p.img) || null;
  const color = (p.variants || [])
    .flatMap((v) => v.options || [])
    .find((o) => o.name?.toLowerCase() === "color")?.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Link to={`/product/${p.handle}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span
            className={`absolute inset-0 block transition-opacity duration-500 ease-out ${
              hoverImg ? "group-hover:opacity-0" : ""
            }`}
          >
            <FadeImage
              src={p.img}
              alt={`${p.name} — Mazrood store.`}
              className="h-full w-full object-cover"
            />
          </span>
          {hoverImg && (
            <span className="absolute inset-0 block opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
              <FadeImage
                src={hoverImg}
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
          )}
          {p.soldOut && (
            <span className="absolute right-3 top-3 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              Sold out
            </span>
          )}
          {!p.soldOut && FEATURED_HANDLES.includes(p.handle) && (
            <span className="absolute right-3 top-3 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
              Featured
            </span>
          )}
          {p.was != null && !p.soldOut && (
            <span className="absolute left-3 top-3 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              Final Piece
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="font-body text-sm font-medium text-[hsl(var(--foreground))]">
            {p.name}
          </p>
          {color && (
            <p className="font-body mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
              Color: {color}
            </p>
          )}
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
        </div>
      </Link>
    </motion.div>
  );
}