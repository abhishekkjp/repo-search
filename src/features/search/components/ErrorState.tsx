import { useLocale } from "../../../i18n/useLocale";
import type { SearchError } from "../api/errors";
import { useCountdown } from "../hooks/useCountdown";
import { formatNumber } from "../utils/format";
import { StatusMessage } from "./StatusMessage";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  error: SearchError;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { locale, t } = useLocale();
  const secondsLeft = useCountdown(error.resetAt);

  const copy = t.errors[error.kind];
  const isWaiting = error.kind === "rate-limit" && secondsLeft > 0;
  // A malformed query fails the same way every time, so retrying is pointless.
  const canRetry = error.kind !== "invalid-query";

  return (
    <StatusMessage
      title={copy.title}
      body={copy.body}
      tone="danger"
      role="alert"
    >
      {isWaiting && (
        <p className={styles.note}>
          {t.errors["rate-limit"].countdown(formatNumber(secondsLeft, locale))}
        </p>
      )}
      {canRetry && (
        <button
          type="button"
          aria-disabled={isWaiting}
          onClick={() => {
            if (!isWaiting) onRetry();
          }}
        >
          {t.errors.retry}
        </button>
      )}
    </StatusMessage>
  );
}
