import { WorksheetConfig, WorksheetMode, GridSize, Difficulty, BorderStyle, HeaderFontSize, ShapeName, ALL_SHAPES, SHAPE_COLORS, OddOneOutType, HandwritingPaperStyle, HandwritingFontSize, HandwritingFont, HandwritingSubMode, HandwritingLineColor, HandwritingLineMode, WordBoxDisplayMode, InstructionFontSize, MazeSize, MazeShape, ConnectDotsShape, TracingStrokeType, TracingThickness, ScissorLineType, ColorByNumberTheme, GridDesignSize, GridDesignPattern, DotArtTheme, DotArtDotSize, DotArtSpacing, ShapeTracingShape, ShapeTracingSize, SpotDiffTheme, SpotDiffCount, VisualScanDensity, VisualScanCharSize, PixelArtTheme } from '@/lib/shapes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Printer, RefreshCw, Info, Bold } from 'lucide-react';
import { getShapeSVG } from '@/lib/shapes';

interface Props {
  config: WorksheetConfig;
  onChange: (config: WorksheetConfig) => void;
  onGenerate: () => void;
  onPrint: () => void;
}

const HANDWRITING_MODES: { value: WorksheetMode; label: string; icon: string }[] = [
  { value: 'handwriting', label: 'Practice', icon: '📝' },
];

const VP_MODES: { value: WorksheetMode; label: string; icon: string }[] = [
  { value: 'find', label: 'Find the Shape', icon: '🔍' },
  { value: 'missing', label: 'Missing Shape', icon: '❓' },
  { value: 'pattern', label: 'Match Pattern', icon: '🔲' },
  { value: 'oddOneOut', label: 'Odd One Out', icon: '⭕' },
  { value: 'count', label: 'Find and Count', icon: '🔢' },
  { value: 'copy', label: 'Copy the Pattern', icon: '📋' },
  { value: 'sequence', label: 'What Comes Next', icon: '➡️' },
  { value: 'mirror', label: 'Mirror Image', icon: '🪞' },
  { value: 'figureGround', label: 'Figure Ground', icon: '🌫️' },
  { value: 'closure', label: 'Visual Closure', icon: '👁️' },
  { value: 'maze', label: 'Maze', icon: '🏁' },
  { value: 'connectDots', label: 'Connect the Dots', icon: '🔗' },
  { value: 'tracingPaths', label: 'Tracing Paths', icon: '✏️' },
  { value: 'scissorSkills', label: 'Scissor Skills', icon: '✂️' },
  { value: 'gridDesigns', label: 'Grid Designs', icon: '📐' },
  { value: 'visualScanning', label: 'Visual Scanning', icon: '👀' },
  { value: 'pixelArt', label: 'Pixel Art', icon: '🟩' },
];

const isHandwritingMode = (mode: WorksheetMode) => mode === 'handwriting';

const ODD_ONE_OUT_TYPES: { value: OddOneOutType; label: string }[] = [
  { value: 'shapes', label: 'Shapes' },
  { value: 'letters', label: 'Letters' },
  { value: 'numbers', label: 'Numbers' },
];

const GRID_SIZES: GridSize[] = [2, 3, 4, 5];
const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const EXERCISE_COUNTS = [3, 5, 8, 10];

const BORDER_STYLES: { value: BorderStyle; label: string }[] = [
  { value: 'plain', label: 'Plain' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'rounded', label: 'Rounded' },
];

const HEADER_SIZES: { value: HeaderFontSize; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
];

function getAvailableDifficulties(age: number | null): { easy: boolean; medium: boolean; hard: boolean } {
  if (age === null) return { easy: true, medium: true, hard: true };
  if (age <= 3) return { easy: true, medium: false, hard: false };
  if (age <= 5) return { easy: true, medium: true, hard: false };
  return { easy: true, medium: true, hard: true };
}

function ShapeIcon({ shape, selected, onClick }: { shape: ShapeName; selected: boolean; onClick: () => void }) {
  const size = 28;
  const svg = getShapeSVG(shape, size / 2, size / 2, size, selected ? SHAPE_COLORS[shape] : 'none', selected ? SHAPE_COLORS[shape] : '#94A3B8', selected ? 1.5 : 2);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
        selected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border bg-background hover:border-muted-foreground/40'
      }`}
      title={shape}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} dangerouslySetInnerHTML={{ __html: svg }} />
    </button>
  );
}

function BorderPreview({ style, selected, onClick }: { style: BorderStyle; selected: boolean; onClick: () => void }) {
  const strokeDash = style === 'dotted' ? 'stroke-dasharray="4 4"' : '';
  const rx = style === 'rounded' ? 'rx="8" ry="8"' : '';
  const svg = `<rect x="2" y="2" width="32" height="24" fill="none" stroke="${selected ? '#0D9488' : '#94A3B8'}" stroke-width="2" ${strokeDash} ${rx} />`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-background hover:border-muted-foreground/40'
      }`}
      title={style}
    >
      <svg width="36" height="28" viewBox="0 0 36 28" dangerouslySetInnerHTML={{ __html: svg }} />
    </button>
  );
}

export default function WorksheetControls({ config, onChange, onGenerate, onPrint }: Props) {
  const update = (partial: Partial<WorksheetConfig>) => onChange({ ...config, ...partial });
  const available = getAvailableDifficulties(config.childAge);

  const toggleShape = (shape: ShapeName) => {
    const current = config.selectedShapes;
    if (current.includes(shape)) {
      if (current.length <= 2) return; // Minimum 2
      update({ selectedShapes: current.filter(s => s !== shape) });
    } else {
      update({ selectedShapes: [...current, shape] });
    }
  };

  const exerciseIndex = EXERCISE_COUNTS.indexOf(config.exerciseCount);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-5">
        {/* Top-level Mode Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={isHandwritingMode(config.mode) ? 'default' : 'outline'}
            className="h-12 font-display font-bold text-sm gap-1.5"
            onClick={() => { if (!isHandwritingMode(config.mode)) update({ mode: 'handwriting' }); }}
          >
            ✏️ Handwriting
          </Button>
          <Button
            variant={!isHandwritingMode(config.mode) ? 'default' : 'outline'}
            className="h-12 font-display font-bold text-sm gap-1.5"
            onClick={() => { if (isHandwritingMode(config.mode)) update({ mode: 'find' }); }}
          >
            👁️ Visual Perception
          </Button>
        </div>


        {/* Visual Perception sub-mode grid */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Worksheet Type</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {VP_MODES.map(m => (
                <button
                  key={m.value}
                  onClick={() => update({ mode: m.value })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all text-xs font-medium ${
                    config.mode === m.value
                      ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                      : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
                  }`}
                >
                  <span className="text-base leading-none">{m.icon}</span>
                  <span className="font-display">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Maze Controls */}
        {config.mode === 'maze' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Maze Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'small' as MazeSize, label: '8×8' },
                  { value: 'medium' as MazeSize, label: '12×12' },
                  { value: 'large' as MazeSize, label: '16×16' },
                ]).map(s => (
                  <Button
                    key={s.value}
                    variant={config.mazeSize === s.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ mazeSize: s.value })}
                    className="font-display text-xs"
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Shape</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'square' as MazeShape, label: '⬜ Square' },
                  { value: 'rectangle' as MazeShape, label: '▬ Rectangle' },
                  { value: 'circle' as MazeShape, label: '⚪ Circle' },
                ]).map(s => (
                  <Button
                    key={s.value}
                    variant={config.mazeShape === s.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ mazeShape: s.value })}
                    className="font-display text-xs"
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
            {config.difficulty === 'easy' && (
              <div className="flex items-center justify-between">
                <Label className="font-display font-semibold text-sm">Show Solution</Label>
                <Switch checked={config.mazeShowSolution} onCheckedChange={(v) => update({ mazeShowSolution: v })} />
              </div>
            )}
          </div>
        )}

        {/* Connect the Dots Controls */}
        {config.mode === 'connectDots' && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Shape</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { value: 'star' as ConnectDotsShape, label: '⭐ Star' },
                { value: 'heart' as ConnectDotsShape, label: '❤️ Heart' },
                { value: 'house' as ConnectDotsShape, label: '🏠 House' },
                { value: 'fish' as ConnectDotsShape, label: '🐟 Fish' },
                { value: 'sun' as ConnectDotsShape, label: '☀️ Sun' },
                { value: 'butterfly' as ConnectDotsShape, label: '🦋 Butterfly' },
                { value: 'rocket' as ConnectDotsShape, label: '🚀 Rocket' },
                { value: 'tree' as ConnectDotsShape, label: '🌲 Tree' },
                { value: 'catFace' as ConnectDotsShape, label: '🐱 Cat Face' },
                { value: 'flower' as ConnectDotsShape, label: '🌸 Flower' },
              ]).map(s => (
                <button
                  key={s.value}
                  onClick={() => update({ connectDotsShape: s.value })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all text-xs font-medium ${
                    config.connectDotsShape === s.value
                      ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                      : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
                  }`}
                >
                  <span className="font-display">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tracing Paths Controls */}
        {config.mode === 'tracingPaths' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Stroke Type</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  { value: 'mixed' as TracingStrokeType, label: 'Mixed' },
                  { value: 'vertical' as TracingStrokeType, label: 'Vertical' },
                  { value: 'horizontal' as TracingStrokeType, label: 'Horizontal' },
                  { value: 'diagonal' as TracingStrokeType, label: 'Diagonal' },
                  { value: 'curved' as TracingStrokeType, label: 'Curved' },
                  { value: 'waves' as TracingStrokeType, label: 'Waves' },
                  { value: 'zigzag' as TracingStrokeType, label: 'Zigzag' },
                  { value: 'spiral' as TracingStrokeType, label: 'Spiral' },
                  { value: 'loops' as TracingStrokeType, label: 'Loops' },
                ]).map(s => (
                  <Button
                    key={s.value}
                    variant={config.tracingStrokeType === s.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ tracingStrokeType: s.value })}
                    className="font-display text-xs"
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-display font-semibold text-sm">Rows</Label>
                <span className="text-xs font-bold text-primary">{config.tracingRows}</span>
              </div>
              <Slider
                value={[config.tracingRows]}
                min={2}
                max={6}
                step={1}
                onValueChange={([v]) => update({ tracingRows: v })}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Line Thickness</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'thick' as TracingThickness, label: 'Thick' },
                  { value: 'medium' as TracingThickness, label: 'Medium' },
                  { value: 'thin' as TracingThickness, label: 'Thin' },
                ]).map(t => (
                  <Button
                    key={t.value}
                    variant={config.tracingThickness === t.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ tracingThickness: t.value })}
                    className="font-display text-xs"
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scissor Skills Controls */}
        {config.mode === 'scissorSkills' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Line Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'straight' as ScissorLineType, label: 'Straight' },
                  { value: 'wavy' as ScissorLineType, label: 'Wavy' },
                  { value: 'zigzag' as ScissorLineType, label: 'Zigzag' },
                  { value: 'mixed' as ScissorLineType, label: 'Mixed' },
                ]).map(t => (
                  <Button
                    key={t.value}
                    variant={config.scissorLineType === t.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ scissorLineType: t.value })}
                    className="font-display text-xs"
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-display font-semibold text-sm">Number of Lines</Label>
                <span className="text-xs font-bold text-primary">{config.scissorLineCount}</span>
              </div>
              <Slider
                value={[config.scissorLineCount]}
                min={3}
                max={10}
                step={1}
                onValueChange={([v]) => update({ scissorLineCount: v })}
              />
            </div>
          </div>
        )}

        {/* Grid Designs Controls */}
        {config.mode === 'gridDesigns' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Grid Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {([3, 4, 5] as GridDesignSize[]).map(s => (
                  <Button
                    key={s}
                    variant={config.gridDesignSize === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ gridDesignSize: s })}
                    className="font-display text-xs"
                  >
                    {s}×{s}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Pattern Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'shapes' as GridDesignPattern, label: 'Shapes' },
                  { value: 'colors' as GridDesignPattern, label: 'Colors' },
                  { value: 'lines' as GridDesignPattern, label: 'Lines' },
                ]).map(p => (
                  <Button
                    key={p.value}
                    variant={config.gridDesignPattern === p.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ gridDesignPattern: p.value })}
                    className="font-display text-xs"
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* Visual Scanning Controls */}
        {config.mode === 'visualScanning' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Target Character</Label>
              <Input
                value={config.visualScanTarget}
                onChange={(e) => update({ visualScanTarget: e.target.value.slice(0, 1) })}
                maxLength={1}
                className="font-mono text-lg text-center w-16"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Grid Density</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'small' as VisualScanDensity, label: '8×6' },
                  { value: 'medium' as VisualScanDensity, label: '10×8' },
                  { value: 'large' as VisualScanDensity, label: '12×10' },
                ]).map(d => (
                  <Button key={d.value} variant={config.visualScanDensity === d.value ? 'default' : 'outline'} size="sm" onClick={() => update({ visualScanDensity: d.value })} className="font-display text-xs">{d.label}</Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Character Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['large', 'medium', 'small'] as VisualScanCharSize[]).map(s => (
                  <Button key={s} variant={config.visualScanCharSize === s ? 'default' : 'outline'} size="sm" onClick={() => update({ visualScanCharSize: s })} className="font-display text-xs capitalize">{s}</Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Target Frequency</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['few', 'many'] as const).map(f => (
                  <Button key={f} variant={config.visualScanTargetCount === f ? 'default' : 'outline'} size="sm" onClick={() => update({ visualScanTargetCount: f })} className="font-display text-xs capitalize">{f}</Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pixel Art Controls */}
        {config.mode === 'pixelArt' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Theme</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {([
                  { value: 'heart' as PixelArtTheme, label: '❤️ Heart' },
                  { value: 'smiley' as PixelArtTheme, label: '😊 Smiley' },
                  { value: 'star' as PixelArtTheme, label: '⭐ Star' },
                  { value: 'catFace' as PixelArtTheme, label: '🐱 Cat' },
                  { value: 'fish' as PixelArtTheme, label: '🐟 Fish' },
                  { value: 'house' as PixelArtTheme, label: '🏠 House' },
                  { value: 'sun' as PixelArtTheme, label: '☀️ Sun' },
                  { value: 'flower' as PixelArtTheme, label: '🌸 Flower' },
                  { value: 'rainbow' as PixelArtTheme, label: '🌈 Rainbow' },
                  { value: 'rocket' as PixelArtTheme, label: '🚀 Rocket' },
                ]).map(t => (
                  <button
                    key={t.value}
                    onClick={() => update({ pixelArtTheme: t.value })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all text-xs font-medium ${
                      config.pixelArtTheme === t.value
                        ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                        : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
                    }`}
                  >
                    <span className="font-display">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-display font-semibold text-sm">B&W Mode (print-friendly)</Label>
              <Switch checked={config.pixelArtBW} onCheckedChange={(v) => update({ pixelArtBW: v })} />
            </div>
          </div>
        )}
        {/* Odd One Out Type */}
        {config.mode === 'oddOneOut' && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Item Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {ODD_ONE_OUT_TYPES.map(t => (
                <Button
                  key={t.value}
                  variant={config.oddOneOutType === t.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ oddOneOutType: t.value })}
                  className="font-display text-xs"
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Handwriting Practice Controls */}
        {config.mode === 'handwriting' && (
          <div className="space-y-4">
            {/* Sub-mode toggle */}
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={config.handwritingSubMode === 'sentence' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ handwritingSubMode: 'sentence' })}
                  className="font-display text-xs"
                >
                  Sentence
                </Button>
                <Button
                  variant={config.handwritingSubMode === 'wordBoxes' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ handwritingSubMode: 'wordBoxes' })}
                  className="font-display text-xs"
                >
                  Word Boxes
                </Button>
              </div>
            </div>

            {config.handwritingSubMode === 'sentence' && (
              <div className="space-y-2">
                <Label className="font-display font-semibold text-sm">Text to practise</Label>
                <Input
                  value={config.handwritingText}
                  onChange={(e) => update({ handwritingText: e.target.value })}
                  placeholder="e.g. Hello World"
                />
              </div>
            )}

            {config.handwritingSubMode === 'wordBoxes' && (
              <>
                <div className="space-y-2">
                  <Label className="font-display font-semibold text-sm">Words (one per line, max 8)</Label>
                  <Textarea
                    value={config.handwritingWords}
                    onChange={(e) => update({ handwritingWords: e.target.value })}
                    placeholder={"cat\ndog\nbird\nfish"}
                    rows={4}
                    className="text-sm font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-display font-semibold text-sm">Display Mode</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'boxOnly' as WordBoxDisplayMode, label: 'Box Only' },
                      { value: 'trilineOnly' as WordBoxDisplayMode, label: 'Tri-line' },
                      { value: 'both' as WordBoxDisplayMode, label: 'Both' },
                    ]).map(m => (
                      <Button
                        key={m.value}
                        variant={config.wordBoxDisplayMode === m.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => update({ wordBoxDisplayMode: m.value })}
                        className="font-display text-xs"
                      >
                        {m.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {config.handwritingSubMode === 'sentence' && (
              <>
                {/* Practice Rows Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-display font-semibold text-sm">Practice Rows</Label>
                    <span className="text-xs font-bold text-primary">{config.handwritingRows}</span>
                  </div>
                  <Slider
                    value={[config.handwritingRows]}
                    min={2}
                    max={8}
                    step={1}
                    onValueChange={([v]) => update({ handwritingRows: v })}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>2</span><span>8</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-display font-semibold text-sm">Paper Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'triline' as const, label: 'Tri-line' },
                      { value: 'gridbox' as const, label: 'Grid Box' },
                      { value: 'both' as const, label: 'Both' },
                    ]).map(s => (
                      <Button
                        key={s.value}
                        variant={config.handwritingPaperStyle === s.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => update({ handwritingPaperStyle: s.value })}
                        className="font-display text-xs"
                      >
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Font Size Slider (mm) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-display font-semibold text-sm">Font Size</Label>
                <span className="text-xs font-bold text-primary">{config.handwritingFontSizeMm}mm</span>
              </div>
              <Slider
                value={[config.handwritingFontSizeMm]}
                min={8}
                max={35}
                step={1}
                onValueChange={([v]) => update({ handwritingFontSizeMm: v })}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>8mm</span><span>35mm</span>
              </div>
            </div>

            {/* Font Selector — Print and Cursive only */}
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Font</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'print' as HandwritingFont, label: 'Print', family: "'Arial', sans-serif" },
                  { value: 'cursive' as HandwritingFont, label: 'Cursive', family: "'Segoe Script', cursive" },
                ]).map(f => (
                  <Button
                    key={f.value}
                    variant={config.handwritingFont === f.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ handwritingFont: f.value })}
                    className="font-display text-xs"
                  >
                    <span>{f.label}</span>
                    <span className="text-muted-foreground ml-1" style={{ fontFamily: f.family, fontSize: '12px' }}>Aa</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Show Start/End Points toggle */}
            <div className="flex items-center justify-between">
              <Label className="font-display font-semibold text-sm">Show start/end points</Label>
              <Switch checked={config.handwritingShowStartEnd} onCheckedChange={(v) => update({ handwritingShowStartEnd: v })} />
            </div>

            {/* Line Style Controls */}
            <div className="space-y-3 border-t border-border pt-3">
              <Label className="font-display font-semibold text-sm">Line Style</Label>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Line mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: '3-line' as HandwritingLineMode, label: '3-Line' },
                    { value: '4-line' as HandwritingLineMode, label: '4-Line (HK)' },
                  ]).map(m => (
                    <Button
                      key={m.value}
                      variant={config.handwritingLineMode === m.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => update({ handwritingLineMode: m.value })}
                      className="font-display text-xs"
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Coloured lines</Label>
                <Switch checked={config.handwritingShowColoredLines} onCheckedChange={(v) => update({ handwritingShowColoredLines: v })} />
              </div>

              {config.handwritingShowColoredLines && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Line colour</Label>
                  <div className="flex gap-1.5">
                    {([
                      { value: 'red' as HandwritingLineColor, color: '#DC2626', label: 'Red' },
                      { value: 'blue' as HandwritingLineColor, color: '#2563EB', label: 'Blue' },
                      { value: 'green' as HandwritingLineColor, color: '#16A34A', label: 'Green' },
                      { value: 'black' as HandwritingLineColor, color: '#1E293B', label: 'Black' },
                    ]).map(c => (
                      <button
                        key={c.value}
                        onClick={() => update({ handwritingLineColor: c.value })}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${config.handwritingLineColor === c.value ? 'border-foreground scale-110 shadow-sm' : 'border-border hover:border-muted-foreground/50'}`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid Size — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Grid Size</Label>
            <div className="grid grid-cols-4 gap-2">
              {GRID_SIZES.map(s => (
                <Button
                  key={s}
                  variant={config.gridSize === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ gridSize: s })}
                  className="font-display"
                >
                  {s}×{s}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Shape Picker — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Shapes ({config.selectedShapes.length} selected)</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {ALL_SHAPES.map(shape => (
                <ShapeIcon
                  key={shape}
                  shape={shape}
                  selected={config.selectedShapes.includes(shape)}
                  onClick={() => toggleShape(shape)}
                />
              ))}
            </div>
            {config.selectedShapes.length <= 2 && (
              <p className="text-[10px] text-destructive">Minimum 2 shapes required</p>
            )}
          </div>
        )}

        {/* Difficulty — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="font-display font-semibold text-sm">Difficulty</Label>
              {config.childAge !== null && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Auto-set for age {config.childAge}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map(d => (
                <Button
                  key={d.value}
                  variant={config.difficulty === d.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ difficulty: d.value })}
                  className="font-display"
                  disabled={!available[d.value]}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Child's Name & Age */}
        <div className="grid grid-cols-[1fr_80px] gap-2">
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Child's Name</Label>
            <Input
              value={config.childName}
              onChange={(e) => update({ childName: e.target.value })}
              placeholder="Enter name…"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Age</Label>
            <Input
              type="number"
              min={2}
              max={12}
              value={config.childAge ?? ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                const age = val !== null ? Math.min(12, Math.max(2, val)) : null;
                const partial: Partial<WorksheetConfig> = { childAge: age };
                if (age !== null) {
                  if (age <= 3) partial.difficulty = 'easy';
                  else if (age <= 5 && config.difficulty === 'hard') partial.difficulty = 'medium';
                }
                update(partial);
              }}
              placeholder="2-12"
            />
          </div>
        </div>

        {/* Name/Date Header Font Size */}
        <div className="space-y-2">
          <Label className="font-display font-semibold text-sm">Name/Date Size</Label>
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-3 gap-1 flex-1">
              {HEADER_SIZES.map(s => (
                <Button
                  key={s.value}
                  variant={config.nameDateFontSize === s.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ nameDateFontSize: s.value })}
                  className="font-display text-xs"
                >
                  {s.label}
                </Button>
              ))}
            </div>
            <Button
              variant={config.headerBold ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ headerBold: !config.headerBold })}
              className="px-2.5"
              title="Bold name"
            >
              <Bold className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Exercises per sheet — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-display font-semibold text-sm">Exercises per sheet</Label>
              <span className="text-xs font-bold text-primary">{config.exerciseCount}</span>
            </div>
            <Slider
              value={[exerciseIndex >= 0 ? exerciseIndex : 1]}
              min={0}
              max={3}
              step={1}
              onValueChange={([v]) => update({ exerciseCount: EXERCISE_COUNTS[v] })}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              {EXERCISE_COUNTS.map(n => <span key={n}>{n}</span>)}
            </div>
          </div>
        )}

        {/* Custom Instruction */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-display font-semibold text-sm">Custom instruction</Label>
            <span className="text-[10px] text-muted-foreground">{config.customInstruction.length}/120</span>
          </div>
          <Input
            value={config.customInstruction}
            onChange={(e) => {
              if (e.target.value.length <= 120) update({ customInstruction: e.target.value });
            }}
            placeholder="e.g. Circle all the shapes that match!"
          />
          <div className="flex items-center gap-2 mt-1">
            <div className="grid grid-cols-3 gap-1 flex-1">
              {(['small', 'medium', 'large'] as InstructionFontSize[]).map(s => (
                <Button
                  key={s}
                  variant={config.instructionFontSize === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ instructionFontSize: s })}
                  className="font-display text-xs capitalize"
                >
                  {s.charAt(0).toUpperCase()}
                </Button>
              ))}
            </div>
            <Button
              variant={config.instructionBold ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ instructionBold: !config.instructionBold })}
              className="px-2.5"
              title="Bold instruction"
            >
              <Bold className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Border Style — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Border Style</Label>
            <div className="flex gap-2">
              {BORDER_STYLES.map(b => (
                <BorderPreview
                  key={b.value}
                  style={b.value}
                  selected={config.borderStyle === b.value}
                  onClick={() => update({ borderStyle: b.value })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid Lines — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="flex items-center justify-between">
            <Label className="font-display font-semibold text-sm">Grid Lines</Label>
            <Switch checked={config.showGridLines} onCheckedChange={(v) => update({ showGridLines: v })} />
          </div>
        )}

        {/* Colour — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="flex items-center justify-between">
            <Label className="font-display font-semibold text-sm">Colour</Label>
            <Switch checked={config.useColor} onCheckedChange={(v) => update({ useColor: v })} />
          </div>
        )}

        {!isHandwritingMode(config.mode) && (
          <div className="flex items-center justify-between">
            <Label className="font-display font-semibold text-sm">Answer Key</Label>
            <Switch checked={config.showAnswerKey} onCheckedChange={(v) => update({ showAnswerKey: v })} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button onClick={onGenerate} className="font-display font-bold gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate
          </Button>
          <Button onClick={onPrint} variant="outline" className="font-display font-bold gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
