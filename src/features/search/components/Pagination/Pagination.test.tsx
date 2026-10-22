import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getViolations } from "../../../../tests/axe";
import { renderWithProviders } from "../../../../tests/renderWithProviders";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = renderWithProviders(
      <Pagination
        current={1}
        totalPages={1}
        isBusy={false}
        onPageChange={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page for assistive technology", () => {
    renderWithProviders(
      <Pagination
        current={17}
        totalPages={34}
        isBusy={false}
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Page 17, current page" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("button", { name: "Go to page 18" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("goes to a clicked page, and to the next page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithProviders(
      <Pagination
        current={17}
        totalPages={34}
        isBusy={false}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Go to page 34" }));
    expect(onPageChange).toHaveBeenLastCalledWith(34);

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenLastCalledWith(18);
  });

  it("disables Previous on the first page and Next on the last", () => {
    const { rerender } = renderWithProviders(
      <Pagination
        current={1}
        totalPages={34}
        isBusy={false}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    rerender(
      <Pagination
        current={34}
        totalPages={34}
        isBusy={false}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("ignores clicks while busy but keeps buttons focusable", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithProviders(
      <Pagination
        current={5}
        totalPages={34}
        isBusy
        onPageChange={onPageChange}
      />,
    );

    const next = screen.getByRole("button", { name: "Next" });
    await user.click(next);

    expect(onPageChange).not.toHaveBeenCalled();
    expect(next).toBeEnabled();
    expect(next).toHaveAttribute("aria-disabled", "true");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = renderWithProviders(
      <Pagination
        current={17}
        totalPages={34}
        isBusy={false}
        onPageChange={vi.fn()}
      />,
    );
    expect(await getViolations(container)).toEqual([]);
  });
});
