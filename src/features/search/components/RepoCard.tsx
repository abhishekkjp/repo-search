import { useLocale } from "../../../i18n/useLocale";
import type { Repository } from "../api/schema";
import {
  formatCompactNumber,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "../utils/format";
import styles from "./RepoCard.module.css";

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  const { locale, t } = useLocale();

  return (
    <article className={styles.card}>
      <div className={styles.owner}>
        <img
          src={repo.owner.avatar_url}
          alt=""
          width="24"
          height="24"
          loading="lazy"
          className={styles.avatar}
        />
        <span>{repo.owner.login}</span>
      </div>

      <h3 className={styles.name}>
        <a href={repo.html_url} className={styles.link}>
          {repo.name}
        </a>
      </h3>

      <p
        className={
          repo.description === null ? styles.noDescription : styles.description
        }
      >
        {repo.description ?? t.results.noDescription}
      </p>

      <ul className={styles.meta}>
        {repo.language !== null && <li>{repo.language}</li>}

        <li className={styles.stat}>
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 1.5l2 4.5 4.5.5-3.4 3 1 4.5L8 11.6 3.9 14l1-4.5-3.4-3L6 6z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
          </svg>
          <span aria-hidden="true">
            {formatCompactNumber(repo.stargazers_count, locale)}
          </span>
          <span className={styles.srOnly}>
            {t.results.starsLabel(formatNumber(repo.stargazers_count, locale))}
          </span>
        </li>

        <li className={styles.stat}>
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.25">
              <circle cx="4" cy="3" r="1.5" />
              <circle cx="12" cy="3" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
              <path
                d="M4 4.5V6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4.5M8 8v3.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
          <span aria-hidden="true">
            {formatCompactNumber(repo.forks_count, locale)}
          </span>
          <span className={styles.srOnly}>
            {t.results.forksLabel(formatNumber(repo.forks_count, locale))}
          </span>
        </li>

        <li>
          <time
            dateTime={repo.updated_at}
            title={formatDate(repo.updated_at, locale)}
          >
            {t.results.updated(formatRelativeTime(repo.updated_at, locale))}
          </time>
        </li>
      </ul>
    </article>
  );
}
