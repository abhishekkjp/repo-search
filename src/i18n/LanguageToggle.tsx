import { SegmentedControl } from "../components/SegmentedControl";
import { useLocale } from "./useLocale";
import { LOCALES, type Locale } from "./locale";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  const labels: Record<Locale, string> = {
    en: t.settings.languageEnglish,
    ja: t.settings.languageJapanese,
  };

  return (
    <SegmentedControl
      label={t.settings.language}
      options={LOCALES.map((value) => ({
        value,
        label: labels[value],
        // Each language names itself in its own language.
        lang: value,
      }))}
      value={locale}
      onChange={setLocale}
    />
  );
}