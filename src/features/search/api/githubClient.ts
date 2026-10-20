import { SearchError } from "./errors";
import {
  GITHUB_SEARCH_RESULT_CAP,
  searchResponseSchema,
  type SearchResponse,
} from "./schema";

const SEARCH_ENDPOINT = "https://api.github.com/search/repositories";

export const PER_PAGE = 30;

export type SortOption = "best-match" | "stars" | "forks" | "updated";

export interface SearchParams {
  query: string;
  page: number;
  sort: SortOption;
}

function buildUrl({ query, page, sort }: SearchParams): string {
  const url = new URL(SEARCH_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(PER_PAGE));
  if (sort !== "best-match") {
    url.searchParams.set("sort", sort);
    url.searchParams.set("order", "desc");
  }
  return url.toString();
}

function readResetDate(headers: Headers): Date | undefined {
  const raw = headers.get("x-ratelimit-reset");
  if (raw === null) return undefined;
  const seconds = Number(raw);
  return Number.isFinite(seconds) ? new Date(seconds * 1000) : undefined;
}

function toSearchError(response: Response): SearchError {
  const isRateLimited =
    response.status === 429 ||
    (response.status === 403 &&
      response.headers.get("x-ratelimit-remaining") === "0");

  if (isRateLimited) {
    return new SearchError("rate-limit", {
      resetAt: readResetDate(response.headers),
    });
  }
  if (response.status === 422) {
    return new SearchError("invalid-query");
  }
  return new SearchError("server");
}

export async function searchRepositories(
  params: SearchParams,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  if (params.page * PER_PAGE - PER_PAGE >= GITHUB_SEARCH_RESULT_CAP) {
    throw new SearchError("invalid-query");
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(params), {
      signal,
      headers: { Accept: "application/vnd.github+json" },
    });
  } catch (cause) {
    if (signal?.aborted) throw cause; // cancellation is not an error to show
    throw new SearchError("network", { cause });
  }

  if (!response.ok) throw toSearchError(response);

  const parsed = searchResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new SearchError("unexpected-response", { cause: parsed.error });
  }
  return parsed.data;
}
