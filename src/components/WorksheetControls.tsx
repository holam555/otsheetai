import { WorksheetConfig, WorksheetMode, GridSize, ShapeSet, Difficulty } from '@/lib/shapes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, RefreshCw } from 'lucide-react';

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
];

const GRID_SIZES: GridSize[] = [2, 3, 4, 5];
const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export default function WorksheetControls({ config, onChange, onGenerate, onPrint }: Props) {
  const update = (partial: Partial<WorksheetConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="font-display font-semibold text-sm">Mode</Label>
        <Select value={config.mode} onValueChange={(v) => update({ mode: v as WorksheetMode })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {MODES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

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

      <div className="space-y-2">
        <Label className="font-display font-semibold text-sm">Shape Set</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={config.shapeSet === 'basic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => update({ shapeSet: 'basic' as ShapeSet })}
            className="font-display"
          >
            Basic
          </Button>
          <Button
            variant={config.shapeSet === 'extended' ? 'default' : 'outline'}
            size="sm"
            onClick={() => update({ shapeSet: 'extended' as ShapeSet })}
            className="font-display"
          >
            Extended
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-display font-semibold text-sm">Difficulty</Label>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map(d => (
            <Button
              key={d.value}
              variant={config.difficulty === d.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => update({ difficulty: d.value })}
              className="font-display"
            >
              {d.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-display font-semibold text-sm">Child's Name</Label>
        <Input
          value={config.childName}
          onChange={(e) => update({ childName: e.target.value })}
          placeholder="Enter name…"
        />
      </div>

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
  );
}
