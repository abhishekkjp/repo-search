import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../tests/renderWithProviders";
import { SearchError, type SearchErrorKind } from "../api/errors";
import { ErrorState } from "./ErrorState";

const KINDS: SearchErrorKind[] = [
  "rate-limit",
  "invalid-query",
  "network",
  "unexpected-response",
  "server",
];

describe("ErrorState", () => {
  it.each(KINDS)("announces %s with a heading", (kind) => {
    renderWithProviders(
      <ErrorState error={new SearchError(kind)} onRetry={vi.fn()} />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("retries a network error when the button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderWithProviders(
      <ErrorState error={new SearchError("network")} onRetry={onRetry} />,
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("offers no retry for an invalid query", () => {
    renderWithProviders(
      <ErrorState error={new SearchError("invalid-query")} onRetry={vi.fn()} />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows a countdown and blocks retry until the limit resets", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const resetAt = new Date(Date.now() + 30_000);
    renderWithProviders(
      <ErrorState
        error={new SearchError("rate-limit", { resetAt })}
        onRetry={onRetry}
      />,
    );

    expect(
      screen.getByText("You can search again in 30 seconds."),
    ).toBeInTheDocument();

    const retry = screen.getByRole("button", { name: "Try again" });
    await user.click(retry);
    expect(onRetry).not.toHaveBeenCalled();
    expect(retry).toHaveAttribute("aria-disabled", "true");
  });

  it("allows an immediate retry when the reset time has passed", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderWithProviders(
      <ErrorState
        error={
          new SearchError("rate-limit", {
            resetAt: new Date(Date.now() - 1000),
          })
        }
        onRetry={onRetry}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows Japanese text when the saved language is Japanese", () => {
    localStorage.setItem("repo-search:locale", "ja");
    renderWithProviders(
      <ErrorState error={new SearchError("network")} onRetry={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", { name: "接続エラー" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "再試行" })).toBeInTheDocument();
  });
});
