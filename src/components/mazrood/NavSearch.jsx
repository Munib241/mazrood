import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/hooks/useShopifyProducts";

// Site-wide product search in the nav: typed terms run against the live
// Shopify catalog (name or category match) and each result opens its product page.
export default function NavSearch({ tone }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const timer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Debounced server-side catalog search — nothing is filtered in the browser.
  useEffect(() => {
    const term = q.trim();
    window.clearTimeout(timer.current);
    if (term.length < 2) {
      setResults(null);
      setBusy(false);
      return;
    }
    setBusy(true);
    timer.current = window.setTimeout(async () => {
      try {
        const res = await base44.functions.invoke("shopify_products", { search: term });
        setResults(Array.isArray(res?.data?.products) ? res.data.products : []);
      } catch {
        setResults([]);
      }
      setBusy(false);
    }, 350);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  const go = (handle) => {
    setOpen(false);
    setQ("");
    setResults(null);
    navigate(`/product/${handle}`);
  };

  // Portal to body: the header's glass panel would otherwise trap the
  // fixed-position overlay inside its own bounds.
  const overlay = open && createPortal(
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={() => setOpen(false)}
      />
      <div className="glass-panel absolute left-1/2 top-20 w-[calc(100%-3rem)] max-w-2xl -translate-x-1/2 rounded-sm border p-4">
        <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] pb-3">
          <Search size={18} className="shrink-0 text-[hsl(var(--muted-foreground))]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && results?.[0] && go(results[0].handle)}
            placeholder="Search by name or category…"
            className="font-mono-tech w-full bg-transparent text-sm uppercase tracking-[0.15em] text-[hsl(var(--foreground))] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[hsl(var(--muted-foreground))]"
          />
          {busy && <Loader2 size={16} className="animate-spin text-[hsl(var(--muted-foreground))]" />}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="shrink-0 text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--foreground))]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-3 max-h-[60vh] overflow-y-auto">
          {results?.length
            ? results.map((p) => (
                <button
                  key={p.handle}
                  type="button"
                  onClick={() => go(p.handle)}
                  className="flex w-full items-center gap-4 rounded-sm p-2 text-left transition hover:bg-[hsl(var(--secondary))]"
                >
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-[hsl(var(--card))]">
                    {p.img && <Image src={p.img} alt="" fittingType="fill" className="h-full w-full" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-body text-sm font-medium text-[hsl(var(--foreground))]">
                      {p.name}
                    </span>
                    <span className="font-mono-tech block text-xs text-[hsl(var(--muted-foreground))]">
                      {formatPrice(p.price, p.currency)}
                    </span>
                  </span>
                </button>
              ))
            : results && (
                <p className="font-mono-tech p-4 text-center text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                  No pieces found.
                </p>
              )}
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-sm ${tone} transition hover:text-[hsl(var(--primary))]`}
      >
        <Search size={17} />
      </button>
      {overlay}
    </>
  );
}