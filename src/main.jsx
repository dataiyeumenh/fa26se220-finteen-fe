import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { startAuth } from "./api/auth.api";
import ErrorBoundary from "./components/feedback/ErrorBoundary.jsx";

const stopAuth = startAuth();
if (import.meta.hot) import.meta.hot.dispose(stopAuth);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
