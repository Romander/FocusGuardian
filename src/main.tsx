import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./components/MainEntry/App";
import "./index.css";

const container = document.getElementById("root") as HTMLElement;
container.className = "focus-guardian";

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
