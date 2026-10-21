import type { Repository, SearchResponse } from "../features/search/api/schema";

export function makeRepo(
  id: number,
  overrides: Partial<Repository> = {},
): Repository {
  return {
    id,
    name: `repo-${String(id)}`,
    full_name: `octo/repo-${String(id)}`,
    html_url: `https://github.com/octo/repo-${String(id)}`,
    description: `Description of repo ${String(id)}`,
    stargazers_count: 1200 + id,
    forks_count: 80 + id,
    language: "TypeScript",
    updated_at: "2026-10-18T09:00:00Z",
    owner: {
      login: "octo",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      html_url: "https://github.com/octo",
    },
    ...overrides,
  };
}

/** A response with `count` items on this page and `total` matches overall. */
export function makeResponse(count: number, total: number): SearchResponse {
  return {
    total_count: total,
    incomplete_results: false,
    items: Array.from({ length: count }, (_, index) => makeRepo(index + 1)),
  };
}
