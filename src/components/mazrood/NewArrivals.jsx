import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import useShopifyProducts, { formatPrice } from "@/hooks/useShopifyProducts";

const CAPS = [
  {
    name: "No Wasted Potential Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06380Large_700x.jpg?v=1787984186",
    url: "https://mazrood.com/products/no-wasted-potential-cap",
  },
  {
    name: "mzrd Bubble Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06373Large_700x.jpg?v=1787983760",
    url: "https://mazrood.com/products/mzrd-bubble-cap",
  },
  {
    name: "mzrd Lowercase Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06367Large_700x.jpg?v=1787983389",
    url: "https://mazrood.com/products/mzrd-lowercase-cap",
  },
  {
    name: "Peacemaker Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06361Large_700x.jpg?v=1787983290",
    url: "https://mazrood.com/products/peacemaker-cap",
  },
  {
    name: "Hotel MZRD Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06354Large_700x.jpg?v=1787983188",
    url: "https://mazrood.com/products/hotel-mzrd-cap",
  },
  {
    name: "Road to Mazrood Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06346Large_700x.jpg?v=1787983110",
    url: "https://mazrood.com/products/road-to-mazrood-cap",
  },
  {
    name: "Warning: Closet Envy Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06338Large_700x.jpg?v=1787982586",
    url: "https://mazrood.com/products/warning-closet-envy-cap",
  },
  {
    name: "MZ Varsity Cap",
    img: "https://mazrood.com/cdn/shop/files/DSC06332Large_700x.jpg?v=1787982424",
    url: "https://mazrood.com/products/mz-varsity-cap",
  },
];

export default function NewArrivals() {
  const caps = useShopifyProducts(CAPS);

  return (
    <section id="new" aria-labelledby="new-heading" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
              02 — New Arrivals
            </p>
            <h2
              id="new-heading"
              className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-white md:text-6xl"
            >
              SS26, fresh <span className="font-bold">from the studio.</span>
            </h2>
          </div>
          <a
            href="https://mazrood.com/collections/new-2026"
            className="group inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--foreground))] opacity-70 transition hover:opacity-100 hover:text-[hsl(var(--primary))]"
          >
            View All
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {caps.map((c) => (
            <a key={c.name} href={c.url} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <Image
                  src={c.img}
                  alt={`${c.name} — Mazrood headwear.`}
                  fittingType="fill"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15" />
                {c.soldOut && (
                  <span className="absolute right-3 top-3 rounded-sm bg-[hsl(var(--destructive))] px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--destructive-foreground))]">
                    Sold out
                  </span>
                )}
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] opacity-0 transition duration-500 group-hover:opacity-100">
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <p className="mt-4 font-body text-sm font-medium text-white">{c.name}</p>
              <p className="font-mono-tech mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                {formatPrice(c.price ?? 34.78, c.currency)}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}