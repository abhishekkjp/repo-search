import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/global.css";
import App from "./App.tsx";
import { LocaleProvider } from "./i18n/LocaleProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isSearchError } from "./features/search/api/errors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Retrying a rate limit or a bad query only wastes quota.
        if (isSearchError(error) && error.kind !== "network") return false;
        return failureCount < 2;
      },
    },
  },
});

const container = document.getElementById("root");
if (container === null) {
  throw new Error("Root element #root not found in index.html.");
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </QueryClientProvider>
  </StrictMode>,
);
