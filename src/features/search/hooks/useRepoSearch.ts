import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PER_PAGE, searchRepositories } from "../api/githubClient";
import { isSearchError, type SearchError } from "../api/errors";
import type { SearchResponse } from "../api/schema";
import { getTotalPages } from "../utils/pagination";
import type { SearchState } from "./useSearchState";

export interface RepoSearchResult {
  data: SearchResponse | undefined;
  error: SearchError | null;
  /** True only for the very first load, when there is nothing to show yet. */
  isInitialLoading: boolean;
  /** True while a new page loads and the previous page is still on screen. */
  isUpdating: boolean;
  totalPages: number;
  /** False when the query is empty and no request is made. */
  isEnabled: boolean;
  refetch: () => void;
}

export function useRepoSearch({
  query,
  sort,
  page,
}: SearchState): RepoSearchResult {
  const isEnabled = query !== "";

  const result = useQuery({
    queryKey: ["repositories", { query, sort, page }],
    queryFn: ({ signal }) => searchRepositories({ query, sort, page }, signal),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
  });

  const error = isSearchError(result.error) ? result.error : null;

  return {
    data: result.data,
    error,
    isInitialLoading: isEnabled && result.isPending && !result.isError,
    isUpdating: result.isPlaceholderData,
    totalPages: result.data
      ? getTotalPages(result.data.total_count, PER_PAGE)
      : 0,
    isEnabled,
    refetch: () => {
      void result.refetch();
    },
  };
}
