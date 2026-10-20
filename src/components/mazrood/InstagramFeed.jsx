import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import FadeImage from "@/components/mazrood/FadeImage";

// Latest brand photography pulled live from the studio's Instagram via the
// instagram_feed function. Every tile links straight into the shop.
export default function InstagramFeed() {
  const [state, setState] = useState({ loading: true, posts: [] });

  useEffect(() => {
    let cancelled = false;
    base44.functions
      .invoke("instagram_feed", {})
      .then((res) => {
        if (!cancelled) {
          setState({ loading: false, posts: res?.data?.posts || [] });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, posts: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // No account content yet (or Instagram unreachable) — the section steps
  // aside instead of showing an empty frame.
  if (!state.loading && state.posts.length === 0) return null;

  return (
    <section
      id="feed"
      aria-labelledby="feed-heading"
      className="relative border-t border-[hsl(var(--border))] py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono-tech mb-4 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
              04 — The Feed
            </p>
            <h2
              id="feed-heading"
              className="font-heading text-4xl font-light leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl"
            >
              Fresh from the studio. <span className="font-bold">Shot live.</span>
            </h2>
          </div>
          <Link
            to="/store"
            className="btn-ghost inline-flex items-center gap-3 rounded-sm px-6 py-3.5 font-mono-tech text-xs uppercase tracking-[0.25em]"
          >
            Shop the feed
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {state.loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-[hsl(var(--secondary))]"
                />
              ))
            : state.posts.map((post) => (
                <Link
                  key={post.id}
                  to="/store"
                  title={post.caption || "Shop the collection"}
                  aria-label={post.caption || "Shop the collection"}
                  className="group relative block aspect-square overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
                >
                  <FadeImage
                    src={post.image}
                    alt={post.caption || "Mazrood studio photography"}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                  />
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}