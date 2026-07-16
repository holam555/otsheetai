import { Link } from 'react-router-dom';
import { GOAL_COPY, GOAL_SLUGS } from '@/data/goalCopy';
import { GUIDES } from '@/data/guides';

export default function SiteFooter() {
  return (
    <footer className="no-print mt-14">
      {/* The tracing-path motif closes every page. */}
      <div className="dotted-divider max-w-7xl mx-auto" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand block: who we are + the product thesis, signed by hand. */}
          <div className="lg:pr-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <circle cx="17.5" cy="17.5" r="3.5" />
                </svg>
              </div>
              <p className="font-display text-base font-extrabold text-foreground">OTsheet.ai</p>
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Printable practice sheets for growing hands and sharp little eyes.
              Free to print, always. No accounts, no paywalls.
            </p>
            <p className="font-hand text-xl text-secondary mt-3 -rotate-2">made with care ✎</p>
          </div>

          {/* Browse-by-goal links: internal linking so search engines discover the
              content pages, and a real navigation aid for parents. */}
          <nav aria-label="Browse worksheets by goal">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Browse by goal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {GOAL_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link to={`/worksheets/${slug}`} className="hover:text-foreground transition-colors">
                    {GOAL_COPY[slug].navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Learn: the guides content space. */}
          <nav aria-label="Guides for parents">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Learn</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/guides" className="hover:text-foreground transition-colors font-semibold">All guides</Link></li>
              {GUIDES.slice(0, 6).map((g) => (
                <li key={g.slug}>
                  <Link to={`/guides/${g.slug}`} className="hover:text-foreground transition-colors">
                    {g.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="About OTsheet.ai">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">About</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#about" className="hover:text-foreground transition-colors">About OTsheet.ai</a></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              {/* TODO: replace with real contact address */}
              <li><a href="mailto:hello@otsheet.ai" className="hover:text-foreground transition-colors">Contact</a></li>
              <li>
                {/* TODO: replace with real Buy Me a Coffee link */}
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-secondary/25 transition-colors"
                >
                  ☕ Buy Me a Coffee
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border pt-5">
          © OTsheet.ai · Made with care for little learners.
        </p>
      </div>
    </footer>
  );
}
