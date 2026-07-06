import { Button } from '@/components/ui/button';
import { Printer, RefreshCw, SlidersHorizontal, Layers } from 'lucide-react';

interface Props {
  onPrint: () => void;
  onPrintBatch: () => void;
  onRegenerate: () => void;
  onToggleCustomize: () => void;
  customizeOpen: boolean;
}

export default function EditorToolbar({ onPrint, onPrintBatch, onRegenerate, onToggleCustomize, customizeOpen }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button onClick={onPrint} className="font-display font-bold gap-2 h-11 px-5 shadow-sm">
        <Printer className="w-4 h-4" /> Print
      </Button>
      <Button onClick={onPrintBatch} variant="outline" className="font-display font-bold gap-2 h-11" title="Print 5 different versions of this worksheet at once">
        <Layers className="w-4 h-4" /> Print 5 varied
      </Button>
      <Button onClick={onRegenerate} variant="outline" className="font-display font-bold gap-2 h-11">
        <RefreshCw className="w-4 h-4" /> Regenerate
      </Button>
      <Button
        onClick={onToggleCustomize}
        variant={customizeOpen ? 'secondary' : 'outline'}
        className="font-display font-bold gap-2 h-11 ml-auto"
      >
        <SlidersHorizontal className="w-4 h-4" /> Customize
      </Button>
    </div>
  );
}
