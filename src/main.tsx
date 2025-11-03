import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMobileCapabilities } from "./lib/mobileCapabilities";
import { initializeTheme } from "./lib/themeInitializer";

// Initialize theme BEFORE React renders to prevent flash
initializeTheme();

// Initialize mobile capabilities
initializeMobileCapabilities();

createRoot(document.getElementById("root")!).render(<App />);
