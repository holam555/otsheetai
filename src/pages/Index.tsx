import { useState, useCallback, useEffect } from 'react';
import { WorksheetConfig, WorksheetData, generateWorksheet, BASIC_SHAPES } from '@/lib/shapes';
import WorksheetControls from '@/components/WorksheetControls';
import WorksheetPreview from '@/components/WorksheetPreview';

const STORAGE_KEY = 'otsheet-config-v1';

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
  oddOneOutCustomTarget: '',
  handwritingText: '',
  handwritingRows: 3,
  handwritingPaperStyle: 'triline',
  handwritingFontSize: 'large',
  handwritingFontSizeMm: 15,
  handwritingFont: 'print',
  handwritingSubMode: 'sentence',
  handwritingWords: '',
  handwritingShowHighlight: true,
  handwritingShowColoredLines: true,
  handwritingLineColor: 'red',
  handwritingHighlightColor: 'blue',
  handwritingLineMode: '3-line',
  wordBoxDisplayMode: 'boxOnly',
  handwritingLayout: 'triline',
  handwritingShowStartEnd: false,
  instructionFontSize: 'medium',
  instructionBold: false,
  nameDateFontSize: 'medium',
  mazeSize: 'medium',
  mazeShape: 'square',
  mazeShowSolution: false,
  connectDotsShape: 'star',
  tracingStrokeType: 'mixed',
  tracingRows: 4,
  tracingThickness: 'medium',
  scissorLineType: 'mixed',
  scissorLineCount: 6,
  visualScanTarget: 'b',
  visualScanDensity: 'medium',
  visualScanFontStyle: 'standard',
  visualScanCharSize: 'medium',
  visualScanTargetCount: 'few',
  pixelArtTheme: 'heart',
  pixelArtGridSize: 'simple',
  pixelArtBW: false,
  useEmoji: false,
  emojiTheme: 'animals',
};

function loadConfig(): WorksheetConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
  } catch {
    // ignore parse errors
  }
  return defaultConfig;
}

export default function Index() {
  const [config, setConfig] = useState<WorksheetConfig>(loadConfig);
  const [worksheetData, setWorksheetData] = useState<WorksheetData>(() => generateWorksheet(loadConfig()));

  // Regenerate worksheet whenever config changes
  useEffect(() => {
    setWorksheetData(generateWorksheet(config));
  }, [config]);

  // Persist config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore quota errors
    }
  }, [config]);

  const handleGenerate = useCallback(() => {
    setWorksheetData(generateWorksheet(config));
  }, [config]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback(() => {
    const preview = document.getElementById('worksheet-preview');
    if (!preview) return;
    const svgs = preview.querySelectorAll('svg');
    if (svgs.length === 0) return;

    let svgContent: string;
    if (svgs.length === 1) {
      svgContent = new XMLSerializer().serializeToString(svgs[0]);
    } else {
      // Combine multiple pages into one tall SVG
      const parts = Array.from(svgs).map((svg, i) => {
        const serialized = new XMLSerializer().serializeToString(svg);
        return serialized.replace('<svg', `<svg y="${i * 842}"`);
      }).join('\n');
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 ${842 * svgs.length}" width="595" height="${842 * svgs.length}">${parts}</svg>`;
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OTsheet-${config.mode}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [config.mode]);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <circle cx="17.5" cy="17.5" r="3.5" />
              </svg>
            </div>
            <h1 className="font-display text-lg font-extrabold text-foreground">OTsheet.ai</h1>
          </div>
          <span className="hidden sm:inline text-xs text-muted-foreground font-medium">for parents & therapists</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          <aside className="no-print">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <WorksheetControls
                config={config}
                onChange={setConfig}
                onGenerate={handleGenerate}
                onPrint={handlePrint}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </div>
          </aside>

          <div className="flex justify-center">
            <div className="w-full max-w-[560px]">
              <div className="worksheet-desk">
                <div className="w-full max-w-[460px] mx-auto">
                  <WorksheetPreview config={config} data={worksheetData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
