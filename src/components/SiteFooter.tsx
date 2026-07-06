import { Link } from 'react-router-dom';
import { GOAL_COPY, GOAL_SLUGS } from '@/data/goalCopy';

export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-card/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Browse-by-goal links: internal linking so search engines discover the
            content pages, and a real navigation aid for parents. */}
        <nav aria-label="Browse worksheets by goal">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Browse by goal</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            {GOAL_SLUGS.map((slug) => (
              <li key={slug}>
                <Link to={`/worksheets/${slug}`} className="hover:text-foreground transition-colors">
                  {GOAL_COPY[slug].navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">© OTsheet.ai · Made with care for little learners.</p>
          <nav className="flex items-center gap-5 text-sm font-medium text-muted-foreground">
            <a href="/#about" className="hover:text-foreground transition-colors">About</a>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            {/* TODO: replace with real contact address */}
            <a href="mailto:hello@otsheet.ai" className="hover:text-foreground transition-colors">Contact</a>
            {/* TODO: replace with real Buy Me a Coffee link */}
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 text-secondary-foreground px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-secondary/25 transition-colors"
            >
              ☕ Buy Me a Coffee
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
