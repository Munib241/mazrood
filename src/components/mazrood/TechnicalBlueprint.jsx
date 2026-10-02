import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Image } from "@/components/ui/image";

const BLUEPRINT_IMG = "https://media.base44.com/images/public/6abfc987ea748e49e7475c82/2b1b87fd6_generated_ab65cf85.png";

const LAYERS = [
  {
    code: "L01",
    title: "Thermal Core",
    body: "A passive aluminum cooling lattice dissipates heat away from the emitter, preserving chromatic stability across a 50,000-hour service life without forced airflow.",
  },
  {
    code: "L02",
    title: "Photon Array",
    body: "A calibrated LED matrix tuned to a continuous 2700–6500 K range. Each diode is binned to a two-step MacAdam ellipse for imperceptible color drift across installations.",
  },
  {
    code: "L03",
    title: "Optical Casing",
    body: "Hand-finished glass and brushed zinc housings refract the beam into architectural geometries — the fixture disappears, leaving only the light it draws.",
  },
  {
    code: "L04",
    title: "Structural Mount",
    body: "Concealed stainless anchors integrate with the host surface. Every commission is surveyed on-site so the instrument reads as a seam in the architecture, not an addition.",
  },
];

export default function TechnicalBlueprint() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 14]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.06, 1.02]);

  return (
    <section id="process" className="relative border-t border-[hsl(var(--border))] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16">
          <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
            03 — Technical Blueprint
          </p>
          <h2 className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-white md:text-6xl">
            The engineering <span className="font-bold">behind the beauty.</span>
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          {/* sticky diagram */}
          <div className="md:sticky md:top-32 md:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <motion.div style={{ rotate, scale }} className="absolute inset-0">
                <Image
                  src={BLUEPRINT_IMG}
                  alt="Exploded isometric diagram of a Mazrood light fixture, showing its layered engineering components."
                  fittingType="fill"
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="pointer-events-none absolute left-5 top-5 font-mono-tech text-[0.6rem] uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                Fig. 01 / Exploded View
              </div>
              <div className="pointer-events-none absolute bottom-5 right-5 font-mono-tech text-[0.6rem] uppercase tracking-[0.3em] text-[hsl(var(--foreground))] opacity-60">
                Scale 1:4
              </div>
            </div>
          </div>

          {/* scrollable layers */}
          <div className="flex flex-col">
            {LAYERS.map((l, i) => (
              <div
                key={l.code}
                className="border-t border-[hsl(var(--border))] py-10 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono-tech text-[0.7rem] uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
                    {l.code}
                  </span>
                  <h3 className="font-heading text-2xl font-medium tracking-[-0.01em] text-white md:text-3xl">
                    {l.title}
                  </h3>
                </div>
                <p className="mt-4 max-w-md font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-75 md:ml-[3.6rem]">
                  {l.body}
                </p>
                {i === LAYERS.length - 1 && (
                  <p className="mt-6 font-mono-tech text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] md:ml-[3.6rem]">
                    End of survey — return to gallery ↑
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}