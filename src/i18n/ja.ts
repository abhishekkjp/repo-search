import type { Dictionary } from "./en";

/**
 * Japanese dictionary.
 */
export const ja: Dictionary = {
  app: {
    title: "リポジトリ検索",
    description: "GitHubの公開リポジトリを検索します。",
  },

  search: {
    label: "リポジトリを検索",
    placeholder: "例：「react hooks language:typescript」",
    submit: "検索",
    clear: "検索をクリア",
  },

  sort: {
    label: "並び替え",
    bestMatch: "ベストマッチ", // [CHECK] GitHub's own term for "Best match"
    stars: "スター数順",
    forks: "フォーク数順",
    updated: "更新日順", // [CHECK] "Recently updated"; may want 最近更新された順
  },

  results: {
    // Japanese puts the total first: "1,000件中1～30件を表示"
    summary: (from, to, total) => `${total}件中${from}～${to}件を表示`,
    capNotice: (cap) =>
      `GitHubでは、1回の検索で取得できるのは最初の${cap}件までです。検索条件を絞り込んでください。`,
    noDescription: "説明はありません。",
    updated: (when) => `${when}に更新`,
    starsLabel: (count) => `${count}個のスター`, // [CHECK] screen-reader label
    forksLabel: (count) => `${count}個のフォーク`, // [CHECK] screen-reader label
    ownerAvatarAlt: (owner) => `${owner}のアバター`,
  },

  pagination: {
    label: "ページ送り", // [CHECK] accessible name of the <nav>
    previous: "前へ",
    next: "次へ",
    pageOf: (current, total) => `${total}ページ中${current}ページ目`,
    goToPage: (page) => `${page}ページ目へ移動`,
    currentPage: (page) => `${page}ページ目（現在のページ）`,
  },

  status: {
    loading: "読み込み中…",
    idle: {
      title: "GitHubを検索",
      body: "キーワードを入力して、公開リポジトリを探しましょう。",
    },
    empty: {
      title: "リポジトリが見つかりません",
      body: (query) =>
        `「${query}」に一致する結果はありませんでした。スペルを確認するか、キーワードを減らしてみてください。`,
    },
  },

  errors: {
    "rate-limit": {
      title: "検索回数の上限に達しました",
      body: "GitHubの検索回数の上限に達しました。しばらく待ってから、もう一度お試しください。",
      countdown: (seconds) => `${seconds}秒後に再度検索できます。`,
    },
    "invalid-query": {
      title: "検索条件が正しくありません",
      body: "検索条件を認識できませんでした。書式を確認して、もう一度お試しください。", // [CHECK] tone
    },
    network: {
      title: "接続エラー",
      body: "GitHubに接続できませんでした。ネットワーク接続を確認して、もう一度お試しください。",
    },
    "unexpected-response": {
      title: "予期しない応答",
      body: "GitHubから想定外のデータが返されました。もう一度お試しください。", // [CHECK] wording
    },
    server: {
      title: "GitHubを利用できません",
      body: "GitHubで問題が発生しています。しばらくしてから、もう一度お試しください。",
    },
    retry: "再試行",
  },

  settings: {
    language: "言語",
    languageEnglish: "English",
    languageJapanese: "日本語",
    theme: "テーマ",
    themeSystem: "システム", // [CHECK] GitHub uses a longer phrase; short form fits a button
    themeLight: "ライト",
    themeDark: "ダーク",
  },
};