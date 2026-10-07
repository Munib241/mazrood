import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

// One-click push of the app's theme files into the Shopify store via the
// Admin API — replaces manual zip uploads.
export default function ThemeSyncCard() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const sync = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke("shopify_theme_sync", {});
      setResult({ ok: true, ...res.data });
    } catch (e) {
      setResult({
        ok: false,
        error: e?.response?.data?.error || e?.message || "Sync failed.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8">
      <h2 className="font-heading text-xl font-medium text-[hsl(var(--foreground))]">
        Theme Sync
      </h2>
      <p className="mt-3 font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-75">
        Pushes the latest Mazrood Studio theme files into the store as the
        "Mazrood Studio (Auto-Sync)" theme. Publish it in Shopify admin when
        you're ready for it to go live.
      </p>
      <button
        type="button"
        onClick={sync}
        disabled={busy}
        className="btn-solid mt-6 inline-flex items-center gap-2 rounded-sm px-6 py-3 font-mono-tech text-xs uppercase tracking-[0.25em] disabled:opacity-60"
      >
        <RefreshCw size={14} className={busy ? "animate-spin" : ""} />
        {busy ? "Syncing…" : "Sync theme to Shopify"}
      </button>
      {result && (
        <p
          className="font-mono-tech mt-4 text-xs leading-relaxed"
          style={{
            color: result.ok
              ? "hsl(var(--primary))"
              : "hsl(var(--destructive))",
          }}
        >
          {result.ok
            ? `Synced ${result.synced} files${result.errors?.length ? ` (${result.errors.length} failed)` : ""} into "${result.theme_name}".`
            : result.error}
        </p>
      )}
    </section>
  );
}