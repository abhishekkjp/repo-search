import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/tokens.css";
import "./styles/global.css";
import App from './App.tsx'
import { LocaleProvider } from "./i18n/LocaleProvider";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <LocaleProvider>
        <App />
    </LocaleProvider>
  </StrictMode>,
)
