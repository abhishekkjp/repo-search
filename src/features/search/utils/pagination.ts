import { GITHUB_SEARCH_RESULT_CAP } from "../api/schema";

export type PageItem =
  | { kind: "page"; page: number }
  | { kind: "ellipsis"; key: string };

/** How many results the user can actually reach, whatever GitHub reports. */
export function getReachableCount(totalCount: number): number {
  return Math.min(totalCount, GITHUB_SEARCH_RESULT_CAP);
}

/** True when GitHub has more matches than it will let us page through. */
export function isResultCapped(totalCount: number): boolean {
  return totalCount > GITHUB_SEARCH_RESULT_CAP;
}

export function getTotalPages(totalCount: number, perPage: number): number {
  return Math.ceil(getReachableCount(totalCount) / perPage);
}

/** Keeps a page number inside 1…totalPages, and always returns an integer. */
export function clampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page)) return 1;
  const last = Math.max(totalPages, 1);
  return Math.min(Math.max(Math.trunc(page), 1), last);
}

/** Reads a page number from untrusted input such as a URL parameter. */
export function parsePage(raw: string | null): number {
  if (raw === null) return 1;
  const value = Number(raw);
  return Number.isInteger(value) && value >= 1 ? value : 1;
}

/** The 1-based range shown on a page, e.g. 991–1000 on the last page. */
export function getResultRange(
  page: number,
  perPage: number,
  totalCount: number,
): { from: number; to: number } {
  const reachable = getReachableCount(totalCount);
  if (reachable === 0) return { from: 0, to: 0 };
  return {
    from: (page - 1) * perPage + 1,
    to: Math.min(page * perPage, reachable),
  };
}

/**
 * The page links to render: first, last, and the current page with
 * `siblings` neighbours on each side. A gap of exactly one page is filled
 * with that page, because an ellipsis standing in for one number is wasteful.
 */
export function getPageItems(
  current: number,
  totalPages: number,
  siblings = 1,
): PageItem[] {
  if (totalPages < 1) return [];

  const wanted = new Set<number>([1, totalPages]);
  for (let page = current - siblings; page <= current + siblings; page++) {
    if (page >= 1 && page <= totalPages) wanted.add(page);
  }
  const pages = [...wanted].sort((a, b) => a - b);

  const items: PageItem[] = [];
  let previous: number | undefined;
  for (const page of pages) {
    if (previous !== undefined) {
      const gap = page - previous;
      if (gap === 2) {
        items.push({ kind: "page", page: previous + 1 });
      } else if (gap > 2) {
        items.push({ kind: "ellipsis", key: `after-${previous}` });
      }
    }
    items.push({ kind: "page", page });
    previous = page;
  }
  return items;
}