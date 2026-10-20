import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "New", href: "/store/new-2026" },
  { label: "Men", href: "/store/men" },
  { label: "Women", href: "/store/women" },
  { label: "Kids", href: "/store/kids" },
  { label: "Headwear", href: "/store/caps" },
  { label: "Accessories", href: "/store/accessories" },
  { label: "Archive", href: "/store/fw25-26" },
];

// Support and policy links — the same destinations as the official store's
// footer, so refunds and returns route exactly as they used to.
// Shipping, returns and refund questions all live on the app's own Policies
// page, so they stay inside the site's design. Legal pages (privacy, terms,
// complaints, account deletion) remain on the official store.
const SUPPORT_LINKS = [
  { label: "Shipping & Returns", href: "/policies" },
  { label: "Request a return / exchange", href: "/policies" },
  { label: "Refund Policy", href: "/policies" },
  { label: "Shipping Policy", href: "/policies" },
  { label: "About Us", href: "https://www.mazrood.com/pages/about-us" },
  { label: "Privacy Policy", href: "https://www.mazrood.com/pages/privacy-policy" },
  { label: "Terms of Service", href: "https://www.mazrood.com/pages/terms-of-service" },
  { label: "Consumer Complaints", href: "https://www.mazrood.com/pages/consumer-complaints" },
  { label: "Delete Account", href: "https://www.mazrood.com/pages/delete-account" },
];

export default function FinalEmittance() {

  return (
    <section
      id="contact"
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