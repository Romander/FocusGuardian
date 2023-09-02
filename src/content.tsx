import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import { Overlay } from "./components/ContentEntry/Overlay";
import i18n from "./i18n";
import "./index.css";

const container = document.createElement("div") as HTMLElement;
container.id = "crx-root";
container.className = "focus-guardian";
document.body.append(container);

const root = createRoot(container);
root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Overlay />
    </I18nextProvider>
  </StrictMode>,
);
