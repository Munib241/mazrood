import { useEffect, useState } from "react";
import { ChevronDown, Menu, Settings as SettingsIcon, X } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ThemeToggle from "@/components/mazrood/ThemeToggle";

// Mirror of the Shopify main-menu. Used until the live menu loads.
const FALLBACK_LINKS = [
  { title: "New", url: "/store/new-2026" },
  { title: "Men", url: "/store/men" },
  { title: "Women", url: "/store/women" },
  { title: "Sale", url: "/store/sale" },
];

// Rewrites a Shopify menu URL as an in-app route.
const toRoute = (url) => {
  if (!url) return null;
  try {
    const path = new URL(url, "https://www.mazrood.com").pathname.replace(/\/$/, "");
    if (path === "/" || path === "") return "/";
    if (path.startsWith("/collections/")) return `/store/${path.split("/")[2]}`;
    if (path.startsWith("/products/")) return `/product/${path.split("/")[2]}`;
    if (path.startsWith("/collections")) return "/store";
    return null;
  } catch {
    return null;
  }
};

const mapMenu = (items) =>
  (items || [])
    .map((item) => {
      const route = toRoute(item.url);
      const children = (item.items || [])
        .map((child) => ({ title: child.title, route: toRoute(child.url) }))
        .filter((c) => c.route);
      if (!route && children.length === 0) return null;
      return { title: item.title, route, children };
    })
    .filter(Boolean);

function ShopDropdown({ item, tone, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`font-mono-tech flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.2em] ${tone} transition hover:text-[hsl(var(--primary))]`}
      >
        {item.title}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="glass-panel absolute left-0 top-full z-50 mt-3 min-w-[200px] rounded-sm border p-3">
          {item.route && (
            <Link
              to={item.route}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="font-mono-tech block rounded-sm px-3 py-2.5 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--primary))]"
            >
              All {item.title}
            </Link>
          )}
          {item.children.map((c) => (
            <Link
              key={c.title}
              to={c.route}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="font-mono-tech block rounded-sm px-3 py-2.5 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))] transition hover:text-[hsl(var(--primary))]"
            >
              {c.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState(FALLBACK_LINKS);
  const tone = scrolled ? "text-[hsl(var(--foreground))]" : "text-white";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live Shopify main-menu — same structure as the store's own navigation.
  useEffect(() => {
    let cancelled = false;
    base44.functions
      .invoke("shopify_products", { menu: true })
      .then((res) => {
        if (cancelled) return;
        const mapped = mapMenu(res?.data?.menu);
        if (mapped.length > 0) {
          setLinks(mapped.map((m) => ({ ...m, route: m.route === "/" ? "/" : m.route })));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const renderLink = (item, mobile) => {
    if (item.children && item.children.length > 0) {
      if (mobile) {
        return (
          <div key={item.title} className="flex flex-col gap-3">
            <span className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
              {item.title}
            </span>
            {item.route && (
              <Link
                to={item.route}
                onClick={() => setOpen(false)}
                className="font-mono-tech pl-4 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))]"
              >
                All {item.title}
              </Link>
            )}
            {item.children.map((c) => (
              <Link
                key={c.title}
                to={c.route}
                onClick={() => setOpen(false)}
                className="font-mono-tech pl-4 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))]"
              >
                {c.title}
              </Link>
            ))}
          </div>
        );
      }
      return <ShopDropdown key={item.title} item={item} tone={tone} />;
    }
    return (
      <Link
        key={item.title}
        to={item.route || "/store"}
        className={`font-mono-tech text-sm font-medium uppercase tracking-[0.2em] ${tone} transition hover:text-[hsl(var(--primary))] underline-offset-8 hover:underline decoration-1`}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`safe-area-top transition-all duration-500 ${
          scrolled ? "glass-panel border-b" : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-6 md:px-10">
          <Link to="/" className="flex items-center" aria-label="Mazrood Studio home">
            <Image
              src="https://media.base44.com/images/public/6abfc987ea748e49e7475c82/41b0c628d_logo.png"
              alt="Mazrood Studio logo"
              fittingType="fit"
              className="h-9 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {links.map((l) => renderLink(l, false))}
            <ThemeToggle className="text-[hsl(var(--foreground))]" />
            <Link
              to="/settings"
              aria-label="Settings"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-sm ${tone} transition hover:text-[hsl(var(--primary))]`}
            >
              <SettingsIcon size={17} />
            </Link>
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
          <div className="glass-panel max-h-[70vh] overflow-y-auto border-t border-[hsl(var(--border))] px-6 py-6 md:hidden">
            <div className="flex flex-col gap-5">
              {links.map((l) => renderLink(l, true))}
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