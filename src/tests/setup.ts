import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./server";

// jsdom does not implement scrolling, and ResultList calls scrollIntoView.
window.HTMLElement.prototype.scrollIntoView = vi.fn();
// axe-core probes canvas support; jsdom has none, so report "unavailable".
vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

// "error" makes any request without a handler fail loudly, so a test can
// never silently hit the real GitHub API.
beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

afterAll(() => {
  server.close();
});
