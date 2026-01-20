import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ui/ErrorFallback/ErrorFallback.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={() => window.location.replace("/")}
        >
            <App />
        </ErrorBoundary>
    </StrictMode>
);
