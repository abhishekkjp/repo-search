/**
 * Every failure the search feature can produce, as a distinct type.
 * The UI picks its message and layout from `kind`, never from parsing strings.
 */
export type SearchErrorKind =
  | "rate-limit"
  | "invalid-query"
  | "network"
  | "unexpected-response"
  | "server";

  export class SearchError extends Error {
    readonly kind: SearchErrorKind;
    /** Only set for rate-limit errors: when the quota resets. */
    readonly resetAt: Date | null;
  
    constructor(
      kind: SearchErrorKind,
      options: { resetAt?: Date; cause?: unknown } = {},
    ) {
      // The message is for developers and logs only. Users see the
      // translated text from the dictionary, chosen by `kind`.
      super(`Search failed: ${kind}`, { cause: options.cause });
      this.name = "SearchError";
      this.kind = kind;
      this.resetAt = options.resetAt ?? null;
    }
  }

export function isSearchError(value: unknown): value is SearchError {
  return value instanceof SearchError;
}