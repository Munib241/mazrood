import { Link } from "react-router-dom";
import { PackageCheck, RefreshCcw, BadgeDollarSign, MessageCircle } from "lucide-react";
import Nav from "@/components/mazrood/Nav";
import FinalEmittance from "@/components/mazrood/FinalEmittance";

const SECTIONS = [
  {
    icon: PackageCheck,
    title: "Shipping",
    intro: "Every order is packed by hand in the studio and ships with tracking.",
    rows: [
      ["Processing time", "Orders are prepared within 1–2 business days (excludes weekends and holidays)."],
      ["Domestic delivery", "Standard shipping takes 3–7 business days after processing. Expedited options are shown at checkout."],
      ["International delivery", "International orders typically arrive within 7–14 business days, depending on customs."],
      ["Tracking", "A tracking link is emailed the moment your parcel leaves the studio."],
      ["Duties & taxes", "International customers may be responsible for customs duties, which are set by your country."],
    ],
  },
  {
    icon: RefreshCcw,
    title: "Returns & Exchanges",
    intro: "If something isn't right, you have 30 days from delivery to send it back.",
    rows: [
      ["Return window", "30 days from the delivery date."],
      ["Condition", "Items must be unworn, unwashed and have original tags attached."],
      ["Exchanges", "Need a different size or color? An exchange ships as soon as your return is scanned by the carrier."],
      ["Final sale", "Items marked “Final Sale” at checkout cannot be returned or exchanged."],
    ],
  },
  {
    icon: BadgeDollarSign,
    title: "The Refund Process",
    intro: "Four simple steps — and you're updated at every one of them.",
    steps: [
      ["Start your return", "Use the return portal in the footer (“Request a return / exchange”) with your order number and email. It takes under a minute."],
      ["Ship it back", "You'll receive a prepaid return label and instructions by email. Drop the parcel off at any carrier location."],
      ["We inspect it", "Once the item arrives, it's checked within 2 business days. You'll get an email the moment it's approved."],
      ["Your refund is issued", "The refund goes back to your original payment method — the same card you paid with at checkout. Banks typically post it within 5–10 business days, and you'll see the amount as a credit from Shopify, our checkout provider."],
    ],
  },
  {
    icon: MessageCircle,
    title: "Questions?",
    intro: "We're happy to help before or after an order.",
    rows: [
      ["Support", "Reach the studio anytime through the contact links in the footer below."],
      ["Order help", "Include your order number (it starts with #MAZ or is in your confirmation email) so we can help fastest."],
    ],
  },
];

export default function Policies() {
  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <Nav />
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-28 md:px-10 md:pt-36">
        <Link
          to="/"
          className="font-mono-tech text-xs uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]"
        >
          &larr; Back to the studio
        </Link>

        <p className="font-mono-tech mt-10 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
          Store Policies
        </p>
        <h1 className="mt-4 font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl">
          Shipping &amp; Returns.
        </h1>
        <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-80">
          Clear policies, real timelines and a refund that goes straight back to
          your card — so you can order with complete confidence.
        </p>

        <div className="mt-14 space-y-14">
          {SECTIONS.map(({ icon: Icon, title, intro, rows, steps }) => (
            <section key={title} aria-labelledby={`sec-${title}`}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[hsl(var(--border))] text-[hsl(var(--primary))]">
                  <Icon size={17} />
                </span>
                <h2
                  id={`sec-${title}`}
                  className="font-heading text-2xl font-light text-[hsl(var(--foreground))] md:text-3xl"
                >
                  {title}
                </h2>
              </div>
              <p className="mt-3 font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-70">
                {intro}
              </p>

              {rows && (
                <dl className="mt-6 divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
                  {rows.map(([term, desc]) => (
                    <div key={term} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                      <dt className="font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--primary))]">
                        {term}
                      </dt>
                      <dd className="font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-85">
                        {desc}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {steps && (
                <ol className="mt-6 space-y-4">
                  {steps.map(([heading, desc], i) => (
                    <li key={heading} className="flex gap-4 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                      <span className="font-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-sm font-bold text-[hsl(var(--primary-foreground))]">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-heading text-base font-medium text-[hsl(var(--foreground))]">
                          {heading}
                        </h3>
                        <p className="mt-1.5 font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-75">
                          {desc}
                        </p>
                      </div>
                    </li>
                  ))}
                  <li>
                    <a
                      href="https://mazrood.com/a/return"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-solid mt-2 inline-flex rounded-sm px-6 py-3 font-mono-tech text-[0.7rem] uppercase tracking-[0.25em]"
                    >
                      Request a return or exchange
                    </a>
                  </li>
                </ol>
              )}
            </section>
          ))}
        </div>
      </main>
      <FinalEmittance />
    </div>
  );
}