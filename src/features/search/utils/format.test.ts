import { describe, expect, it } from "vitest";
import {
  formatCompactNumber,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "./format";

const NOW = new Date("2025-06-15T12:00:00Z");

describe("formatNumber", () => {
  it("groups digits in English", () => {
    expect(formatNumber(1234567, "en")).toBe("1,234,567");
  });

  it("groups digits in Japanese", () => {
    expect(formatNumber(1234567, "ja")).toBe("1,234,567");
  });
});

describe("formatCompactNumber", () => {
  it("abbreviates thousands in English", () => {
    expect(formatCompactNumber(12345, "en")).toBe("12.3K");
  });

  it("uses 万 for ten-thousands in Japanese", () => {
    expect(formatCompactNumber(12345, "ja")).toBe("1.2万");
  });

  it("leaves small numbers alone", () => {
    expect(formatCompactNumber(950, "en")).toBe("950");
  });
});

describe("formatRelativeTime", () => {
  it("says yesterday in English", () => {
    expect(formatRelativeTime("2025-06-14T12:00:00Z", "en", NOW)).toBe(
      "yesterday",
    );
  });

  it("says 昨日 in Japanese", () => {
    expect(formatRelativeTime("2025-06-14T12:00:00Z", "ja", NOW)).toBe("昨日");
  });

  it("counts days", () => {
    expect(formatRelativeTime("2025-06-12T12:00:00Z", "en", NOW)).toBe(
      "3 days ago",
    );
    // Newer ICU data puts a space between the digit and 日; older data does not.
    expect(formatRelativeTime("2025-06-12T12:00:00Z", "ja", NOW)).toMatch(
      /^3\s?日前$/,
    );
  });

  it("truncates instead of rounding up", () => {
    // 90 minutes ago is 1 hour, not 2.
    expect(formatRelativeTime("2025-06-15T10:30:00Z", "en", NOW)).toBe(
      "1 hour ago",
    );
  });

  it("uses months and years for older dates", () => {
    expect(formatRelativeTime("2025-03-15T12:00:00Z", "en", NOW)).toBe(
      "3 months ago",
    );
    expect(formatRelativeTime("2023-06-15T12:00:00Z", "en", NOW)).toBe(
      "2 years ago",
    );
  });

  it("handles times under a minute", () => {
    expect(formatRelativeTime("2025-06-15T11:59:50Z", "en", NOW)).toBe(
      "now",
    );
  });

  it("returns the original text for an invalid date", () => {
    expect(formatRelativeTime("not a date", "en", NOW)).toBe("not a date");
  });
});

describe("formatDate", () => {
  it("formats in English", () => {
    expect(formatDate("2025-03-04T12:00:00Z", "en")).toBe("Mar 4, 2025");
  });

  it("formats in Japanese", () => {
    expect(formatDate("2025-03-04T12:00:00Z", "ja")).toBe("2025/03/04");
  });

  it("returns the original text for an invalid date", () => {
    expect(formatDate("nope", "en")).toBe("nope");
  });
});