import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getSavedTheme } from "@/lib/theme";

export default function ThemeToggle({ className = "" }) {
  const [mode, setMode] = useState(getSavedTheme());

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-sm transition hover:opacity-100 hover:text-[hsl(var(--primary))] ${className}`}
    >
      {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}