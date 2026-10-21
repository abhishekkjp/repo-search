import { useId, useRef, useState, type SubmitEvent } from "react";
import { useLocale } from "../../../i18n/useLocale";
import { MAX_QUERY_LENGTH, validateQuery } from "../utils/validateQuery";
import styles from "./SearchForm.module.css";

interface SearchFormProps {
  /** The query currently applied, from the URL. */
  query: string;
  onSearch: (query: string) => void;
}

type FieldError = "empty" | "too-long";

export function SearchForm({ query, onSearch }: SearchFormProps) {
  const { t } = useLocale();
  const [value, setValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  const [error, setError] = useState<FieldError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();

  // The URL changed from outside (Back button, shared link): follow it.
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setValue(query);
    setError(null);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateQuery(value);
    if (!result.ok) {
      setError(result.reason);
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setValue(result.query);
    onSearch(result.query);
  }

  function handleClear() {
    setValue("");
    setError(null);
    inputRef.current?.focus();
  }

  const errorText =
    error === "empty"
      ? t.search.errorEmpty
      : error === "too-long"
        ? t.search.errorTooLong(String(MAX_QUERY_LENGTH))
        : null;

  return (
    <form
      role="search"
      noValidate
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <label htmlFor={inputId} className={styles.label}>
        {t.search.label}
      </label>

      <div className={styles.row}>
        <div className={styles.field}>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            className={styles.input}
            value={value}
            placeholder={t.search.placeholder}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-invalid={errorText !== null}
            aria-describedby={errorText !== null ? errorId : undefined}
            onChange={(event) => {
              setValue(event.target.value);
              if (error !== null) setError(null);
            }}
          />
          {value !== "" && (
            <button
              type="button"
              className={styles.clear}
              aria-label={t.search.clear}
              onClick={handleClear}
            >
              <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </button>
          )}
        </div>

        <button type="submit" className={styles.submit}>
          {t.search.submit}
        </button>
      </div>

      {errorText !== null && (
        <p id={errorId} role="alert" className={styles.error}>
          {errorText}
        </p>
      )}
    </form>
  );
}
