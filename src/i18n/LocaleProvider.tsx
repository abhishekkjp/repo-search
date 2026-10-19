import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
    type ReactNode,
  } from "react";
  import { LocaleContext, type LocaleContextValue } from "./LocaleContext";
  import {
    detectInitialLocale,
    getDictionary,
    writeStoredLocale,
    type Locale,
  } from "./locale";
  
  export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);
  
    const t = getDictionary(locale);
  
    // Keep the document in sync so fonts, hyphenation, and screen readers
    // use the right language, and the browser tab shows a translated title.
    useLayoutEffect(() => {
      document.documentElement.lang = locale;
      document.title = t.app.title;
    }, [locale, t]);
  
    const setLocale = useCallback((next: Locale) => {
      writeStoredLocale(next);
      setLocaleState(next);
    }, []);
  
    const value = useMemo<LocaleContextValue>(
      () => ({ locale, setLocale, t }),
      [locale, setLocale, t],
    );
  
    return (
      <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    );
  }