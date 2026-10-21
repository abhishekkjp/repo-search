import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom does not implement scrolling, and ResultList calls scrollIntoView.
window.HTMLElement.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  // We import Vitest APIs explicitly (no globals), so Testing Library's
  // automatic cleanup is not registered. Do it ourselves.
  cleanup();
  // Tests must not leak state into each other.
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});
