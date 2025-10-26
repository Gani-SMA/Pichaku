import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { performanceMonitor } from "./lib/performance";
import { analytics } from "./lib/analytics";
import { monitoring } from "./lib/monitoring";

// Initialize monitoring and analytics
monitoring.init();
analytics.init();

// Initialize performance monitoring
performanceMonitor.measurePageLoad();
performanceMonitor.measureWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
