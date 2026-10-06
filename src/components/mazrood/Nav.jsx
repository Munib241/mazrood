import { useEffect, useState } from "react";
import { Menu, Settings as SettingsIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import ThemeToggle from "@/components/mazrood/ThemeToggle";

const LINKS = [
  { label: "New", href: "https://mazrood.com/collections/new-2026" },
  { label: "Men", href: "https://mazrood.com/collections/men" },
  { label: "Women", href: "https://mazrood.com/collections/women" },
  { label: "Sale", href: "https://mazrood.com/collections/fw25-26" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const tone = scrolled ? "text-[hsl(var(--foreground))]" : "text-white";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`safe-area-top transition-all duration-500 ${
          scrolled ? "glass-panel border-b" : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-6 md:px-10">
          <a href="#top" className="flex items-center" aria-label="Mazrood Studio home">
            <Image
              src="https://media.base44.com/images/public/6abfc987ea748e49e7475c82/41b0c628d_logo.png"
              alt="Mazrood Studio logo"
              fittingType="fit"
              className="h-9 w-auto"
            />
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`font-mono-tech text-sm font-medium uppercase tracking-[0.2em] ${tone} transition hover:text-[hsl(var(--primary))] underline-offset-8 hover:underline decoration-1`}
              >
                {l.label}
              </a>
            ))}
            <ThemeToggle className="text-[hsl(var(--foreground))]" />
            <Link
              to="/settings"
              aria-label="Settings"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-sm ${tone} transition hover:text-[hsl(var(--primary))]`}
            >
              <SettingsIcon size={17} />
            </Link>
            <a
              href="https://mazrood.com/collections/new-2026"
              className="btn-solid rounded-sm px-5 py-2.5 font-mono-tech text-xs uppercase tracking-[0.2em]"
            >
              Shop SS26
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle className={tone} />
            <button
              className={tone}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))]"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}