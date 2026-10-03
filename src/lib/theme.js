export const THEME_KEY = "mazrood-theme";

export const getSavedTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    // no explicit choice yet — follow the system preference on first load
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
  } catch {
    /* storage unavailable */
  }
  return "dark";
};

export const applyTheme = (mode) => {
  document.documentElement.classList.toggle("light-mode", mode === "light");
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* storage unavailable — theme just won't persist */
  }
};