import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Overlay } from "./components/ContentEntry/Overlay";
import "./index.css";

const container = document.createElement("div") as HTMLElement;
container.id = "crx-root";
container.className = "focus-guardian";
document.body.append(container);

const root = createRoot(container);
root.render(
  <StrictMode>
    <Overlay />
  </StrictMode>,
);
