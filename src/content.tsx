import React from "react";
import ReactDOM from "react-dom/client";
import { Overlay } from "./components/Overlay";

import "./index.css";

const root = document.createElement("div");
root.id = "crx-root";
root.className = "focus-guardian";
document.body.append(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Overlay />
  </React.StrictMode>
);
