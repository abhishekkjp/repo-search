import { SegmentedControl } from "../components/SegmentedControl";
import { useLocale } from "../i18n/useLocale";
import { THEMES, type Theme } from "./theme";
import { useTheme } from "./useTheme";

export function ThemeToggle() {
  const { t } = useLocale();
  const { theme, setTheme } = useTheme();

  // Record<Theme, …> fails to compile if a theme has no label.
  const labels: Record<Theme, string> = {
    system: t.settings.themeSystem,
    light: t.settings.themeLight,
    dark: t.settings.themeDark,
  };

  return (
    <SegmentedControl
      label={t.settings.theme}
      options={THEMES.map((value) => ({ value, label: labels[value] }))}
      value={theme}
      onChange={setTheme}
    />
  );
}