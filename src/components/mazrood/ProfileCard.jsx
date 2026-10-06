import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Pencil, Check } from "lucide-react";

const inputClass =
  "w-full rounded-sm border border-[hsl(var(--border))] bg-transparent px-4 py-3 font-body text-sm text-[hsl(var(--foreground))] placeholder:opacity-40 focus-visible:outline-none";

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setName(u.full_name || "");
    });
  }, []);

  if (!user) return null;

  const save = async () => {
    setSaving(true);
    try {
      const updated = await base44.auth.updateMe({ full_name: name.trim() });
      setUser(updated);
      setName(updated.full_name || "");
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const labelClass =
    "font-mono-tech text-[0.65rem] uppercase tracking-[0.25em] text-[hsl(var(--foreground))] opacity-60";

  return (
    <section
      aria-labelledby="profile-heading"
      className="rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8"
    >
      <h2
        id="profile-heading"
        className="font-heading text-xl font-medium text-[hsl(var(--foreground))]"
      >
        Profile
      </h2>
      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="profile-name" className={labelClass}>
            Name
          </label>
          {editing ? (
            <div className="mt-2 flex gap-2">
              <input
                id="profile-name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="btn-solid inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono-tech text-xs uppercase tracking-[0.2em] disabled:opacity-60"
              >
                <Check size={14} /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-3">
              <p className="font-body text-sm text-[hsl(var(--foreground))]">
                {user.full_name || "Not set"}
              </p>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="font-mono-tech inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[hsl(var(--foreground))] opacity-70 transition hover:text-[hsl(var(--primary))] hover:opacity-100"
              >
                <Pencil size={13} /> Edit
              </button>
            </div>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="profile-email">
            Email
          </label>
          <input
            id="profile-email"
            className={`${inputClass} mt-2 opacity-60`}
            value={user.email || ""}
            readOnly
            disabled
          />
          <p className="mt-2 font-body text-xs opacity-60">
            Your email is your sign-in and can't be changed here.
          </p>
        </div>
        {saved && (
          <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
            Profile updated
          </p>
        )}
      </div>
    </section>
  );
}