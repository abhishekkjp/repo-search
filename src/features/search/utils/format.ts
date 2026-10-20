import type { Locale } from "../../../i18n/locale";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/** Ordered largest to smallest; the first unit that fits is used. */
const UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", YEAR],
  ["month", MONTH],
  ["week", WEEK],
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
];

/** 1234567 → "1,234,567" in both English and Japanese. */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Compact form for large counts: 12,345 → "12K" (en) or "1.2万" (ja).
 * Japanese groups digits by 10,000 (万), not 1,000, and Intl knows this.
 */
export function formatCompactNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * "3 days ago" (en) or "3日前" (ja). `now` is a parameter so tests
 * do not depend on the real clock.
 */
export function formatRelativeTime(
  iso: string,
  locale: Locale,
  now: Date = new Date(),
): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return iso;

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const seconds = Math.round((then.getTime() - now.getTime()) / 1000);
  const magnitude = Math.abs(seconds);

  for (const [unit, size] of UNITS) {
    if (magnitude >= size) {
      return formatter.format(Math.trunc(seconds / size), unit);
    }
  }
  return formatter.format(0, "second");
}

/** Absolute date for tooltips: "Mar 4, 2025" (en) or "2025年3月4日" (ja). */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}
