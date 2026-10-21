/**
 * English dictionary. This file defines the shape of every dictionary:
 * other languages are typed as `Dictionary`, so a missing key is a compile error.
 *
 * Rules for strings:
 * - Numbers and dates arrive already formatted (via Intl), never raw.
 * - Use typographic punctuation: ’ “ ” … and en dashes for ranges.
 * - Keys under `errors` match `SearchErrorKind` exactly.
 */
export const en = {
  app: {
    title: "Repository search",
    description: "Search public GitHub repositories.",
  },

  search: {
    label: "Search repositories",
    placeholder: "Try “react hooks language:typescript”",
    submit: "Search",
    clear: "Clear search",
    errorEmpty: "Enter a keyword to search.",
    errorTooLong: (max: string): string =>
      `That search is too long. Use ${max} characters or fewer.`,
  },

  sort: {
    label: "Sort by",
    bestMatch: "Best match",
    stars: "Most stars",
    forks: "Most forks",
    updated: "Recently updated",
  },

  results: {
    /** e.g. "1–30 of 1,000 results" */
    summary: (from: string, to: string, total: string): string =>
      `${from}–${to} of ${total} results`,
    /** Shown when GitHub has more matches than it will let us page through. */
    capNotice: (cap: string): string =>
      `GitHub only returns the first ${cap} results for a search. Try a more specific query to narrow them down.`,
    noDescription: "No description provided.",
    updated: (when: string): string => `Updated ${when}`,
    starsLabel: (count: string): string => `${count} stars`,
    forksLabel: (count: string): string => `${count} forks`,
    ownerAvatarAlt: (owner: string): string => `Avatar of ${owner}`,
  },

  pagination: {
    label: "Pagination",
    previous: "Previous",
    next: "Next",
    pageOf: (current: string, total: string): string =>
      `Page ${current} of ${total}`,
    goToPage: (page: string): string => `Go to page ${page}`,
    currentPage: (page: string): string => `Page ${page}, current page`,
  },

  status: {
    loading: "Loading results…",
    idle: {
      title: "Search GitHub",
      body: "Enter a keyword to find public repositories.",
    },
    empty: {
      title: "No repositories found",
      body: (query: string): string =>
        `Nothing matched “${query}”. Check the spelling or try fewer keywords.`,
    },
  },

  errors: {
    "rate-limit": {
      title: "Search limit reached",
      body: "You’ve reached GitHub’s search limit. Please wait a moment and try again.",
      /** Shown while counting down to the reset time. */
      countdown: (seconds: string): string =>
        `You can search again in ${seconds} seconds.`,
    },
    "invalid-query": {
      title: "Invalid search",
      body: "GitHub couldn’t understand that search. Check the syntax and try again.",
    },
    network: {
      title: "Connection problem",
      body: "Couldn’t reach GitHub. Check your connection and try again.",
    },
    "unexpected-response": {
      title: "Unexpected response",
      body: "GitHub sent data we didn’t expect. Please try again.",
    },
    server: {
      title: "GitHub is unavailable",
      body: "GitHub is having trouble right now. Please try again shortly.",
    },
    retry: "Try again",
  },

  settings: {
    language: "Language",
    languageEnglish: "English",
    languageJapanese: "日本語",
    theme: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
  },
};

export type Dictionary = typeof en;
