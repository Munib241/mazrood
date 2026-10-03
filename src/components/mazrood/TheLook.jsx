import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const LOOKS = [
  {
    img: "https://mazrood.com/cdn/shop/files/hf_20260910_031025_090974fc-de3a-4f1f-8d7c-390c503c81bb_900x.png?v=1789011867",
    tag: "SS26 — Men",
    title: "Mzrd Tencel Shirt",
    copy: "A relaxed, breathable staple cut from Tencel — studio-tailored for the warmer months.",
    cta: "Shop the Look",
    url: "https://mazrood.com/products/mazrood-tencel-shirt-style-a",
  },
  {
    img: "https://mazrood.com/cdn/shop/files/hf_20260713_061932_98e8898a-4db8-469c-8f87-77a7f2565886_900x.png?v=1789013026",
    tag: "SS26 — Limited Edition",
    title: "Riviera Bouclé Holdall",
    copy: "A bouclé holdall finished for weekends away — numbered, limited run, gone when it's gone.",
    cta: "Limited Edition",
    url: "https://mazrood.com/products/mazrood-riviera-boucle-holdall-limited-edition",
  },
];

export default function TheLook() {
  return (
    <section id="look" aria-labelledby="look-heading" className="relative border-t border-[hsl(var(--border))] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16">
          <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
            03 — The Look
          </p>
          <h2 id="look-heading" className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl">
            Worn well. <span className="font-bold">Shot on location.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-20 md:gap-28">
          {LOOKS.map((l, i) => (
            <div key={l.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <div className={`relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] ${i % 2 ? "md:order-2" : ""}`}>
                <Image
                  src={l.img}
                  alt={`${l.title} — Mazrood studio look.`}
                  fittingType="fill"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className={i % 2 ? "md:order-1 md:text-right" : ""}>
                <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.35em] text-[hsl(var(--primary))]">
                  {l.tag}
                </p>
                <h3 className="mt-4 font-heading text-3xl font-medium tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-5xl">
                  {l.title}
                </h3>
                <p className={`mt-5 max-w-md font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-75 ${i % 2 ? "md:ml-auto" : ""}`}>
                  {l.copy}
                </p>
                <a
                  href={l.url}
                  className={`btn-ghost mt-8 inline-flex items-center gap-3 rounded-sm px-6 py-3.5 font-mono-tech text-xs uppercase tracking-[0.25em]`}
                >
                  {l.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}