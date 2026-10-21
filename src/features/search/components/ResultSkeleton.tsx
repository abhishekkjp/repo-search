import { useLocale } from "../../../i18n/useLocale";
import styles from "./ResultSkeleton.module.css";

const PLACEHOLDER_COUNT = 5;

export function ResultSkeleton() {
  const { t } = useLocale();

  return (
    <div role="status">
      <p className={styles.label}>{t.status.loading}</p>
      <ul className={styles.list} aria-hidden="true">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <li key={index} className={styles.card}>
            <span className={styles.lineShort} />
            <span className={styles.lineTitle} />
            <span className={styles.lineLong} />
            <span className={styles.lineMeta} />
          </li>
        ))}
      </ul>
    </div>
  );
}
