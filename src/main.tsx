// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "github-markdown-css";
// This should be the last to ensure it can override other styles
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
