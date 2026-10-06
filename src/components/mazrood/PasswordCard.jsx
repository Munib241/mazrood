import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { KeyRound } from "lucide-react";

const inputClass =
  "w-full rounded-sm border border-[hsl(var(--border))] bg-transparent px-4 py-3 font-body text-sm text-[hsl(var(--foreground))] placeholder:opacity-40 focus-visible:outline-none";

export default function PasswordCard() {
  const [userId, setUserId] = useState(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setUserId(u?.id))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setDone(false);
    try {
      await base44.auth.changePassword({
        userId,
        currentPassword: current,
        newPassword: next,
      });
      setCurrent("");
      setNext("");
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not change your password. Check your current password and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const labelClass =
    "font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--foreground))] opacity-60";

  return (
    <section
      aria-labelledby="password-heading"
      className="rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8"
    >
      <h2
        id="password-heading"
        className="font-heading text-xl font-medium text-[hsl(var(--foreground))]"
      >
        Change Password
      </h2>
      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="pw-current" className={labelClass}>
            Current password
          </label>
          <input
            id="pw-current"
            type="password"
            required
            autoComplete="current-password"
            className={`${inputClass} mt-2`}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="pw-new" className={labelClass}>
            New password
          </label>
          <input
            id="pw-new"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={`${inputClass} mt-2`}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        {error && <p className="font-body text-sm text-[hsl(var(--destructive))]">{error}</p>}
        {done && (
          <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
            Password updated
          </p>
        )}
        <button
          type="submit"
          disabled={saving || !userId}
          className="btn-solid inline-flex items-center gap-2 rounded-sm px-6 py-3 font-mono-tech text-xs uppercase tracking-[0.25em] disabled:opacity-60"
        >
          <KeyRound size={14} /> {saving ? "Updating…" : "Update password"}
        </button>
      </form>
    </section>
  );
}