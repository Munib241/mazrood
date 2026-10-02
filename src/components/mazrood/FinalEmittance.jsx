import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function FinalEmittance() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative w-full overflow-hidden border-t border-[hsl(var(--border))]"
    >
      {/* dawn-to-dusk spectrum background */}
      <div
        className="animate-spectrum pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(90deg, hsl(240 10% 4%), hsl(280 40% 18%), hsl(40 80% 45%), hsl(20 70% 40%), hsl(240 10% 4%))",
        }}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
        <p className="font-mono-tech mb-5 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
          04 — Final Emittance
        </p>
        <h2
          id="contact-heading"
          className="font-heading text-4xl font-light leading-[1.05] tracking-[-0.01em] text-white md:text-7xl"
        >
          Step into <br />
          <span className="font-bold">the light.</span>
        </h2>
        <p className="mt-6 max-w-md font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-80">
          Commission a spatial lighting study, or join the studio's private
          briefings on atmospheric engineering. One field — that's all we ask.
        </p>

        <form onSubmit={submit} className="mt-12 w-full max-w-3xl">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="group flex items-center gap-3 border-b border-[hsl(var(--border))] pb-3 transition focus-within:border-[hsl(var(--primary))]">
            <span className="font-mono-tech text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              01
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@studio.com"
              className="w-full bg-transparent font-heading text-2xl font-light text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none md:text-4xl"
            />
            <button
              type="submit"
              className="btn-photon flex shrink-0 items-center gap-2 rounded-sm px-6 py-3 font-mono-tech text-[0.7rem] uppercase tracking-[0.25em]"
            >
              {sent ? (
                <>
                  <Check size={14} /> Received
                </>
              ) : (
                <>
                  Transmit <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-24 flex flex-col gap-6 border-t border-[hsl(var(--border))] pt-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_12px_hsl(186_100%_50%_/_0.8)]" />
            <span className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-white">
              Mazrood
            </span>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-3 font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
            <a href="mailto:studio@mazrood.com" className="transition hover:text-[hsl(var(--primary))]">
              studio@mazrood.com
            </a>
            <span>Atmospheric Engineering</span>
            <span>© {new Date().getFullYear()} Mazrood</span>
          </div>
        </div>
      </div>
    </section>
  );
}