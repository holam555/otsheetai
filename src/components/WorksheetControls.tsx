import { WorksheetConfig, WorksheetMode, GridSize, Difficulty, BorderStyle, HeaderFontSize, ShapeName, ALL_SHAPES, SHAPE_COLORS, OddOneOutType, HandwritingPaperStyle, HandwritingFontSize } from '@/lib/shapes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

const MODES: { value: WorksheetMode; label: string }[] = [
  { value: 'find', label: 'Find the Shape' },
  { value: 'missing', label: 'Missing Shape' },
  { value: 'pattern', label: 'Match Pattern' },
  { value: 'count', label: 'Find and Count' },
  { value: 'copy', label: 'Copy the Pattern' },
  { value: 'sequence', label: 'What Comes Next' },
  { value: 'oddOneOut', label: 'Odd One Out' },
  { value: 'mirror', label: 'Mirror Image' },
  { value: 'figureGround', label: 'Figure Ground' },
  { value: 'closure', label: 'Visual Closure' },
  { value: 'traceName', label: 'Trace Your Name' },
  { value: 'handwriting', label: 'Handwriting Practice' },
];

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
        {/* Mode */}
        <div className="space-y-2">
          <Label className="font-display font-semibold text-sm">Mode</Label>
          <Select value={config.mode} onValueChange={(v) => update({ mode: v as WorksheetMode })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MODES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

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
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Text to practise</Label>
              <Input
                value={config.handwritingText}
                onChange={(e) => update({ handwritingText: e.target.value })}
                placeholder="e.g. Hello World"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Practice Rows</Label>
              <div className="grid grid-cols-3 gap-2">
                {([2, 3, 4] as const).map(n => (
                  <Button
                    key={n}
                    variant={config.handwritingRows === n ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ handwritingRows: n })}
                    className="font-display"
                  >
                    {n} rows
                  </Button>
                ))}
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
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Font Size</Label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'large' as const, label: 'Large' },
                  { value: 'medium' as const, label: 'Medium' },
                  { value: 'small' as const, label: 'Small' },
                ]).map(s => (
                  <Button
                    key={s.value}
                    variant={config.handwritingFontSize === s.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ handwritingFontSize: s.value })}
                    className="font-display text-xs"
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}


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

        {/* Shape Picker */}
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

        {/* Difficulty with age-based tooltip */}
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
                // Auto-set difficulty
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

        {/* Exercises per sheet */}
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
        </div>

        {/* Border Style */}
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

        {/* Header Font Size & Bold */}
        <div className="space-y-2">
          <Label className="font-display font-semibold text-sm">Header Style</Label>
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-3 gap-1 flex-1">
              {HEADER_SIZES.map(s => (
                <Button
                  key={s.value}
                  variant={config.headerFontSize === s.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ headerFontSize: s.value })}
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

        {/* Toggles */}
        <div className="flex items-center justify-between">
          <Label className="font-display font-semibold text-sm">Grid Lines</Label>
          <Switch checked={config.showGridLines} onCheckedChange={(v) => update({ showGridLines: v })} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-display font-semibold text-sm">Colour</Label>
          <Switch checked={config.useColor} onCheckedChange={(v) => update({ useColor: v })} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-display font-semibold text-sm">Answer Key</Label>
          <Switch checked={config.showAnswerKey} onCheckedChange={(v) => update({ showAnswerKey: v })} />
        </div>

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
