import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Image } from "@/components/ui/image";

const HERO_IMG = "https://media.base44.com/images/public/6abfc987ea748e49e7475c82/28520627e_generated_0646d5ac.png";

export default function Hero() {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative h-[100svh] w-full overflow-hidden"
    >
      {/* base image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="An architectural light sculpture — a sharp beam of cyan light cutting through deep darkness."
          fittingType="fill"
          className="h-full w-full object-cover"
        />
      </div>

      {/* torch light overlay following cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(28% 28% at var(--mx, 50%) var(--my, 50%), hsl(186 100% 50% / 0.22), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      {/* darken for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/85" />

      {/* split brand name */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
        <h1 className="font-heading text-[18vw] font-bold leading-[0.8] tracking-[-0.02em] text-white text-glow md:text-[14vw]">
          MAZ
        </h1>
        <h1 className="self-end text-right font-heading text-[18vw] font-bold leading-[0.8] tracking-[-0.02em] text-white text-glow md:text-[14vw]">
          ROOD
        </h1>
      </div>

      {/* center meta + CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono-tech mb-6 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
          Atmospheric Engineering
        </p>
        <p className="mx-auto max-w-xl font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-80 md:text-lg">
          We sculpt light against the infinite depth of architectural space —
          instruments of luminance for the built world.
        </p>
        <a
          href="#gallery"
          className="btn-photon animate-photon-pulse mt-10 inline-flex items-center gap-3 rounded-sm px-8 py-4 font-mono-tech text-xs uppercase tracking-[0.25em]"
        >
          Explore the Light
          <ArrowDown size={14} />
        </a>
      </div>

      {/* corner surveyor marks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="precision-rule absolute left-6 top-6 h-4 w-px opacity-60 md:left-10 md:top-10" />
        <span className="precision-rule absolute left-6 top-6 h-px w-4 opacity-60 md:left-10 md:top-10" />
        <span className="precision-rule absolute right-6 top-6 h-4 w-px opacity-60 md:right-10 md:top-10" />
        <span className="precision-rule absolute right-6 top-6 h-px w-4 opacity-60 md:right-10 md:top-10" />
        <span className="precision-rule absolute bottom-6 left-6 h-4 w-px opacity-60 md:bottom-10 md:left-10" />
        <span className="precision-rule absolute bottom-6 left-6 h-px w-4 opacity-60 md:bottom-10 md:left-10" />
        <span className="precision-rule absolute bottom-6 right-6 h-4 w-px opacity-60 md:bottom-10 md:right-10" />
        <span className="precision-rule absolute bottom-6 right-6 h-px w-4 opacity-60 md:bottom-10 md:right-10" />
      </div>
    </section>
  );
}