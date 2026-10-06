import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import useShopifyProducts, { formatPrice } from "@/hooks/useShopifyProducts";

const SALE = [
  {
    name: "Mazrood Essential Logo Hoodie",
    price: 78.84,
    was: 98.55,
    url: "https://mazrood.com/products/mazrood-essential-logo-hoodie",
    img: "https://mazrood.com/cdn/shop/files/MZ-28_1_2048x.jpg?v=1780383193",
    alt: "https://mazrood.com/cdn/shop/files/MZ-28_2_900x.jpg?v=1780383222",
  },
  {
    name: "Mazrood Essential Cotton Shorts",
    price: 52.87,
    was: 66.09,
    url: "https://mazrood.com/products/mazrood-essential-cotton-shorts",
    img: "https://mazrood.com/cdn/shop/files/DSC03539_2048x.jpg?v=1780382885",
    alt: "https://mazrood.com/cdn/shop/files/DSC03543_900x.jpg?v=1780382900",
  },
  {
    name: "Mazrood Studio Leather Jacket",
    price: 139.13,
    was: 173.91,
    url: "https://mazrood.com/products/mazrood-studio-leather-jacket",
    img: "https://mazrood.com/cdn/shop/files/MZ-31_1_Large_255fd4c7-3d23-4c41-a002-3ace3b9c61fd_900x.jpg?v=1780380377",
    alt: null,
  },
  {
    name: "Mazrood Diner Hoodie",
    price: 83.48,
    was: 104.35,
    url: "https://mazrood.com/products/mazrood-diner-hoodie",
    img: "https://mazrood.com/cdn/shop/files/MZ-27_1_900x.jpg?v=1780383212",
    alt: "https://mazrood.com/cdn/shop/files/Diner_Hoodie_2_900x.jpg?v=1780383236",
  },
  {
    name: "VEIL ZIP HOOD",
    price: 41.74,
    was: 52.17,
    url: "https://mazrood.com/products/veil-zip-hood",
    img: "https://mazrood.com/cdn/shop/files/89A33AB2-F35B-41BA-B9B3-3D4D78560575_900x.jpg?v=1780381608",
    alt: "https://mazrood.com/cdn/shop/files/IMG_2464Large_900x.jpg?v=1775229228",
  },
  {
    name: "LUNE SWEATER",
    price: 69.57,
    was: 86.96,
    url: "https://mazrood.com/products/lune-sweater",
    img: "https://mazrood.com/cdn/shop/files/MZ-32_5_900x.jpg?v=1786912349",
    alt: "https://mazrood.com/cdn/shop/files/MZ-32_6_900x.jpg?v=1786912363",
  },
  {
    name: "Hooded Puffer Jacket",
    price: 121.74,
    was: 173.91,
    url: "https://mazrood.com/products/hooded-puffer-jacket",
    img: "https://mazrood.com/cdn/shop/files/p-6pz9Yj-DSC07499Large_900x.jpg?v=1780378339",
    alt: "https://mazrood.com/cdn/shop/files/p-JOeLds-DSC07502Large_900x.jpg?v=1780378339",
  },
  {
    name: "Comfy Wool Pants",
    price: 74.2,
    was: 92.75,
    url: "https://mazrood.com/products/comfy-wool-pants",
    img: "https://mazrood.com/cdn/shop/files/MZ-8_7_Large_02336844-deec-450e-ae8e-cd8391db4133_900x.jpg?v=1786910887",
    alt: null,
  },
];

export default function Sale({ refreshKey = 0 }) {
  const sale = useShopifyProducts(SALE, refreshKey);

  return (
    <section id="sale" aria-labelledby="sale-heading" className="relative border-t border-[hsl(var(--border))] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
              05 — Sale
            </p>
            <h2 id="sale-heading" className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl">
              End of season <span className="font-bold">markdowns.</span>
            </h2>
          </div>
          <a
            href="https://mazrood.com/collections/fw25-26"
            className="group inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--foreground))] opacity-70 transition hover:opacity-100 hover:text-[hsl(var(--primary))]"
          >
            View All
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {sale.map((p) => (
            <a key={p.name} href={p.url} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className={`absolute inset-0 ${p.alt ? "transition-opacity duration-500 group-hover:opacity-0" : ""}`}>
                  <Image
                    src={p.img}
                    alt={`${p.name} — Mazrood sale.`}
                    fittingType="fill"
                    className="h-full w-full object-cover"
                  />
                </div>
                {p.alt && (
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <Image
                      src={p.alt}
                      alt=""
                      fittingType="fill"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-sm bg-[hsl(var(--background))] px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
                  Sale
                </span>
                {p.soldOut && (
                  <span className="absolute right-3 top-3 rounded-sm bg-[hsl(var(--destructive))] px-2 py-1 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--destructive-foreground))]">
                    Sold out
                  </span>
                )}
              </div>
              <p className="mt-4 font-body text-sm font-medium text-[hsl(var(--foreground))]">{p.name}</p>
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}