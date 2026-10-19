import { useLocale } from "./i18n/useLocale";

export default function App() {
  const { t } = useLocale();

  return (
    <main>
      <h1>{t.app.title}</h1>
      <p>{t.app.description}</p>
    </main>
  );
}