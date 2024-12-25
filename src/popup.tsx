import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import { App } from "./components/MainEntry/App";
import i18n from "./i18n";
import "./index.css";

const container = document.getElementById("root") as HTMLElement;

createRoot(container).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
);
