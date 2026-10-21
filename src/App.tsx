import { SearchForm } from "./features/search/components/SearchForm";
import { useSearchState } from "./features/search/hooks/useSearchState";
import { LanguageToggle } from "./i18n/LanguageToggle";
import { useLocale } from "./i18n/useLocale";
import { ThemeToggle } from "./theme/ThemeToggle";
import { classNames } from "./utils/classNames";
import styles from "./App.module.css";

export default function App() {
  const { t } = useLocale();
  const { state, update } = useSearchState();

  return (
    <>
      <header className={styles.header}>
        <div className={classNames(styles.container, styles.controls)}>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className={classNames(styles.container, styles.main)}>
        <div className={styles.hero}>
          <h1 className={styles.title}>{t.app.title}</h1>
          <p className={styles.description}>{t.app.description}</p>
        </div>

        <SearchForm
          query={state.query}
          onSearch={(query) => {
            update({ query });
          }}
        />

        {state.query === "" && (
          <section className={styles.idle}>
            <h2>{t.status.idle.title}</h2>
            <p className={styles.idleBody}>{t.status.idle.body}</p>
          </section>
        )}
      </main>
    </>
  );
}
