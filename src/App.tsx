import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import AppRoutes from "./AppRoutes";
import { ProfileProvider } from "@/hooks/use-profiles";

const queryClient = new QueryClient();

// SPA navigation keeps the previous page's scroll offset — clicking a card at
// the bottom of the gallery opened the editor scrolled past the Print/
// Customize toolbar. Reset to top on every route change.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Strip query strings before anything is sent to analytics. Share links encode
// the child's name in ?c=… — never let that reach a third party. We keep only
// the path (which worksheet), which is all we need for usage counts.
const scrubUrl = (event: { url: string }) => {
  try {
    const u = new URL(event.url);
    event.url = u.origin + u.pathname;
  } catch {
    event.url = event.url.split("?")[0];
  }
  return event;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProfileProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </ProfileProvider>
      {/* Privacy-friendly usage analytics: no cookies, no consent banner, no
          child data (see scrubUrl + the print event carries only template/mode). */}
      <Analytics beforeSend={scrubUrl} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
