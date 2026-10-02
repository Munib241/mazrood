import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "New", href: "https://mazrood.com/collections/new-2026" },
  { label: "Men", href: "https://mazrood.com/collections/men" },
  { label: "Women", href: "https://mazrood.com/collections/women" },
  { label: "Sale", href: "https://mazrood.com/collections/fw25-26" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-500 ${
          scrolled ? "glass-panel border-b" : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-6 md:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="Mazrood Studio home">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
            <span className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-white">
              Mazrood <span className="hidden sm:inline">Studio</span>
            </span>
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))] opacity-70 transition hover:opacity-100 hover:text-[hsl(var(--primary))]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://mazrood.com/collections/new-2026"
              className="btn-solid rounded-sm px-5 py-2.5 font-mono-tech text-xs uppercase tracking-[0.2em]"
            >
              Shop SS26
            </a>
          </div>

          <button
            className="text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {open && (
          <div className="glass-panel border-t border-[hsl(var(--border))] px-6 py-6 md:hidden">
            <div className="flex flex-col gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))]"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="https://mazrood.com/collections/new-2026"
                onClick={() => setOpen(false)}
                className="btn-solid rounded-sm px-5 py-2.5 text-center font-mono-tech text-xs uppercase tracking-[0.2em]"
              >
                Shop SS26
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}