import { useRef } from "react";
import { useLocale } from "../../../i18n/useLocale";
import { classNames } from "../../../utils/classNames";
import { PER_PAGE, type SortOption } from "../api/githubClient";
import type { SearchResponse } from "../api/schema";
import { formatNumber } from "../utils/format";
import {
  getReachableCount,
  getResultRange,
  isResultCapped,
} from "../utils/pagination";
import { Pagination } from "./Pagination";
import { RepoCard } from "./RepoCard";
import styles from "./ResultList.module.css";
import { SortSelect } from "./SortSelect";

interface ResultListProps {
  data: SearchResponse;
  page: number;
  totalPages: number;
  sort: SortOption;
  /** True while the next page loads and this one is still on screen. */
  isUpdating: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (sort: SortOption) => void;
}

export function ResultList({
  data,
  page,
  totalPages,
  sort,
  isUpdating,
  onPageChange,
  onSortChange,
}: ResultListProps) {
  const { locale, t } = useLocale();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { from, to } = getResultRange(page, PER_PAGE, data.total_count);
  const reachable = getReachableCount(data.total_count);

  function handlePageChange(next: number) {
    onPageChange(next);
    // Pagination sits below the list, so bring the new page into view.
    headingRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <section className={styles.section} aria-busy={isUpdating}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 ref={headingRef} className={styles.title}>
            {t.results.heading}
          </h2>
          <p className={styles.summary} aria-live="polite">
            {t.results.summary(
              formatNumber(from, locale),
              formatNumber(to, locale),
              formatNumber(reachable, locale),
            )}
          </p>
        </div>
        <SortSelect value={sort} onChange={onSortChange} />
      </div>

      {isResultCapped(data.total_count) && (
        <p className={styles.notice}>
          {t.results.capNotice(formatNumber(reachable, locale))}
        </p>
      )}

      <ul className={classNames(styles.list, isUpdating && styles.updating)}>
        {data.items.map((repo) => (
          <li key={repo.id}>
            <RepoCard repo={repo} />
          </li>
        ))}
      </ul>

      <Pagination
        current={page}
        totalPages={totalPages}
        isBusy={isUpdating}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
