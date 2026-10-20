import styles from "./SegmentedControl.module.css";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Set when the label is in a different language from the page. */
  lang?: string;
}

interface SegmentedControlProps<T extends string> {
  /** Accessible name of the whole group, e.g. “Theme”. */
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={styles.group}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.lang}
          aria-pressed={option.value === value}
          className={styles.button}
          onClick={() => {
            onChange(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}