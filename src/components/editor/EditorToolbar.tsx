import { Button } from '@/components/ui/button';
import { Printer, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface Props {
  onPrint: () => void;
  onRegenerate: () => void;
  onToggleCustomize: () => void;
  customizeOpen: boolean;
}

export default function EditorToolbar({ onPrint, onRegenerate, onToggleCustomize, customizeOpen }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button onClick={onPrint} className="font-display font-bold gap-2 h-11 px-5 shadow-sm">
        <Printer className="w-4 h-4" /> Print
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
