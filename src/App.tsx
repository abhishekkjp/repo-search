import { LanguageToggle } from "./i18n/LanguageToggle";
import { useLocale } from "./i18n/useLocale";
import { ThemeToggle } from "./theme/ThemeToggle";

export default function App() {
  const { t } = useLocale();

  return (
    <>
      <header>
        <LanguageToggle />
        <ThemeToggle />
      </header>
      <main>
        <h1>{t.app.title}</h1>
        <p>{t.app.description}</p>
      </main>
    </>
  );
}