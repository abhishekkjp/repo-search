import { useEffect } from "react";
import { useLocale } from "../../../../i18n/useLocale";
import { PER_PAGE } from "../../api/githubClient";
import { GITHUB_SEARCH_RESULT_CAP } from "../../api/schema";
import { useRepoSearch } from "../../hooks/useRepoSearch";
import type { SearchState } from "../../hooks/useSearchState";
import { clampPage, getTotalPages } from "../../utils/pagination";
import { ErrorState } from "../ErrorState/ErrorState";
import { ResultList } from "../ResultList/ResultList";
import { ResultSkeleton } from "../ResultSkeleton/ResultSkeleton";
import { StatusMessage } from "../StatusMessage/StatusMessage";

const MAX_PAGE = getTotalPages(GITHUB_SEARCH_RESULT_CAP, PER_PAGE);

interface SearchResultsProps {
  state: SearchState;
  update: (next: Partial<SearchState>, options?: { replace?: boolean }) => void;
}

export function SearchResults({ state, update }: SearchResultsProps) {
  const { t } = useLocale();

  // Never request a page GitHub would refuse, whatever the URL says.
  const page = clampPage(state.page, MAX_PAGE);
  const search = useRepoSearch({ ...state, page });

  // Once real data arrives, the true last page is known. Fix a URL that
  // points past it. Skipped while placeholder data from a previous search
  // is showing, because its page count belongs to a different query.
  const hasFreshData =
    search.data !== undefined && !search.isUpdating && search.totalPages > 0;
  const targetPage = hasFreshData
    ? clampPage(state.page, search.totalPages)
    : page;

  useEffect(() => {
    if (targetPage !== state.page)
      update({ page: targetPage }, { replace: true });
  }, [targetPage, state.page, update]);

  if (!search.isEnabled) {
    return (
      <StatusMessage title={t.status.idle.title} body={t.status.idle.body} />
    );
  }

  if (search.error !== null) {
    return <ErrorState error={search.error} onRetry={search.refetch} />;
  }

  if (search.isInitialLoading) return <ResultSkeleton />;

  if (search.data === undefined) return null;

  if (search.data.total_count === 0) {
    return (
      <StatusMessage
        title={t.status.empty.title}
        body={t.status.empty.body(state.query)}
      />
    );
  }

  // The URL points past the last page; the effect above is correcting it.
  if (search.data.items.length === 0) return null;

  return (
    <ResultList
      data={search.data}
      page={targetPage}
      totalPages={search.totalPages}
      sort={state.sort}
      isUpdating={search.isUpdating}
      onPageChange={(next) => {
        update({ page: next });
      }}
      onSortChange={(sort) => {
        update({ sort });
      }}
    />
  );
}
