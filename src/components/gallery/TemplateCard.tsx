import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import WorksheetPreview from '@/components/WorksheetPreview';
import { Template, templateConfig, ageBandLabel } from '@/data/templates';
import { generateWorksheetSeeded, hashSeed } from '@/lib/seededGenerate';

export default function TemplateCard({ template }: { template: Template }) {
  const navigate = useNavigate();

  // Generate the preview once, with a stable seed, so the card never flickers
  // or re-randomizes on re-render. Reuses the real rendering engine.
  const { config, data } = useMemo(() => {
    const config = templateConfig(template);
    const data = generateWorksheetSeeded(config, hashSeed(template.id));
    return { config, data };
  }, [template]);

  const open = () => navigate(`/edit/${template.id}`);

  return (
    <button
      type="button"
      onClick={open}
      className="group text-left rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative bg-muted/40 border-b border-border overflow-hidden">
        <WorksheetPreview config={config} data={data} variant="thumb" />
        <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm">
          {ageBandLabel[template.ageBand]}
        </span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5">
          <span className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-bold shadow-md">
            Open & print →
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-display font-bold text-sm text-foreground leading-snug">{template.title}</h3>
        <p className="text-[11px] text-muted-foreground mt-1">{template.skillTag}</p>
      </div>
    </button>
  );
}
