// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure page load performance
  measurePageLoad() {
    if (typeof window !== "undefined" && "performance" in window) {
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          download: navigation.responseEnd - navigation.responseStart,
          domParse: navigation.domContentLoadedEventEnd - navigation.responseEnd,
          domReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          pageLoad: navigation.loadEventEnd - navigation.navigationStart,
        };

        console.log("Performance Metrics:", metrics);
        
        // Send to analytics service in production
        if (import.meta.env.PROD) {
          this.sendMetrics(metrics);
        }
      });
    }
  }

  // Measure Core Web Vitals
  measureWebVitals() {
    if (typeof window !== "undefined") {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
        this.metrics.set("lcp", lastEntry.startTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log("FID:", entry.processingStart - entry.startTime);
          this.metrics.set("fid", entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log("CLS:", clsValue);
        this.metrics.set("cls", clsValue);
      }).observe({ entryTypes: ["layout-shift"] });
    }
  }

  // Measure custom timing
  startTiming(label: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${label}-start`);
    }
  }

  endTiming(label: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      console.log(`${label} took ${measure.duration}ms`);
      this.metrics.set(label, measure.duration);
    }
  }

  private sendMetrics(metrics: Record<string, number>) {
    // In production, send to analytics service
    fetch("/api/analytics/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metrics,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(console.error);
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();