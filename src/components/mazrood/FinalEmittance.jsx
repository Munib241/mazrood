import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const FOOTER_LINKS = [
  { label: "New", href: "/store/new-2026" },
  { label: "Men", href: "/store/men" },
  { label: "Women", href: "/store/women" },
  { label: "Kids", href: "/store/kids" },
  { label: "Headwear", href: "/store/caps" },
  { label: "Accessories", href: "/store/accessories" },
  { label: "Sale", href: "/store/sale" },
];

// Support and policy links — the same destinations as the official store's
// footer, so refunds and returns route exactly as they used to.
const SUPPORT_LINKS = [
  { label: "Shipping & Returns", href: "/policies" },
  { label: "Request a return / exchange", href: "https://mazrood.com/a/return" },
  { label: "Return/Exchange Policy", href: "https://mazrood.com/pages/store-policies" },
  { label: "Refund Policy", href: "https://www.mazrood.com/policies/refund-policy" },
  { label: "Shipping Policy", href: "https://mazrood.com/pages/shipping-policy" },
  { label: "About Us", href: "https://www.mazrood.com/pages/about-us" },
  { label: "Privacy Policy", href: "https://www.mazrood.com/pages/privacy-policy" },
  { label: "Terms of Service", href: "https://www.mazrood.com/pages/terms-of-service" },
  { label: "Consumer Complaints", href: "https://www.mazrood.com/pages/consumer-complaints" },
  { label: "Delete Account", href: "https://www.mazrood.com/pages/delete-account" },
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
          06 — Stay in the loop
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
              <Link
                key={l.label}
                to={l.href}
                className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--foreground))]/90 transition hover:text-[hsl(var(--primary))]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav
          aria-label="Support and policies"
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[hsl(var(--border))] pt-8"
        >
          <span className="font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--primary))]">
            Support
          </span>
          {SUPPORT_LINKS.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.label}
                to={l.href}
                className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--primary))]"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--foreground))]/90 transition hover:text-[hsl(var(--primary))]"
              >
                {l.label}
              </a>
            )
          )}
        </nav>
        <p className="mt-8 font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--foreground))]/80">
          © {new Date().getFullYear()} Mazrood Studio — All rights reserved
        </p>
      </div>
    </section>
  );
}