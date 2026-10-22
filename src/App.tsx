import styles from "./App.module.css";
import { SearchForm } from "./features/search/components/SearchForm/SearchForm";
import { SearchResults } from "./features/search/components/SearchResults/SearchResults";
import { useSearchState } from "./features/search/hooks/useSearchState";
import { LanguageToggle } from "./i18n/LanguageToggle";
import { useLocale } from "./i18n/useLocale";
import { ThemeToggle } from "./theme/ThemeToggle";
import { classNames } from "./utils/classNames";

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

        <SearchResults state={state} update={update} />
      </main>
    </>
  );
}
