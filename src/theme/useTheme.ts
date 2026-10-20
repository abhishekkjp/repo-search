import { useCallback, useState } from "react";
import {
  applyTheme,
  readStoredTheme,
  writeStoredTheme,
  type Theme,
} from "./theme";

export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    writeStoredTheme(next);
    setThemeState(next);
  }, []);

  return { theme, setTheme };
}
