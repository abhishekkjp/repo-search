import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import App from "./App";
import { makeResponse } from "./tests/fixtures";
import { renderWithProviders } from "./tests/renderWithProviders";
import { server } from "./tests/server";

const SEARCH_URL = "https://api.github.com/search/repositories";

async function searchFor(query: string) {
  const user = userEvent.setup();
  await user.type(
    screen.getByRole("searchbox", { name: "Search repositories" }),
    `${query}{Enter}`,
  );
  return user;
}

describe("App search flow", () => {
  it("shows the idle message before any search", () => {
    renderWithProviders(<App />);
    expect(screen.getByText("Search GitHub")).toBeInTheDocument();
  });

  it("searches, validates and renders results, with the cap notice", async () => {
    server.use(
      http.get(SEARCH_URL, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("q")).toBe("react");
        expect(url.searchParams.get("per_page")).toBe("30");
        return HttpResponse.json(makeResponse(30, 5_000_000));
      }),
    );
    renderWithProviders(<App />);
    await searchFor("react");

    expect(await screen.findByText("repo-1")).toBeInTheDocument();
    expect(screen.getByText("1–30 of 1,000 results")).toBeInTheDocument();
    expect(
      screen.getByText(/only returns the first 1,000/),
    ).toBeInTheDocument();
    expect(window.location.search).toBe("?q=react");
  });

  it("requests the next page and keeps the URL in sync", async () => {
    const pages: string[] = [];
    server.use(
      http.get(SEARCH_URL, ({ request }) => {
        pages.push(new URL(request.url).searchParams.get("page") ?? "");
        return HttpResponse.json(makeResponse(30, 500));
      }),
    );
    renderWithProviders(<App />);
    const user = await searchFor("react");
    await screen.findByText("repo-1");

    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(pages).toEqual(["1", "2"]);
    });
    expect(window.location.search).toBe("?q=react&page=2");
  });

  it("sends the chosen sort to GitHub and returns to page 1", async () => {
    const calls: { sort: string | null; page: string | null }[] = [];
    server.use(
      http.get(SEARCH_URL, ({ request }) => {
        const params = new URL(request.url).searchParams;
        calls.push({ sort: params.get("sort"), page: params.get("page") });
        return HttpResponse.json(makeResponse(30, 500));
      }),
    );
    renderWithProviders(<App />);
    const user = await searchFor("react");
    await screen.findByText("repo-1");

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort by" }),
      "Most stars",
    );

    await waitFor(() => {
      expect(calls.at(-1)).toEqual({ sort: "stars", page: "1" });
    });
    expect(window.location.search).toBe("?q=react&sort=stars");
  });

  it("shows an empty state for a search with no matches", async () => {
    server.use(
      http.get(SEARCH_URL, () => HttpResponse.json(makeResponse(0, 0))),
    );
    renderWithProviders(<App />);
    await searchFor("zzqqxx");

    expect(
      await screen.findByText("No repositories found"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nothing matched “zzqqxx”/)).toBeInTheDocument();
  });

  it("shows the rate-limit message with a countdown", async () => {
    const reset = String(Math.floor(Date.now() / 1000) + 45);
    server.use(
      http.get(SEARCH_URL, () =>
        HttpResponse.json(
          { message: "rate limit exceeded" },
          {
            status: 403,
            headers: {
              "x-ratelimit-remaining": "0",
              "x-ratelimit-reset": reset,
            },
          },
        ),
      ),
    );
    renderWithProviders(<App />);
    await searchFor("react");

    expect(await screen.findByText("Search limit reached")).toBeInTheDocument();
    expect(
      screen.getByText(/You can search again in \d+ seconds\./),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("explains an invalid query and offers no retry", async () => {
    server.use(
      http.get(SEARCH_URL, () =>
        HttpResponse.json({ message: "Validation Failed" }, { status: 422 }),
      ),
    );
    renderWithProviders(<App />);
    await searchFor("stars:>>");

    expect(await screen.findByText("Invalid search")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();
  });

  it("reports a network failure, and Try again recovers", async () => {
    server.use(http.get(SEARCH_URL, () => HttpResponse.error()));
    renderWithProviders(<App />);
    const user = await searchFor("react");

    expect(await screen.findByText("Connection problem")).toBeInTheDocument();

    server.use(
      http.get(SEARCH_URL, () => HttpResponse.json(makeResponse(30, 100))),
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("repo-1")).toBeInTheDocument();
  });

  it("rejects data that does not match the schema", async () => {
    server.use(
      http.get(SEARCH_URL, () => HttpResponse.json({ total_count: "many" })),
    );
    renderWithProviders(<App />);
    await searchFor("react");

    expect(await screen.findByText("Unexpected response")).toBeInTheDocument();
  });

  it("corrects a page number past the last page in the URL", async () => {
    window.history.replaceState(null, "", "/?q=react&page=999");
    server.use(
      http.get(SEARCH_URL, ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get("page"));
        // 45 matches means 2 pages. Anything past that is empty.
        return HttpResponse.json(
          page <= 2
            ? makeResponse(page === 1 ? 30 : 15, 45)
            : makeResponse(0, 45),
        );
      }),
    );
    renderWithProviders(<App />);

    expect(await screen.findByText("repo-1")).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.search).toBe("?q=react&page=2");
    });
  });
});
