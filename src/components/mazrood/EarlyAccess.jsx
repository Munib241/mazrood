import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Early-access signup for the FW26 collection — one email field, one button.
export default function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      await base44.functions.invoke("subscribe_newsletter", { email: value });
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("idle");
      setError(
        err?.response?.data?.error ?? "Could not sign you up — please try again."
      );
    }
  };

  return (
    <section
      id="early-access"
      aria-labelledby="early-access-heading"
      className="relative border-t border-[hsl(var(--border))] py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <p className="font-mono-tech mb-5 text-[0.7rem] uppercase tracking-[0.4em] text-[hsl(var(--primary))]">
          04 — Early access
        </p>
        <h2
          id="early-access-heading"
          className="font-heading text-4xl font-light leading-[1.05] tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-6xl"
        >
          Be first to the <span className="font-bold italic">new season.</span>
        </h2>
        <p className="mt-6 max-w-md font-body text-base leading-relaxed text-[hsl(var(--foreground))] opacity-75 md:text-lg">
          Leave your email and we'll notify you when the FW26 collection opens —
          before it reaches the store.
        </p>

        <form onSubmit={submit} className="mt-12 w-full max-w-2xl">
          <label htmlFor="early-access-email" className="sr-only">
            Email address
          </label>
          <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] pb-3 transition focus-within:border-[hsl(var(--primary))]">
            <input
              id="early-access-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-transparent font-heading text-2xl font-light text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none md:text-3xl"
            />
            <button
              type="submit"
              disabled={status === "sending" || status === "done"}
              className="btn-solid flex shrink-0 items-center gap-2 rounded-sm px-6 py-3 font-mono-tech text-[0.7rem] uppercase tracking-[0.25em] disabled:opacity-60"
            >
              {status === "done" ? (
                <>
                  <Check size={14} /> You're on the list
                </>
              ) : status === "sending" ? (
                <>Notifying…</>
              ) : (
                <>
                  Notify Me <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
          {error ? (
            <p
              role="alert"
              className="mt-3 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--destructive))]"
            >
              {error}
            </p>
          ) : (
            <p className="mt-3 font-mono-tech text-[0.6rem] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              FW26 early access only. No noise.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}