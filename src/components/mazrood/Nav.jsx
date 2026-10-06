import { useEffect, useState } from "react";
import { Menu, Settings as SettingsIcon, ShoppingCart, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import WordmarkLogo from "@/components/mazrood/WordmarkLogo";
import ThemeToggle from "@/components/mazrood/ThemeToggle";
import NavDropdown from "@/components/mazrood/NavDropdown";
import MobileMenu from "@/components/mazrood/MobileMenu";
import { FALLBACK_MENU, buildMenu, menuFromCache, setMenuCache } from "@/lib/shopMenu";
import CartDrawer from "@/components/mazrood/CartDrawer";
import { cartCount, onCartChange } from "@/lib/cart";

export default function Nav() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState(FALLBACK_MENU);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  // White text only while floating over the home hero photo. The logo
  // itself always stays Mazrood blue regardless of this.
  const tone =
    pathname === "/" && !scrolled ? "text-white" : "text-[hsl(var(--foreground))]";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cart badge count, live from the session cart.
  useEffect(() => {
    setCartItemsCount(cartCount());
    return onCartChange((cart) => setCartItemsCount(cartCount(cart)));
  }, []);

  // Live Shopify main menu — same structure as the store's own navigation.
  useEffect(() => {
    const cached = menuFromCache();
    if (cached) {
      setLinks(cached);
      return;
    }
    let cancelled = false;
    base44.functions
      .invoke("shopify_products", { menu: true })
      .then((res) => {
        const live = buildMenu(res?.data?.menu);
        if (!cancelled && live.length > 0) {
          setMenuCache(live);
          setLinks(live);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`safe-area-top transition-all duration-500 ${
          scrolled || pathname !== "/" ? "glass-panel border-b" : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-6 md:px-10">
          <Link
            to="/"
            className="mr-8 flex shrink-0 items-center pt-[0.35rem]"
            aria-label="Mazrood Studio home"
          >
            {/* Official MAZROOD™ wordmark, rebuilt from the reference with a
                fully transparent background in brand blue #000f9f */}
            <WordmarkLogo />
          </Link>

          <div className="hidden items-center gap-6 lg:flex xl:gap-9">
            {links.map((l) =>
              l.children.length > 0 ? (
                <NavDropdown key={l.title} item={l} tone={tone} />
              ) : (
                <Link
                  key={l.title}
                  to={l.route}
                  className={`font-mono-tech whitespace-nowrap text-[0.8rem] font-medium uppercase tracking-[0.2em] ${tone} transition hover:text-[hsl(var(--primary))]`}
                >
                  {l.title}
                </Link>
              )
            )}
            <ThemeToggle className={tone} />
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${cartItemsCount} items`}
              className={`relative inline-flex h-9 w-9 items-center justify-center rounded-sm ${tone} transition hover:text-[hsl(var(--primary))]`}
            >
              <ShoppingCart size={17} />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[hsl(var(--primary))] px-1 font-mono-tech text-[0.55rem] leading-none text-[hsl(var(--primary-foreground))]">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <Link
              to="/settings"
              aria-label="Settings"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-sm ${tone} transition hover:text-[hsl(var(--primary))]`}
            >
              <SettingsIcon size={17} />
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${cartItemsCount} items`}
              className={`relative inline-flex h-9 w-9 items-center justify-center rounded-sm ${tone} transition hover:text-[hsl(var(--primary))]`}
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[hsl(var(--primary))] px-1 font-mono-tech text-[0.55rem] leading-none text-[hsl(var(--primary-foreground))]">
                  {cartItemsCount}
                </span>
              )}
            </button>
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

        {open && <MobileMenu links={links} onClose={() => setOpen(false)} />}
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}