import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppRoutes from './AppRoutes';
import { ProfileProvider } from '@/hooks/use-profiles';
import { TEMPLATES, ageBandLabel } from '@/data/templates';
import { GOAL_COPY, GOAL_SLUGS } from '@/data/goalCopy';

/**
 * Build-time prerender entry. Renders the SAME route tree the client uses
 * (AppRoutes) to an HTML string via StaticRouter. The client still mounts with
 * createRoot (see main.tsx), which replaces this markup — so there is no
 * hydration step and no risk of a mismatch from the randomly generated
 * worksheet SVGs. Crawlers and AI answer engines get real content; users get
 * the interactive SPA.
 *
 * The Toasters (browser-only UI) are intentionally omitted here.
 */
export function render(url: string): string {
  const queryClient = new QueryClient();
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProfileProvider>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </ProfileProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export interface PrerenderRoute {
  /** URL path to render + output location (e.g. "/edit/trace-name"). */
  path: string;
  title: string;
  description: string;
}

const SITE = 'https://otsheetai.vercel.app';

/** Every route that should become a static HTML file. */
export const routes: PrerenderRoute[] = [
  {
    path: '/',
    title: 'OTsheet.ai — Free Printable OT Worksheets for Kids (Handwriting & Visual Perception)',
    description:
      'Free printable occupational therapy worksheets for children aged 2–12: handwriting practice, name tracing, letter reversals, visual perception, scissor skills, mazes and more. Customize and print in seconds — no signup.',
  },
  ...GOAL_SLUGS.map((slug) => ({
    path: `/worksheets/${slug}`,
    title: `${GOAL_COPY[slug].heading} · OTsheet.ai`,
    description: GOAL_COPY[slug].metaDescription,
  })),
  ...TEMPLATES.map((t) => ({
    path: `/edit/${t.id}`,
    title: `${t.title} — Free Printable Worksheet (${ageBandLabel[t.ageBand]}) · OTsheet.ai`,
    description: `Free printable ${t.clinicalName.toLowerCase()} worksheet for kids (${ageBandLabel[t.ageBand].toLowerCase()}). Customize difficulty, shapes and theme, then print — no signup.`,
  })),
];

/** Canonical URL for a given route path. */
export const canonical = (path: string) => (path === '/' ? `${SITE}/` : `${SITE}${path}`);
