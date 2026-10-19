import { useContext } from "react";
import { LocaleContext, type LocaleContextValue } from "./LocaleContext";

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (value === null) {
    throw new Error("useLocale must be used inside <LocaleProvider>.");
  }
  return value;
}