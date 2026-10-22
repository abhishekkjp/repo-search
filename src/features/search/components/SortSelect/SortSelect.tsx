import { useId } from "react";
import { useLocale } from "../../../../i18n/useLocale";
import type { SortOption } from "../../api/githubClient";
import { SORTS } from "../../hooks/useSearchState";
import styles from "./SortSelect.module.css";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const { t } = useLocale();
  const id = useId();

  // Record<SortOption, …> fails to compile if a sort option has no label.
  const labels: Record<SortOption, string> = {
    "best-match": t.sort.bestMatch,
    stars: t.sort.stars,
    forks: t.sort.forks,
    updated: t.sort.updated,
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {t.sort.label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(event) => {
          const next = SORTS.find((sort) => sort === event.target.value);
          if (next !== undefined) onChange(next);
        }}
      >
        {SORTS.map((sort) => (
          <option key={sort} value={sort}>
            {labels[sort]}
          </option>
        ))}
      </select>
    </div>
  );
}
