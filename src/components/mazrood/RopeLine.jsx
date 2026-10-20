import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import useShopifyProducts, { productPath } from "@/hooks/useShopifyProducts";
import { FEATURED_PIECES } from "@/lib/featuredPieces";

// Sailor-yellow rope drawn as one sagging curve (viewBox 0 0 100 100,
// stretched to the section width). Products hang from it on clothespins —
// an in-flow band between sections, so the rope never sits on top of the photos.
const ROPE_PATH = "M 0 18 C 25 62 75 62 100 18";
const ROPE_BAND = 132; // vertical px the rope sags into

const pointAt = (t) => {
  const u = 1 - t;
  return {
    x: 3 * u * u * t * 25 + 3 * u * t * t * 75 + t * t * t * 100,
    y: u * u * u * 18 + 3 * u * u * t * 62 + 3 * u * t * t * 62 + t * t * t * 18,
  };
};

const HANGING = FEATURED_PIECES;

export default function RopeLine({ refreshKey = 0 }) {
  const live = useShopifyProducts(HANGING, refreshKey);

  const items = live.map((item) => {
    const p = pointAt(item.t);
    return {
      ...item,
      x: p.x,
      ropeY: (p.y / 100) * ROPE_BAND,
      top: ROPE_BAND + item.drop,
    };
  });

  return (
    <section
      aria-label="Mazrood products hung on the studio line"
      className="relative w-full overflow-hidden py-12 md:py-20"
    >
      <p className="font-mono-tech mb-12 px-6 text-center text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
        01 — Fresh off the line
      </p>

      <div className="relative h-[280px] md:h-[400px]">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute left-0 top-0 h-[132px] w-full"
        >
          <path
            d={ROPE_PATH}
            fill="none"
            stroke="#D9A83C"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={ROPE_PATH}
            fill="none"
            stroke="#8A641B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="6 9"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {items.map((item) => (
          <div key={item.name} className="absolute inset-y-0" style={{ left: `${item.x}%` }}>
            <span
              aria-hidden="true"
              className="absolute left-0 w-[2px] -translate-x-1/2 bg-[#D9A83C]"
              style={{ top: `${item.ropeY}px`, height: `${item.top - item.ropeY}px` }}
            />
            <span
              aria-hidden="true"
              className="absolute left-0 h-4 w-2.5 -translate-x-1/2 rounded-[2px] border border-[#8A641B] bg-[#B08748]"
              style={{ top: `${item.ropeY - 6}px` }}
            />
            <Link
              to={productPath(item.url)}
              aria-label={`${item.name} — view product`}
              className="group absolute left-0 block w-[24vw] max-w-[200px] -translate-x-1/2"
              style={{ top: `${item.top}px` }}
            >
              <div className="origin-top transition-transform duration-500 ease-out group-hover:rotate-[2deg]">
                <div className="aspect-square overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  <Image src={item.img} alt="" fittingType="fill" className="h-full w-full object-cover" />
                </div>
                {item.soldOut && (
                  <span className="absolute right-2 top-2 rounded-sm bg-[hsl(var(--destructive))] px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--destructive-foreground))]">
                    Sold out
                  </span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}