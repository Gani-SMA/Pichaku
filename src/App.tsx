import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import { SkipLink } from "./components/ui/skip-link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { env } from "./lib/env";

// Lazy load pages for better performance
const Results = lazy(() => import("./pages/Results"));
const Chat = lazy(() => import("./pages/Chat"));
const Documents = lazy(() => import("./pages/Documents"));
const Resources = lazy(() => import("./pages/Resources"));
const News = lazy(() => import("./pages/News"));
const Auth = lazy(() => import("./pages/Auth"));
const CaseTracking = lazy(() => import("./pages/CaseTracking"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <SkipLink href="#main-content">Skip to main content</SkipLink>
                <SkipLink href="#navigation">Skip to navigation</SkipLink>
                <Header />
                <main id="main-content" className="flex-1" role="main">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/results" element={<Results />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/case-tracking" element={<CaseTracking />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </BrowserRouter>
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
