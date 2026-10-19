import { en, type Dictionary } from "./en";
import { ja } from "./ja";

export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "repo-search:locale";

const dictionaries: Record<Locale, Dictionary> = { en, ja };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

/**
 * Picks the first supported language from a browser preference list.
 * "ja-JP" matches "ja"; "fr-FR" is skipped and the next entry is tried.
 */
export function matchLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const primary = tag.toLowerCase().split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

export function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    // Storage can be blocked (private mode, strict privacy settings).
    return null;
  }
}

export function writeStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Not persisting is acceptable; the choice still applies for this visit.
  }
}

/** Saved choice first, then the browser’s language list, then English. */
export function detectInitialLocale(): Locale {
  const stored = readStoredLocale();
  if (stored !== null) return stored;

  const preferred =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  return matchLocale(preferred);
}
