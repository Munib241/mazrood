import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatPrice } from "@/hooks/useShopifyProducts";
import { FEATURED_HANDLES } from "@/lib/featuredPieces";
import FadeImage from "@/components/mazrood/FadeImage";

// One collection-grid card. It settles in with a soft rise when the page
// or a lazily-loaded batch arrives, and its photo fades up once loaded.
export default function ProductCard({ p }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Link to={`/product/${p.handle}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <FadeImage
            src={p.img}
            alt={`${p.name} — Mazrood store.`}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15" />
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
    </motion.div>
  );
}