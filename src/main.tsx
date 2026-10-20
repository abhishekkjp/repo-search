import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/global.css";
import App from "./App.tsx";
import { LocaleProvider } from "./i18n/LocaleProvider";

const container = document.getElementById("root");
if (container === null) {
  throw new Error("Root element #root not found in index.html.");
}

createRoot(container).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
