import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { categoryLabel } from "@/lib/shopMenu";
import { base44 } from "@/api/base44Client";
import Nav from "@/components/mazrood/Nav";
import ProductCard from "@/components/mazrood/ProductCard";
import { FEATURED_HANDLES } from "@/lib/featuredPieces";

// Products arrive page by page as the shopper scrolls, instead of one
// heavy download on first paint.
const PAGE_SIZE = 24;

// Featured studio-line pieces float to the top of the first page, in their
// homepage rope order; everything else keeps its store ordering.
const rankFeatured = (products) =>
  [...products].sort((a, b) => {
    const fa = FEATURED_HANDLES.indexOf(a.handle);
    const fb = FEATURED_HANDLES.indexOf(b.handle);
    return (fa === -1 ? FEATURED_HANDLES.length : fa) - (fb === -1 ? FEATURED_HANDLES.length : fb);
  });

export default function Store() {
  const { collection = "all" } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const [state, setState] = useState({
    loading: true,
    products: [],
    error: false,
    title: null,
    cursor: null,
    hasMore: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef(null);

  // First page only. One retry: a transient storefront failure used to
  // leave the grid permanently empty until another navigation.
  useEffect(() => {
    let cancelled = false;
    setState({
      loading: true,
      products: [],
      error: false,
      title: null,
      cursor: null,
      hasMore: false,
    });
    const load = (attempt = 0) => {
      base44.functions
        // "all" isn't a Shopify collection — the shop's latest products load instead.
        .invoke(
          "shopify_products",
          collection === "all"
            ? { limit: PAGE_SIZE }
            : { collection, type, limit: PAGE_SIZE }
        )
        .then((res) => {
          if (cancelled) return;
          if (res?.data?.error && attempt < 1) {
            window.setTimeout(() => !cancelled && load(attempt + 1), 1500);
            return;
          }
          const live = Array.isArray(res?.data?.products) ? res.data.products : [];
          const rawTitle = res?.data?.title ?? null;
          // The reduced collection is titled "Archive" — never sale language.
          const title =
            collection === "fw25-26" || /sale/i.test(rawTitle || "")
              ? "Archive"
              : rawTitle;
          setState({
            loading: false,
            products: rankFeatured(live),
            error: live.length === 0,
            title,
            cursor: res?.data?.nextCursor ?? null,
            hasMore: Boolean(res?.data?.hasMore),
          });
        })
        .catch(() => {
          if (cancelled) return;
          if (attempt < 1) {
            window.setTimeout(() => !cancelled && load(attempt + 1), 1500);
            return;
          }
          setState({
            loading: false,
            products: [],
            error: true,
            title: null,
            cursor: null,
            hasMore: false,
          });
        });
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [collection, type]);

  // Next pages load only when the sentinel near the grid's end scrolls
  // into view — never up front.
  const loadMore = async () => {
    if (fetchingRef.current || !state.cursor || !state.hasMore) return;
    fetchingRef.current = true;
    setLoadingMore(true);
    try {
      const res = await base44.functions.invoke("shopify_products", {
        collection: collection === "all" ? "" : collection,
        type,
        cursor: state.cursor,
        limit: PAGE_SIZE,
      });
      const live = Array.isArray(res?.data?.products) ? res.data.products : [];
      setState((s) => ({
        ...s,
        products: [...s.products, ...live],
        cursor: res?.data?.nextCursor ?? null,
        hasMore: Boolean(res?.data?.hasMore),
      }));
    } catch {
      // Keep what's on screen; stop asking for more.
      setState((s) => ({ ...s, hasMore: false }));
    }
    fetchingRef.current = false;
    setLoadingMore(false);
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || state.loading || !state.hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [state, loadingMore]);

  const label = [state.title || "Store", categoryLabel(collection, type)]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <Nav />
      <main className="relative z-10 mx-auto max-w-[1600px] px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <nav
          aria-label="Breadcrumb"
          className="font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]"
        >
          <Link to="/" className="transition hover:text-[hsl(var(--primary))]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[hsl(var(--foreground))]">{label}</span>
        </nav>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-[hsl(var(--border))] pb-6">
          <h1 className="font-heading text-3xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-5xl">
            {label}
          </h1>
          {!state.loading && state.products.length > 0 && (
            <p className="font-mono-tech text-[0.65rem] uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              {state.products.length} products
            </p>
          )}
        </div>

        {state.loading ? (
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-sm bg-[hsl(var(--secondary))]" />
                <div className="mt-3 h-4 w-2/3 rounded-sm bg-[hsl(var(--secondary))]" />
                <div className="mt-2 h-3 w-1/4 rounded-sm bg-[hsl(var(--secondary))]" />
                <div className="mt-2 h-3 w-1/3 rounded-sm bg-[hsl(var(--secondary))]" />
              </div>
            ))}
          </div>
        ) : state.error || state.products.length === 0 ? (
          <div className="mt-14 border border-[hsl(var(--border))] px-6 py-16 text-center">
            <p className="font-heading text-xl text-[hsl(var(--foreground))]">
              Nothing here yet.
            </p>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              This collection is empty or the store couldn't be reached. Browse
              another collection from the menu.
            </p>
            <Link
              to="/store"
              className="btn-ghost mt-6 inline-flex rounded-sm px-5 py-2.5 font-mono-tech text-xs uppercase tracking-[0.2em]"
            >
              View all
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {state.products.map((p) => (
                <ProductCard key={p.handle} p={p} />
              ))}
            </div>
            {state.hasMore && (
              <div
                ref={sentinelRef}
                className="mt-12 flex h-10 items-center justify-center"
                aria-hidden="true"
              >
                {loadingMore && (
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[hsl(var(--border))] border-t-[hsl(var(--primary))]" />
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}