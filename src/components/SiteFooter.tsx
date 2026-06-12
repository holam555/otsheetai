export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-card/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© OTsheet.ai · Made with care for little learners.</p>
        <nav className="flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
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
    </footer>
  );
}
