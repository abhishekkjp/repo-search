import { createContext } from "react";
import type { Dictionary } from "./en";
import type { Locale } from "./locale";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** The active dictionary. Components read UI text from here. */
  t: Dictionary;
}

/** `null` means “no provider above this component”, which `useLocale` reports. */
export const LocaleContext = createContext<LocaleContextValue | null>(null);
