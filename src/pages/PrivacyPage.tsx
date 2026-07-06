import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/use-page-meta';

/**
 * Privacy page. The on-device data model is a genuine differentiator for a
 * children's tool, so it's stated plainly. Keep this ACCURATE to how the app
 * actually behaves — if a future phase adds accounts/analytics/an API, update
 * this page in the same change.
 */
export default function PrivacyPage() {
  usePageMeta('Privacy', 'How OTsheet.ai handles data: everything stays on your device. No accounts, no uploads, no third-party tracking of children.');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader
        right={
          <Link to="/" className="no-print inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        }
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Privacy</h1>
        <p className="text-muted-foreground mt-2">
          Short version: OTsheet.ai runs entirely in your browser. There are no accounts, and nothing
          about you or your child is uploaded to us.
        </p>

        <div className="mt-6 space-y-6 text-sm sm:text-base leading-relaxed text-foreground">
          <section>
            <h2 className="font-display font-bold text-lg mb-1">What we store, and where</h2>
            <p className="text-muted-foreground">
              Child profiles (name, age band, interests), your saved worksheet settings, and your print
              history are stored only in your own browser, using <code>localStorage</code> on your device.
              This data never leaves your device and is never sent to a server. Clearing your browser data
              for this site removes all of it.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg mb-1">Worksheets are made on your device</h2>
            <p className="text-muted-foreground">
              Every worksheet is generated in your browser. No worksheet content, and no child’s name or
              age, is uploaded or shared with us. When you print, the file goes straight to your own
              printer or “Save as PDF” — not through any server.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg mb-1">Shareable links</h2>
            <p className="text-muted-foreground">
              When you copy a “Share” link, the worksheet’s settings are encoded directly in the link’s
              web address. Anyone you send it to can open that exact worksheet. Only share links with
              people you intend to — a link may contain the name you typed on the sheet.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg mb-1">Usage analytics (no personal data)</h2>
            <p className="text-muted-foreground">
              We use privacy-friendly analytics (Vercel Web Analytics) to count how many people visit and
              which worksheets are popular. It sets no cookies and does not build advertising profiles. We
              strip the details out of worksheet links before anything is recorded, so a child’s name is
              never sent — we only see, for example, that the “Trace My Name” page was opened. We record
              when a worksheet is printed together with its type, but never with any child’s name or age.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg mb-1">Fonts</h2>
            <p className="text-muted-foreground">
              Your browser fetches fonts from Google Fonts and cdnfonts to display the worksheets; those
              services receive standard web requests (such as your IP address) as part of loading a page,
              as they would on most websites.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg mb-1">Questions</h2>
            <p className="text-muted-foreground">
              {/* TODO: replace with a real contact address before launch. */}
              Reach us at <a className="text-primary underline" href="mailto:hello@otsheet.ai">hello@otsheet.ai</a>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
