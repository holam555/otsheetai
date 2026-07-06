import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import TemplateCard from '@/components/gallery/TemplateCard';
import { usePageMeta } from '@/hooks/use-page-meta';
import { TEMPLATES } from '@/data/templates';
import { GOAL_COPY } from '@/data/goalCopy';
import NotFound from '@/pages/NotFound';

export default function GoalPage() {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  const copy = goalSlug && goalSlug in GOAL_COPY ? GOAL_COPY[goalSlug as keyof typeof GOAL_COPY] : undefined;

  const templates = useMemo(
    () => (copy ? TEMPLATES.filter((t) => t.goals.includes(copy.slug)) : []),
    [copy]
  );

  usePageMeta(copy?.heading, copy?.metaDescription);

  if (!copy) return <NotFound />;

  // FAQPage + Breadcrumb structured data — prerendered into the static HTML so
  // search engines can surface the Q&A and the site hierarchy.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: copy.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OTsheet.ai', item: 'https://otsheetai.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: copy.heading, item: `https://otsheetai.vercel.app/worksheets/${copy.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader
        right={
          <Link to="/" className="no-print inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> All worksheets
          </Link>
        }
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <article className="prose-none">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">{copy.heading}</h1>
          <div className="mt-4 space-y-3 max-w-3xl">
            {copy.intro.map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
            ))}
          </div>
        </article>

        <section aria-label="Worksheets for this goal">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Printable worksheets</h2>
          {templates.length === 0 ? (
            <p className="text-muted-foreground">No worksheets yet for this goal.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {templates.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          )}
        </section>

        <section aria-label="Frequently asked questions">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Frequently asked questions</h2>
          <div className="space-y-4 max-w-3xl">
            {copy.faq.map((f, i) => (
              <div key={i}>
                <h3 className="font-display font-semibold text-foreground">{f.q}</h3>
                <p className="text-muted-foreground mt-1 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
