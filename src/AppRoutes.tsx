import { Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import Editor from "./pages/Editor";
import GoalPage from "./pages/GoalPage";
import NotFound from "./pages/NotFound";

/**
 * Router-agnostic route table, shared by the client (BrowserRouter in App.tsx)
 * and the build-time prerenderer (StaticRouter in entry-prerender.tsx). Keeping
 * this in one place means a new route is prerendered for SEO automatically.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Gallery />} />
      <Route path="/worksheets/:goalSlug" element={<GoalPage />} />
      <Route path="/edit/:templateId" element={<Editor />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
