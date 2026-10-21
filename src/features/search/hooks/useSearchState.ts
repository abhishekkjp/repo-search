import { useCallback, useSyncExternalStore } from "react";
import type { SortOption } from "../api/githubClient";
import { parsePage } from "../utils/pagination";

const SORTS: readonly SortOption[] = [
  "best-match",
  "stars",
  "forks",
  "updated",
];

export interface SearchState {
  query: string;
  sort: SortOption;
  page: number;
}

function isSort(value: unknown): value is SortOption {
  return SORTS.some((sort) => sort === value);
}

/** Reads the state from a URL query string. Bad values fall back to defaults. */
export function parseSearchState(search: string): SearchState {
  const params = new URLSearchParams(search);
  const sort = params.get("sort");
  return {
    query: (params.get("q") ?? "").trim(),
    sort: isSort(sort) ? sort : "best-match",
    page: parsePage(params.get("page")),
  };
}

/** Writes the state to a query string, omitting values that are defaults. */
export function serializeSearchState(state: SearchState): string {
  const params = new URLSearchParams();
  if (state.query !== "") params.set("q", state.query);
  if (state.sort !== "best-match") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  const text = params.toString();
  return text === "" ? "" : `?${text}`;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
  };
}

function getSnapshot(): string {
  return window.location.search;
}

export function useSearchState(): {
  state: SearchState;
  update: (next: Partial<SearchState>) => void;
} {
  const search = useSyncExternalStore(subscribe, getSnapshot);
  const state = parseSearchState(search);

  const update = useCallback((next: Partial<SearchState>) => {
    const current = parseSearchState(window.location.search);
    const merged = { ...current, ...next };
    // A new query or sort starts again from the first page.
    if (
      (next.query !== undefined && next.query !== current.query) ||
      (next.sort !== undefined && next.sort !== current.sort)
    ) {
      merged.page = next.page ?? 1;
    }
    const url = `${window.location.pathname}${serializeSearchState(merged)}`;
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return { state, update };
}
