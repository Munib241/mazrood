import { useState } from "react";
import { Github } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Commits the stored Mazrood Studio theme files to a GitHub repository
// as a single commit on the chosen branch.
export default function GithubPushCard() {
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const push = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke("github_theme_push", {
        repo,
        branch,
      });
      setResult({ ok: true, ...res.data });
    } catch (e) {
      setResult({
        ok: false,
        error: e?.response?.data?.error || e?.message || "Push failed.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8">
      <h2 className="font-heading text-xl font-medium text-[hsl(var(--foreground))]">
        GitHub
      </h2>
      <p className="mt-3 font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-75">
        Commits the current Mazrood Studio theme files to your GitHub
        repository in a single commit. Enter the repository as owner/name.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="owner/repository"
          aria-label="GitHub repository"
          className="min-w-0 flex-1 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 font-mono-tech text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none"
        />
        <input
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="main"
          aria-label="Branch"
          className="w-full rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 font-mono-tech text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:outline-none sm:w-36"
        />
      </div>
      <button
        type="button"
        onClick={push}
        disabled={busy || !repo.trim()}
        className="btn-solid mt-6 inline-flex items-center gap-2 rounded-sm px-6 py-3 font-mono-tech text-xs uppercase tracking-[0.25em] disabled:opacity-60"
      >
        <Github size={14} />
        {busy ? "Pushing…" : "Push theme to GitHub"}
      </button>
      {result && (
        <p
          className="font-mono-tech mt-4 break-words text-xs leading-relaxed"
          style={{
            color: result.ok
              ? "hsl(var(--primary))"
              : "hsl(var(--destructive))",
          }}
        >
          {result.ok
            ? `Pushed ${result.pushed} files to "${result.branch}"${result.failed ? ` (${result.failed} failed)` : ""} — commit ${result.commit_sha?.slice(0, 7)}.`
            : result.error}
        </p>
      )}
    </section>
  );
}