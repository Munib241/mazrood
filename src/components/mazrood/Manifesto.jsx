const PRINCIPLES = [
  {
    n: "01",
    title: "Cut with intent",
    copy: "Every pattern starts as a question: what does this garment need to do — and nothing more. We strip until only the essential remains.",
  },
  {
    n: "02",
    title: "Built to outlast",
    copy: "Seasons pass; the pieces stay. We choose fabrics and construction that age into character rather than out of relevance.",
  },
  {
    n: "03",
    title: "Made in the studio",
    copy: "Nothing leaves the studio until we would wear it ourselves. Small runs, considered details, no shortcuts.",
  },
];

export default function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-heading" className="relative border-t border-[hsl(var(--border))] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
              03 — Studio Manifesto
            </p>
            <h2
              id="manifesto-heading"
              className="font-heading text-4xl font-light leading-[1.05] tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl"
            >
              We don't chase
              <br />
              <span className="font-bold italic">trends.</span> We build
              <br />
              standards.
            </h2>
            <p className="mt-8 max-w-md font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-75 md:text-lg">
              Mazrood is a studio before it is a label. We design quietly,
              produce slowly, and release only what we believe belongs in the
              wardrobe for years — not weeks.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="grid gap-2 py-8 md:grid-cols-[64px_220px_1fr] md:items-baseline md:gap-10 md:py-10">
                <span className="font-mono-tech text-[0.7rem] tracking-[0.3em] text-[hsl(var(--primary))]">
                  {p.n}
                </span>
                <h3 className="font-heading text-xl font-medium leading-[1.2] tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-2xl">
                  {p.title}
                </h3>
                <p className="max-w-md font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-75 md:text-base">
                  {p.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}