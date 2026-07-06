import { useMemo, useState } from 'react';
import { usePageMeta } from '@/hooks/use-page-meta';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AboutStrip from '@/components/gallery/AboutStrip';
import TemplateCard from '@/components/gallery/TemplateCard';
import { TEMPLATES, GOALS, LANGUAGES, Goal, Language } from '@/data/templates';
import { AGE_BANDS, AgeBand } from '@/lib/defaultConfig';
import { WorksheetMode } from '@/lib/shapes';
import { useProfiles } from '@/hooks/use-profiles';
import { loadHistory } from '@/lib/persistence';

type AgeFilter = AgeBand | 'all';
type GoalFilter = Goal | 'all';
type LangFilter = Language | 'all';
type ModeFilter = WorksheetMode | 'all';

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold border transition-all ${
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground w-20 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function Gallery() {
  usePageMeta();
  const { effectiveProfileId, activeProfile } = useProfiles();
  const [age, setAge] = useState<AgeFilter>('all');
  const [goal, setGoal] = useState<GoalFilter>('all');
  const [lang, setLang] = useState<LangFilter>('all');
  const [mode, setMode] = useState<ModeFilter>('all');
  const [showClinical, setShowClinical] = useState(false);

  // Distinct clinical types for the professional "All worksheet types" filter.
  const clinicalTypes = useMemo(() => {
    const seen = new Map<WorksheetMode, string>();
    for (const t of TEMPLATES) if (!seen.has(t.mode)) seen.set(t.mode, t.clinicalName);
    return Array.from(seen, ([mode, clinicalName]) => ({ mode, clinicalName }));
  }, []);

  const filtered = useMemo(
    () =>
      TEMPLATES.filter(
        (t) =>
          (age === 'all' || t.ageBand === age) &&
          (goal === 'all' || t.goals.includes(goal)) &&
          (lang === 'all' || t.language === lang) &&
          (mode === 'all' || t.mode === mode)
      ),
    [age, goal, lang, mode]
  );

  const anyFilter = age !== 'all' || goal !== 'all' || lang !== 'all' || mode !== 'all';
  const clearAll = () => { setAge('all'); setGoal('all'); setLang('all'); setMode('all'); };

  // Most-recently-printed templates for the active child (distinct, up to 4).
  const recent = useMemo(() => {
    const seen = new Set<string>();
    const out: typeof TEMPLATES = [];
    for (const h of loadHistory()) {
      if (h.profileId !== effectiveProfileId || seen.has(h.templateId)) continue;
      seen.add(h.templateId);
      const t = TEMPLATES.find((x) => x.id === h.templateId);
      if (t) out.push(t);
      if (out.length >= 4) break;
    }
    return out;
  }, [effectiveProfileId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="text-center pt-2 pb-1">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            Printable worksheets, made your way
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Print a template as-is, or customize every detail: shapes, difficulty, fonts, and more.
            No setup, no signup.
          </p>
        </div>

        <AboutStrip />

        {/* Recently printed for the active child */}
        {recent.length > 0 && (
          <section aria-label="Recently printed">
            <h2 className="font-display text-lg font-bold text-foreground mb-3">
              Recently printed{activeProfile ? ` for ${activeProfile.name}` : ''}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {recent.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          </section>
        )}

        {/* Browse filters */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 space-y-3">
          <FilterRow label="By age">
            <Chip active={age === 'all'} onClick={() => setAge('all')}>All ages</Chip>
            {AGE_BANDS.map((b) => (
              <Chip key={b.value} active={age === b.value} onClick={() => setAge(b.value)}>{b.label}</Chip>
            ))}
          </FilterRow>
          <FilterRow label="By goal">
            <Chip active={goal === 'all'} onClick={() => setGoal('all')}>All goals</Chip>
            {GOALS.map((g) => (
              <Chip key={g.value} active={goal === g.value} onClick={() => setGoal(g.value)}>{g.label}</Chip>
            ))}
          </FilterRow>
          <FilterRow label="By language">
            <Chip active={lang === 'all'} onClick={() => setLang('all')}>All</Chip>
            {LANGUAGES.map((l) => (
              <Chip key={l.value} active={lang === l.value} onClick={() => setLang(l.value)}>{l.label}</Chip>
            ))}
          </FilterRow>

          <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowClinical((s) => !s)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              {showClinical ? 'Hide' : 'All worksheet types (clinical)'}
            </button>
            {anyFilter && (
              <button type="button" onClick={clearAll} className="text-xs font-semibold text-primary hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {showClinical && (
            <FilterRow label="Type">
              <Chip active={mode === 'all'} onClick={() => setMode('all')}>All types</Chip>
              {clinicalTypes.map((c) => (
                <Chip key={c.mode} active={mode === c.mode} onClick={() => setMode(c.mode)}>{c.clinicalName}</Chip>
              ))}
            </FilterRow>
          )}
        </div>

        {/* Gallery grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No worksheets match those filters yet — try clearing some.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
