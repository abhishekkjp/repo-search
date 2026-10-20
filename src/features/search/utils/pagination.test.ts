import { describe, expect, it } from "vitest";
import {
  clampPage,
  getPageItems,
  getResultRange,
  getTotalPages,
  isResultCapped,
  parsePage,
  type PageItem,
} from "./pagination";

const PER_PAGE = 30;

/** Compact form for assertions: numbers for pages, "…" for ellipses. */
function show(items: PageItem[]): (number | "…")[] {
  return items.map((item) => (item.kind === "page" ? item.page : "…"));
}

describe("getTotalPages", () => {
  it("rounds up partial pages", () => {
    expect(getTotalPages(31, PER_PAGE)).toBe(2);
  });

  it("returns 0 when there are no results", () => {
    expect(getTotalPages(0, PER_PAGE)).toBe(0);
  });

  it("caps at the 1,000 results GitHub will return", () => {
    expect(getTotalPages(5_000_000, PER_PAGE)).toBe(34);
  });
});

describe("isResultCapped", () => {
  it("is false at exactly 1,000", () => {
    expect(isResultCapped(1000)).toBe(false);
  });

  it("is true above 1,000", () => {
    expect(isResultCapped(1001)).toBe(true);
  });
});

describe("getResultRange", () => {
  it("covers a full first page", () => {
    expect(getResultRange(1, PER_PAGE, 500)).toEqual({ from: 1, to: 30 });
  });

  it("ends at the total on a partial last page", () => {
    expect(getResultRange(2, PER_PAGE, 45)).toEqual({ from: 31, to: 45 });
  });

  it("ends at 1,000 on the last reachable page of a huge result set", () => {
    expect(getResultRange(34, PER_PAGE, 5_000_000)).toEqual({
      from: 991,
      to: 1000,
    });
  });

  it("returns zeros for no results", () => {
    expect(getResultRange(1, PER_PAGE, 0)).toEqual({ from: 0, to: 0 });
  });
});

describe("clampPage", () => {
  it("keeps valid pages", () => {
    expect(clampPage(3, 10)).toBe(3);
  });

  it("raises too-small pages to 1", () => {
    expect(clampPage(0, 10)).toBe(1);
    expect(clampPage(-5, 10)).toBe(1);
  });

  it("lowers too-large pages to the last page", () => {
    expect(clampPage(99, 10)).toBe(10);
  });

  it("returns 1 when there are no pages", () => {
    expect(clampPage(4, 0)).toBe(1);
  });

  it("rejects NaN and Infinity", () => {
    expect(clampPage(Number.NaN, 10)).toBe(1);
    expect(clampPage(Number.POSITIVE_INFINITY, 10)).toBe(1);
  });

  it("truncates fractions", () => {
    expect(clampPage(2.9, 10)).toBe(2);
  });
});

describe("parsePage", () => {
  it("defaults to 1 when the parameter is missing", () => {
    expect(parsePage(null)).toBe(1);
  });

  it("accepts positive integers", () => {
    expect(parsePage("7")).toBe(7);
  });

  it.each(["abc", "", "0", "-3", "2.5"])("falls back to 1 for %j", (raw) => {
    expect(parsePage(raw)).toBe(1);
  });
});

describe("getPageItems", () => {
  it("returns nothing when there are no pages", () => {
    expect(getPageItems(1, 0)).toEqual([]);
  });

  it("returns a single page", () => {
    expect(show(getPageItems(1, 1))).toEqual([1]);
  });

  it("shows every page when they all fit", () => {
    expect(show(getPageItems(2, 5))).toEqual([1, 2, 3, 4, 5]);
  });

  it("puts an ellipsis before the last page when near the start", () => {
    expect(show(getPageItems(1, 34))).toEqual([1, 2, "…", 34]);
  });

  it("puts ellipses on both sides in the middle", () => {
    expect(show(getPageItems(17, 34))).toEqual([1, "…", 16, 17, 18, "…", 34]);
  });

  it("puts an ellipsis after the first page when near the end", () => {
    expect(show(getPageItems(34, 34))).toEqual([1, "…", 33, 34]);
  });

  it("fills a one-page gap instead of using an ellipsis", () => {
    expect(show(getPageItems(4, 10))).toEqual([1, 2, 3, 4, 5, "…", 10]);
  });

  it("gives every ellipsis a unique key", () => {
    const keys = getPageItems(17, 34)
      .filter((item) => item.kind === "ellipsis")
      .map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
