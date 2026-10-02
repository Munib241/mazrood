import { Image } from "@/components/ui/image";

const ARTIFACTS = [
  {
    src: "https://media.base44.com/images/public/6abfc987ea748e49e7475c82/1f9e15940_generated_ec93f495.png",
    title: "Meridian 01",
    lux: "2,400 lx",
    kelvin: "2700 K",
    material: "Cast Concrete",
    span: "w-[78vw] md:w-[42vw]",
    height: "h-[60vh]",
  },
  {
    src: "https://media.base44.com/images/public/6abfc987ea748e49e7475c82/25f39113b_generated_cee1880f.png",
    title: "Filament Array",
    lux: "8,900 lx",
    kelvin: "6500 K",
    material: "Brushed Zinc",
    span: "w-[70vw] md:w-[32vw]",
    height: "h-[72vh]",
  },
  {
    src: "https://media.base44.com/images/public/6abfc987ea748e49e7475c82/6d13f1d95_generated_cf2d4678.png",
    title: "Pavilion Dusk",
    lux: "1,150 lx",
    kelvin: "3200 K",
    material: "Architectural Glass",
    span: "w-[85vw] md:w-[50vw]",
    height: "h-[58vh]",
  },
  {
    src: "https://media.base44.com/images/public/6abfc987ea748e49e7475c82/b48aa7060_generated_0ba212be.png",
    title: "Refraction Study",
    lux: "3,600 lx",
    kelvin: "4500 K",
    material: "Frosted Glass",
    span: "w-[72vw] md:w-[36vw]",
    height: "h-[66vh]",
  },
];

export default function LumenGallery() {
  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="relative py-28 md:py-40">
      <div className="mx-auto mb-14 flex max-w-[1600px] items-end justify-between px-6 md:px-10">
        <div>
          <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
            02 — Lumen Gallery
          </p>
          <h2
            id="gallery-heading"
            className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-white md:text-6xl"
          >
            Artifacts of light,
            <br />
            <span className="font-bold">engineered as architecture.</span>
          </h2>
        </div>
        <p className="hidden max-w-xs font-body text-sm leading-relaxed text-[hsl(var(--muted-foreground))] md:block">
          A horizontal survey of recent commissions. Scroll laterally to inspect
          each instrument's luminance, temperature, and material signature.
        </p>
      </div>

      <div className="hide-scrollbar flex gap-6 overflow-x-auto px-6 pb-6 md:gap-10 md:px-10">
        {ARTIFACTS.map((a) => (
          <figure
            key={a.title}
            className={`group relative ${a.span} ${a.height} shrink-0 overflow-hidden rounded-sm border border-[hsl(var(--border))]`}
          >
            <Image
              src={a.src}
              alt={`${a.title} — an architectural light artifact.`}
              fittingType="fill"
              className="h-full w-full object-cover grayscale-0 transition-all duration-700 ease-out group-hover:grayscale group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="font-mono-tech text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                {a.title}
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-3 font-mono-tech text-[0.65rem] uppercase tracking-[0.15em] text-[hsl(var(--foreground))]">
                <div>
                  <dt className="opacity-50">Lux</dt>
                  <dd className="mt-1 text-white">{a.lux}</dd>
                </div>
                <div>
                  <dt className="opacity-50">Kelvin</dt>
                  <dd className="mt-1 text-white">{a.kelvin}</dd>
                </div>
                <div>
                  <dt className="opacity-50">Material</dt>
                  <dd className="mt-1 text-white">{a.material}</dd>
                </div>
              </dl>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="font-mono-tech mt-6 px-6 text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] md:px-10">
        ← Scroll horizontally to survey the collection →
      </p>
    </section>
  );
}