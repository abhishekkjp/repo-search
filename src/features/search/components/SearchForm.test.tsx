import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getViolations } from "../../../tests/axe";
import { renderWithProviders } from "../../../tests/renderWithProviders";
import { SearchForm } from "./SearchForm";

function getInput() {
  return screen.getByRole("searchbox", { name: "Search repositories" });
}
describe("SearchForm", () => {
  it("submits a trimmed, whitespace-collapsed query on Enter", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    renderWithProviders(<SearchForm query="" onSearch={onSearch} />);

    await user.type(getInput(), "  react   hooks{Enter}");

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("react hooks");
  });

  it("explains an empty search instead of submitting it", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    renderWithProviders(<SearchForm query="" onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a keyword to search.",
    );
    expect(getInput()).toBeInvalid();
    expect(getInput()).toHaveFocus();
  });

  it("rejects a query over the length limit", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    renderWithProviders(<SearchForm query="" onSearch={onSearch} />);

    await user.click(getInput());
    await user.paste("a".repeat(257));
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "That search is too long. Use 256 characters or fewer.",
    );
  });

  it("clears the error as soon as the user types again", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm query="" onSearch={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.type(getInput(), "r");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("empties the field with the clear button and keeps focus", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchForm query="" onSearch={vi.fn()} />);

    await user.type(getInput(), "react");
    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(getInput()).toHaveValue("");
    expect(getInput()).toHaveFocus();
  });

  it("follows the URL query when it changes from outside", () => {
    const { rerender } = renderWithProviders(
      <SearchForm query="react" onSearch={vi.fn()} />,
    );
    expect(getInput()).toHaveValue("react");

    rerender(<SearchForm query="vue" onSearch={vi.fn()} />);
    expect(getInput()).toHaveValue("vue");
  });

  it("shows Japanese text when the saved language is Japanese", () => {
    localStorage.setItem("repo-search:locale", "ja");
    renderWithProviders(<SearchForm query="" onSearch={vi.fn()} />);

    expect(
      screen.getByRole("searchbox", { name: "リポジトリを検索" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "検索" })).toBeInTheDocument();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = renderWithProviders(
      <SearchForm query="react" onSearch={vi.fn()} />,
    );
    expect(await getViolations(container)).toEqual([]);
  });
});
