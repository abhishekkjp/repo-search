/** GitHub documents a 256-character limit on search queries. */
export const MAX_QUERY_LENGTH = 256;

export type QueryValidation =
  { ok: true; query: string } | { ok: false; reason: "empty" | "too-long" };

/**
 * Normalizes and validates what the user typed.
 * Whitespace (including the full-width space used in Japanese) is trimmed
 * and collapsed, so “react  hooks” and “react hooks” share one cache entry.
 */
export function validateQuery(raw: string): QueryValidation {
  const query = raw.trim().replace(/\s+/g, " ");
  if (query === "") return { ok: false, reason: "empty" };
  if (query.length > MAX_QUERY_LENGTH) return { ok: false, reason: "too-long" };
  return { ok: true, query };
}
