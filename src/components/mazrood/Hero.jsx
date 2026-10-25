import { useRef } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

const HERO_IMG =
  "https://mazrood.com/cdn/shop/files/hf_20260910_025717_834f1492-07a4-423a-8a08-0767d3051c43_2000x.png?v=1789013116";

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
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Mazrood Studio SS26 campaign — End of Season."
          fittingType="fill"
          className="h-full w-full object-cover"
        />
      </div>

      {/* soft light following cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(30% 30% at var(--mx, 50%) var(--my, 40%), rgba(242, 239, 234, 0.14), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />

      {/* campaign tag, top */}
      <div className="absolute left-6 top-24 md:left-10 md:top-28">
        <p className="font-mono-tech text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
          Mazrood Studio — SS26
        </p>
      </div>

      {/* headline block, bottom */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-10 md:pb-14">
        <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--foreground))] opacity-70">
          Spring / Summer 2026
        </p>
        <h1 className="font-heading text-[15vw] font-light leading-[0.9] tracking-[-0.02em] text-white md:text-[9.5vw]">
          End of <span className="font-bold italic">Season.</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/store/new-2026"
            className="btn-solid rounded-sm px-8 py-4 font-mono-tech text-xs uppercase tracking-[0.25em]"
          >
            Shop SS26
          </Link>
          <Link
            to="/store/fw25-26"
            className="btn-ghost rounded-sm px-8 py-4 font-mono-tech text-xs uppercase tracking-[0.25em]"
          >
            Shop Sale
          </Link>
        </div>
      </div>
    </section>
  );
}