/**
 * main.tsx
 * Author: Yewbdar Abera
 * Date: May 4, 2026
 *
 * Entry point. Nothing fancy here — just mounts the React tree.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
