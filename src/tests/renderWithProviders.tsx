import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { LocaleProvider } from "../i18n/LocaleProvider";

export function renderWithProviders(ui: ReactElement) {
  // A fresh client per test, so one test's cache never feeds another.
  // Retries are off so a failing request fails immediately.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <LocaleProvider>{children}</LocaleProvider>
      </QueryClientProvider>
    );
  }

  // `wrapper` (rather than wrapping `ui` by hand) keeps the providers
  // in place when a test calls `rerender`.
  return render(ui, { wrapper: Wrapper });
}
