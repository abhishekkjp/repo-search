export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/**
 * Must match the key read by the inline script in index.html,
 * which runs before the app loads and cannot import this file.
 */
export const THEME_STORAGE_KEY = "repo-search:theme";

export function isTheme(value: unknown): value is Theme {
  return THEMES.some((theme) => theme === value);
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function writeStoredTheme(theme: Theme): void {
  try {
    if (theme === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Not persisting is acceptable; the choice still applies for this visit.
  }
}

/** "system" removes the attribute so the OS preference takes over. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}
