import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";

import "./index.css";

const root = document.getElementById("root") as HTMLElement;
root.className = "focus-guardian";

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
