export const THEME_KEY = "mazrood-theme";

export const getSavedTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};

export const applyTheme = (mode) => {
  document.documentElement.classList.toggle("light-mode", mode === "light");
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* storage unavailable — theme just won't persist */
  }
};