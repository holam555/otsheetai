import { useEffect } from 'react';

const DEFAULT_TITLE = 'OTsheet.ai — Free Printable OT Worksheets for Kids (Handwriting & Visual Perception)';

/**
 * Per-route <title> + meta description. This only helps crawlers that execute
 * JS (Google does; most AI answer engines don't) — build-time prerendering of
 * these routes is the real fix and is specified in ROADMAP.md.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · OTsheet.ai` : DEFAULT_TITLE;
    if (description) {
      const el = document.querySelector('meta[name="description"]');
      const prev = el?.getAttribute('content') ?? null;
      el?.setAttribute('content', description);
      return () => {
        document.title = DEFAULT_TITLE;
        if (prev !== null) el?.setAttribute('content', prev);
      };
    }
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description]);
}
