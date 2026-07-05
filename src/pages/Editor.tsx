import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import SiteHeader from '@/components/SiteHeader';
import WorksheetPreview from '@/components/WorksheetPreview';
import EditorToolbar from '@/components/editor/EditorToolbar';
import CustomizeControls from '@/components/editor/CustomizeControls';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrintCount } from '@/hooks/use-print-count';
import { WorksheetConfig, WorksheetData, generateWorksheet } from '@/lib/shapes';
import { getTemplate, templateConfig } from '@/data/templates';
import { defaultConfig } from '@/lib/defaultConfig';
import { loadProfile, saveProfile, loadTemplateConfig, saveTemplateConfig, clearTemplateConfig } from '@/lib/persistence';
import { usePageMeta } from '@/hooks/use-page-meta';
import { ageBandLabel } from '@/data/templates';

// Fields that only affect presentation — the renderer reads them from config
// directly, so changing them must NOT re-roll the puzzle. A parent who found a
// worksheet they like should keep it while typing the child's name or toggling
// the answer key.
const COSMETIC_FIELDS: (keyof WorksheetConfig)[] = [
  'childAge', 'customInstruction', 'borderStyle', 'headerFontSize', 'headerBold',
  'instructionFontSize', 'instructionBold', 'nameDateFontSize', 'useColor',
  'showAnswerKey', 'showGridLines', 'mazeShowSolution', 'pixelArtBW',
  'handwritingShowColoredLines', 'handwritingLineColor', 'handwritingHighlightColor',
  'handwritingShowHighlight', 'handwritingShowStartEnd', 'visualScanFontStyle',
  'visualScanCharSize', 'wordBoxDisplayMode',
];

function generativeKey(config: WorksheetConfig): string {
  const clone: Record<string, unknown> = { ...config };
  for (const f of COSMETIC_FIELDS) delete clone[f];
  // childName feeds generation only in the handwriting family (trace-name
  // letters, handwriting fallback text); elsewhere it's header-only.
  if (config.mode !== 'traceName' && config.mode !== 'handwriting') delete clone.childName;
  return JSON.stringify(clone);
}

export default function Editor() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { increment, shouldNudge } = usePrintCount();

  const template = templateId ? getTemplate(templateId) : undefined;
  const initialConfig = useMemo<WorksheetConfig>(() => {
    if (!template) return defaultConfig;
    const base = templateConfig(template);
    // Restore the last customization of this template (survives refresh);
    // merge over fresh defaults so newly added config fields stay valid.
    const saved = templateId ? loadTemplateConfig(templateId) : null;
    if (saved) return { ...base, ...saved, mode: template.mode };
    // First visit to this template: carry the child's name over from any
    // other worksheet the family has used.
    const profile = loadProfile();
    if (profile?.childName && !base.childName) return { ...base, childName: profile.childName };
    return base;
  }, [template, templateId]);

  usePageMeta(
    template ? `${template.title} — Free Printable Worksheet (${ageBandLabel[template.ageBand]})` : undefined,
    template ? `Free printable ${template.clinicalName.toLowerCase()} worksheet for kids (${ageBandLabel[template.ageBand].toLowerCase()}). Customize difficulty, shapes and theme, then print — no signup.` : undefined
  );

  const [config, setConfig] = useState<WorksheetConfig>(initialConfig);
  const [data, setData] = useState<WorksheetData>(() => generateWorksheet(initialConfig));
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // Re-seed the worksheet whenever a setting changes (live preview).
  useEffect(() => {
    setConfig(initialConfig);
    setData(generateWorksheet(initialConfig));
  }, [initialConfig]);

  // Regenerate the visible puzzle only when a generative setting changes;
  // cosmetic fields re-render via config without re-rolling the puzzle.
  const genKey = generativeKey(config);
  useEffect(() => {
    setData(generateWorksheet(config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genKey]);

  // Persist customizations (debounced) + remember the child's name globally.
  useEffect(() => {
    if (!templateId) return;
    const t = setTimeout(() => {
      saveTemplateConfig(templateId, config);
      if (config.childName.trim()) saveProfile({ childName: config.childName.trim() });
    }, 400);
    return () => clearTimeout(t);
  }, [config, templateId]);

  const handleRegenerate = useCallback(() => {
    setData(generateWorksheet(config));
  }, [config]);

  const handleReset = useCallback(() => {
    if (!template || !templateId) return;
    clearTemplateConfig(templateId);
    const fresh = templateConfig(template);
    setConfig(fresh);
    setData(generateWorksheet(fresh));
    toast('Reset to template defaults');
  }, [template, templateId]);

  const handlePrint = useCallback(() => {
    window.print();
    const n = increment();
    if (n >= 3) {
      // Gentle, non-blocking nudge — never gates printing.
      toast('Enjoying these worksheets? ☕', {
        description: 'Everything stays free. If they help, you can buy me a coffee.',
      });
    }
  }, [increment]);

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">That worksheet template wasn’t found.</p>
        <Button onClick={() => navigate('/')}>Back to gallery</Button>
      </div>
    );
  }

  const controls = <CustomizeControls config={config} onChange={setConfig} />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader
        right={
          <Link to="/" className="no-print inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Gallery
          </Link>
        }
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="no-print mb-4">
          <h2 className="font-display text-xl font-extrabold text-foreground">{template.title}</h2>
          <p className="text-xs text-muted-foreground">{template.clinicalName} · {template.skillTag}</p>
        </div>

        <div className="no-print mb-4">
          <EditorToolbar
            onPrint={handlePrint}
            onRegenerate={handleRegenerate}
            onToggleCustomize={() => setCustomizeOpen((o) => !o)}
            customizeOpen={customizeOpen}
          />
          <p className="text-[11px] text-muted-foreground mt-2">
            🖨️ Printing works best from a desktop browser. Browse and preview freely on any device.
          </p>
        </div>

        {/* Preview + (desktop) collapsible right panel */}
        <div className={`flex gap-6 ${customizeOpen && !isMobile ? 'lg:flex-row' : ''} flex-col lg:flex-row`}>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-[560px]">
              <WorksheetPreview config={config} data={data} />
            </div>
          </div>

          {/* Desktop: inline collapsible right panel */}
          {!isMobile && customizeOpen && (
            <aside className="no-print w-full lg:w-[360px] shrink-0">
              <div className="bg-card rounded-xl border border-border p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base font-bold">Customize</h3>
                  <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-2">
                      Reset
                    </button>
                    <button onClick={() => setCustomizeOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {controls}
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Mobile: bottom-sheet Customize */}
      {isMobile && (
        <Drawer open={customizeOpen} onOpenChange={setCustomizeOpen}>
          <DrawerContent className="no-print max-h-[85vh]">
            <div className="px-4 pb-8 pt-2 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold">Customize</h3>
                <button onClick={handleReset} className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-2">
                  Reset
                </button>
              </div>
              {controls}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
