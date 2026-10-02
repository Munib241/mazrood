import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Gallery", href: "#gallery" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
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
          <a href="#top" className="group flex items-center gap-3" aria-label="Mazrood home">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_12px_hsl(186_100%_50%_/_0.8)]" />
            <span className="font-heading text-sm font-bold uppercase tracking-[0.3em] text-white">
              Mazrood
            </span>
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))] opacity-70 transition hover:opacity-100 hover:text-[hsl(var(--primary))]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--primary-foreground))] btn-photon rounded-sm px-5 py-2.5"
            >
              Request Access
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
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))]"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--primary-foreground))] btn-photon rounded-sm px-5 py-2.5 text-center"
              >
                Request Access
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}