import { useState, useCallback, useEffect } from 'react';
import { WorksheetConfig, WorksheetData, generateWorksheet, BASIC_SHAPES } from '@/lib/shapes';
import WorksheetControls from '@/components/WorksheetControls';
import WorksheetPreview from '@/components/WorksheetPreview';

const defaultConfig: WorksheetConfig = {
  mode: 'find',
  gridSize: 3,
  shapeSet: 'custom',
  selectedShapes: [...BASIC_SHAPES],
  difficulty: 'easy',
  childName: '',
  childAge: null,
  showGridLines: true,
  useColor: true,
  showAnswerKey: false,
  exerciseCount: 5,
  customInstruction: '',
  borderStyle: 'plain',
  headerFontSize: 'medium',
  headerBold: false,
  oddOneOutType: 'shapes',
  handwritingText: '',
  handwritingRows: 3,
  handwritingPaperStyle: 'triline',
  handwritingFontSize: 'large',
  handwritingFontSizeMm: 15,
  handwritingFont: 'print',
};

export default function Index() {
  const [config, setConfig] = useState<WorksheetConfig>(defaultConfig);
  const [worksheetData, setWorksheetData] = useState<WorksheetData>(() => generateWorksheet(defaultConfig));

  useEffect(() => {
    setWorksheetData(generateWorksheet(config));
  }, [config.mode, config.gridSize, config.difficulty, config.exerciseCount, config.selectedShapes, config.oddOneOutType, config.childName, config.handwritingText, config.handwritingRows, config.handwritingPaperStyle, config.handwritingFontSize, config.handwritingFontSizeMm, config.handwritingFont]);

  const handleGenerate = useCallback(() => {
    setWorksheetData(generateWorksheet(config));
  }, [config]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <circle cx="17.5" cy="17.5" r="3.5" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-lg font-extrabold text-foreground leading-tight">OTsheet.ai</h1>
              <p className="text-[11px] text-muted-foreground leading-none">Pediatric OT Worksheets</p>
            </div>
          </div>
          <span className="hidden sm:inline text-xs text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">Ages 2–12</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          <aside className="no-print">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <h2 className="font-display text-base font-bold text-foreground mb-4">Worksheet Settings</h2>
              <WorksheetControls
                config={config}
                onChange={setConfig}
                onGenerate={handleGenerate}
                onPrint={handlePrint}
              />
            </div>
          </aside>

          <div className="flex justify-center">
            <div className="w-full max-w-[520px]">
              <WorksheetPreview config={config} data={worksheetData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
