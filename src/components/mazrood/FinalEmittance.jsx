import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FOOTER_LINKS = [
  { label: "New", href: "https://mazrood.com/collections/new-2026" },
  { label: "Men", href: "https://mazrood.com/collections/men" },
  { label: "Women", href: "https://mazrood.com/collections/women" },
  { label: "Kids", href: "https://mazrood.com/collections/kids" },
  { label: "Headwear", href: "https://mazrood.com/collections/caps" },
  { label: "Accessories", href: "https://mazrood.com/collections/accessories" },
  { label: "Sale", href: "https://mazrood.com/collections/fw25-26" },
];

export default function FinalEmittance() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      await base44.functions.invoke("subscribe_newsletter", { email: value });
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("idle");
      setError(err?.response?.data?.error ?? "Could not sign you up — please try again.");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="safe-area-bottom relative w-full overflow-hidden border-t border-[hsl(var(--border))]"
    >
      {/* soft seasonal sheen */}
      <div
        className="animate-spectrum pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "linear-gradient(90deg, hsl(240 10% 4%), hsl(45 20% 30%), hsl(42 35% 55%), hsl(20 15% 28%), hsl(240 10% 4%))",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-36">
        <p className="font-mono-tech mb-5 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
          05 — Stay in the loop
        </p>
        <h2
          id="contact-heading"
          className="font-heading text-4xl font-light leading-[1.05] tracking-[-0.01em] text-white md:text-7xl"
        >
          Join <span className="font-bold italic">the list.</span>
        </h2>
        <p className="mt-6 max-w-md font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-80">
          Email me with news and offers — early access to drops, private sales
          and notes from the studio.
        </p>

        <form onSubmit={submit} className="mt-12 w-full max-w-3xl">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] pb-3 transition focus-within:border-[hsl(var(--primary))]">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent font-heading text-2xl font-light text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none md:text-4xl"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-solid flex shrink-0 items-center gap-2 rounded-sm px-6 py-3 font-mono-tech text-[0.7rem] uppercase tracking-[0.25em] disabled:opacity-60"
            >
              {status === "done" ? (
                <>
                  <Check size={14} /> You're in
                </>
              ) : status === "sending" ? (
                <>Signing up…</>
              ) : (
                <>
                  Sign Up <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
          {error ? (
            <p role="alert" className="mt-3 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--destructive))]">
              {error}
            </p>
          ) : (
            <p className="mt-3 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              News and offers only. Unsubscribe anytime.
            </p>
          )}
        </form>

        <div className="mt-24 flex flex-col gap-10 border-t border-[hsl(var(--border))] pt-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
            <span className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-white">
              Mazrood Studio
            </span>
          </div>
          <nav aria-label="Collections" className="flex flex-wrap gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mt-8 font-mono-tech text-[0.6rem] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
          © {new Date().getFullYear()} Mazrood Studio — All rights reserved
        </p>
      </div>
    </section>
  );
}