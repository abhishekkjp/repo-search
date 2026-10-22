import { useLocale } from "../../../../i18n/useLocale";
import { classNames } from "../../../../utils/classNames";
import { formatNumber } from "../../utils/format";
import { getPageItems } from "../../utils/pagination";
import styles from "./Pagination.module.css";

interface PaginationProps {
  current: number;
  totalPages: number;
  /** True while a page is loading: buttons are inert so clicks can't pile up. */
  isBusy: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  current,
  totalPages,
  isBusy,
  onPageChange,
}: PaginationProps) {
  const { locale, t } = useLocale();

  if (totalPages <= 1) return null;

  const items = getPageItems(current, totalPages);
  const isFirst = current <= 1;
  const isLast = current >= totalPages;

  function go(page: number) {
    if (!isBusy) onPageChange(page);
  }

  return (
    <nav aria-label={t.pagination.label} className={styles.nav}>
      <button
        type="button"
        className={styles.step}
        disabled={isFirst}
        aria-disabled={isBusy}
        onClick={() => {
          go(current - 1);
        }}
      >
        {t.pagination.previous}
      </button>

      {/* Narrow screens: the compact summary replaces the number list. */}
      <p className={styles.summary} aria-live="polite">
        {t.pagination.pageOf(
          formatNumber(current, locale),
          formatNumber(totalPages, locale),
        )}
      </p>

      <ol className={styles.pages}>
        {items.map((item) =>
          item.kind === "ellipsis" ? (
            <li key={item.key} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item.page}>
              <button
                type="button"
                className={classNames(
                  styles.page,
                  item.page === current && styles.current,
                )}
                aria-current={item.page === current ? "page" : undefined}
                aria-label={
                  item.page === current
                    ? t.pagination.currentPage(formatNumber(item.page, locale))
                    : t.pagination.goToPage(formatNumber(item.page, locale))
                }
                aria-disabled={isBusy}
                onClick={() => {
                  go(item.page);
                }}
              >
                {formatNumber(item.page, locale)}
              </button>
            </li>
          ),
        )}
      </ol>

      <button
        type="button"
        className={styles.step}
        disabled={isLast}
        aria-disabled={isBusy}
        onClick={() => {
          go(current + 1);
        }}
      >
        {t.pagination.next}
      </button>
    </nav>
  );
}
