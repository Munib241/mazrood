import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProfileCard from "@/components/mazrood/ProfileCard";
import PasswordCard from "@/components/mazrood/PasswordCard";
import ThemeSyncCard from "@/components/mazrood/ThemeSyncCard";
import GithubPushCard from "@/components/mazrood/GithubPushCard";

export default function Settings() {
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await base44.auth.logout("/");
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[hsl(var(--background))]">
      <div className="light-leak" />
      <div className="safe-area-top relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-10 md:px-10 md:pb-36">
        <Link
          to="/"
          className="font-mono-tech inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[hsl(var(--foreground))] opacity-70 transition hover:opacity-100 hover:text-[hsl(var(--primary))]"
        >
          <ArrowLeft size={14} /> Back to the studio
        </Link>

        <h1 className="font-heading mt-10 text-4xl font-light tracking-[-0.01em] text-[hsl(var(--foreground))] md:text-5xl">
          Settings
        </h1>

        <ProfileCard />

        <div className="mt-6">
          <PasswordCard />
        </div>

        <GithubPushCard />

        <section
          aria-labelledby="delete-heading"
          className="mt-12 rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8"
        >
          <h2
            id="delete-heading"
            className="font-heading text-xl font-medium text-[hsl(var(--foreground))]"
          >
            Delete Account
          </h2>
          <p className="mt-3 font-body text-sm leading-relaxed text-[hsl(var(--foreground))] opacity-75">
            Permanently remove your Mazrood Studio account from this app. Your
            newsletter subscription and saved preferences are deleted, and you
            are signed out on this device. Orders placed on mazrood.com are
            unaffected — those live with the shop, not this app. This action
            cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="btn-solid mt-6 inline-flex items-center gap-2 rounded-sm px-6 py-3 font-mono-tech text-xs uppercase tracking-[0.25em]"
                style={{
                  background: "hsl(var(--destructive))",
                  color: "hsl(var(--destructive-foreground))",
                }}
              >
                <Trash2 size={14} /> Delete Account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your newsletter subscription and
                  saved preferences, and signs you out on this device. This
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my account</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
                  {deleting ? "Signing out…" : "Delete and sign out"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}