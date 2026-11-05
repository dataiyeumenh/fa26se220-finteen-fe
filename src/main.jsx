import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { startAuth } from "./api/auth.api";
import { startScrollbars } from "./lib/scrollbars";

const stopAuth = startAuth();
const stopScrollbars = startScrollbars();
if (import.meta.hot) import.meta.hot.dispose(() => { stopAuth(); stopScrollbars(); });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
