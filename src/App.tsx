import { SearchForm } from "./features/search/components/SearchForm";
import { useSearchState } from "./features/search/hooks/useSearchState";
import { LanguageToggle } from "./i18n/LanguageToggle";
import { useLocale } from "./i18n/useLocale";
import { ThemeToggle } from "./theme/ThemeToggle";
import { classNames } from "./utils/classNames";
import styles from "./App.module.css";
import { RepoCard } from "./features/search/components/RepoCard";
import type { Repository } from "./features/search/api/schema";

const SAMPLE: Repository = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  html_url: "https://github.com/facebook/react",
  description:
    "The library for web and native user interfaces. Build user interfaces out of individual pieces called components.",
  stargazers_count: 238412,
  forks_count: 48765,
  language: "JavaScript",
  updated_at: "2026-10-18T09:00:00Z",
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    html_url: "https://github.com/facebook",
  },
};

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
      {state.query !== "" && <RepoCard repo={SAMPLE} />}
    </>
  );
}
