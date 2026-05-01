import { useState } from 'react';
import { WorksheetConfig, WorksheetMode, GridSize, Difficulty, BorderStyle, HeaderFontSize, ShapeName, ALL_SHAPES, SHAPE_COLORS, OddOneOutType, HandwritingPaperStyle, HandwritingFontSize, HandwritingFont, HandwritingSubMode, HandwritingLineColor, HandwritingLineMode, WordBoxDisplayMode, HandwritingLayout, InstructionFontSize, MazeSize, MazeShape, ConnectDotsShape, TracingStrokeType, TracingThickness, ScissorLineType, VisualScanDensity, VisualScanCharSize, PixelArtTheme, EMOJI_THEMES, EMOJI_ELIGIBLE_MODES, EmojiTheme } from '@/lib/shapes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Printer, RefreshCw, Info, Bold, Download, RotateCcw } from 'lucide-react';
import { getShapeSVG } from '@/lib/shapes';

interface Props {
  config: WorksheetConfig;
  onChange: (config: WorksheetConfig) => void;
  onGenerate: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onReset: () => void;
}

const HANDWRITING_MODES: { value: WorksheetMode; label: string; icon: string }[] = [
  { value: 'handwriting', label: 'Practice', icon: '📝' },
];

const VP_MODES: { value: WorksheetMode; label: string; icon: string }[] = [
  { value: 'find', label: 'Find the Shape', icon: '🔍' },
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
  { value: 'visualScanning', label: 'Visual Scanning', icon: '👀' },
  { value: 'pixelArt', label: 'Pixel Art', icon: '🟩' },
];

const VP_MODE_GROUPS: { label: string; emoji: string; modes: typeof VP_MODES }[] = [
  {
    label: 'Popular',
    emoji: '⭐',
    modes: VP_MODES.filter(m => ['find', 'maze', 'tracingPaths', 'oddOneOut'].includes(m.value)),
  },
  {
    label: 'Visual Skills',
    emoji: '👁️',
    modes: VP_MODES.filter(m => ['pattern', 'count', 'sequence', 'mirror', 'figureGround', 'closure', 'visualScanning', 'copy'].includes(m.value)),
  },
  {
    label: 'Fine Motor',
    emoji: '✋',
    modes: VP_MODES.filter(m => ['scissorSkills', 'connectDots', 'pixelArt'].includes(m.value)),
  },
];

// ─── Feature 1: Age-to-defaults ────────────────────────────────────────────
const AGE_DEFAULTS = {
  "3":  { difficulty: "easy"   as Difficulty, gridSize: 2 as GridSize, exercises: 3, fontSize: 35, recommendedTypes: ["tracing-paths", "pixel-art", "connect-the-dots"] },
  "4":  { difficulty: "easy"   as Difficulty, gridSize: 2 as GridSize, exercises: 3, fontSize: 25, recommendedTypes: ["find-the-shape", "tracing-paths", "scissor-skills"] },
  "5":  { difficulty: "easy"   as Difficulty, gridSize: 3 as GridSize, exercises: 5, fontSize: 20, recommendedTypes: ["find-the-shape", "odd-one-out", "what-comes-next"] },
  "6":  { difficulty: "medium" as Difficulty, gridSize: 3 as GridSize, exercises: 5, fontSize: 15, recommendedTypes: ["match-pattern", "figure-ground", "visual-scanning"] },
  "7+": { difficulty: "medium" as Difficulty, gridSize: 4 as GridSize, exercises: 8, fontSize: 12, recommendedTypes: ["visual-scanning", "mirror-image", "copy-the-pattern"] },
} as const;

const KEBAB_TO_MODE: Partial<Record<string, WorksheetMode>> = {
  'find-the-shape':   'find',
  'tracing-paths':    'tracingPaths',
  'pixel-art':        'pixelArt',
  'connect-the-dots': 'connectDots',
  'odd-one-out':      'oddOneOut',
  'match-pattern':    'pattern',
  'find-and-count':   'count',
  'copy-the-pattern': 'copy',
  'what-comes-next':  'sequence',
  'mirror-image':     'mirror',
  'figure-ground':    'figureGround',
  'visual-closure':   'closure',
  'visual-scanning':  'visualScanning',
  'scissor-skills':   'scissorSkills',
  'maze':             'maze',
  'handwriting':      'handwriting',
};

function snapToExerciseCount(n: number): number {
  return EXERCISE_COUNTS.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
  );
}

function getAgeKey(age: number | null): keyof typeof AGE_DEFAULTS | null {
  if (age === null) return null;
  if (age >= 7) return '7+';
  if (age >= 3) return String(age) as keyof typeof AGE_DEFAULTS;
  return null;
}
// ─── Emoji Theme Packs ───────────────────────────────────────────────────────
const THEME_PACKS: Array<{ key: EmojiTheme; name: string; cover: string[]; description: string }> = [
  { key: 'dinosaurs', name: 'Dinosaurs',      cover: ['🦕','🦖','🥚','🦴'], description: 'Dinos & fossils' },
  { key: 'space',     name: 'Space',          cover: ['🚀','⭐','🪐','🌙'], description: 'Rockets & planets' },
  { key: 'ocean',     name: 'Ocean',          cover: ['🐠','🐙','🦀','🐚'], description: 'Sea creatures' },
  { key: 'cars',      name: 'Cars & Transport',cover: ['🚗','🚕','🚙','🏎️'], description: 'Vehicles' },
  { key: 'animals',   name: 'Animals',        cover: ['🐶','🐱','🐸','🐼'], description: 'Cute animals' },
  { key: 'food',      name: 'Food',           cover: ['🍕','🍔','🍦','🍓'], description: 'Yummy food' },
  { key: 'halloween', name: 'Halloween',      cover: ['🎃','👻','🕷️','🦇'], description: 'Spooky fun' },
  { key: 'christmas', name: 'Christmas',      cover: ['🎄','🎅','⭐','🎁'], description: 'Festive season' },
];
const PACK_THEME_KEYS = new Set<EmojiTheme>(THEME_PACKS.map(p => p.key));
const CUSTOM_ONLY_THEMES: EmojiTheme[] = ['transport', 'nature', 'faces'];
// ─────────────────────────────────────────────────────────────────────────────

// ─── Help me choose: guided flow ─────────────────────────────────────────────
const GUIDE_AGES = ['3', '4', '5', '6', '7+'] as const;
type GuideAge = typeof GUIDE_AGES[number];

const GUIDE_CHALLENGES: Array<{ label: string; icon: string; mode: WorksheetMode }> = [
  { label: 'Holding a pencil',          icon: '✏️', mode: 'tracingPaths'   },
  { label: 'Copying from a board',      icon: '📋', mode: 'copy'           },
  { label: 'Staying focused',           icon: '🎯', mode: 'pixelArt'       },
  { label: 'Using scissors',            icon: '✂️', mode: 'scissorSkills'  },
  { label: 'Confusing b / d / p / q',   icon: '🔤', mode: 'visualScanning' },
  { label: 'Finding things on busy pages', icon: '🔍', mode: 'figureGround' },
  { label: 'Spotting patterns',         icon: '🔲', mode: 'pattern'        },
];

const GUIDE_INTERESTS: Array<{ label: string; icon: string; emojiTheme: EmojiTheme | null }> = [
  { label: 'Animals',     icon: '🐶', emojiTheme: 'animals'   },
  { label: 'Dinosaurs',   icon: '🦕', emojiTheme: 'dinosaurs' },
  { label: 'Space',       icon: '🚀', emojiTheme: 'space'     },
  { label: 'Ocean',       icon: '🐠', emojiTheme: 'ocean'     },
  { label: 'Cars',        icon: '🚗', emojiTheme: 'cars'      },
  { label: 'Food',        icon: '🍕', emojiTheme: 'food'      },
  { label: 'Just shapes', icon: '🔷', emojiTheme: null        },
];
// ─────────────────────────────────────────────────────────────────────────────

// ─── Feature 2: OT skill explanations ────────────────────────────────────────
const MODE_EXPLANATIONS: Partial<Record<WorksheetMode, { plain: string; otSkill: string }>> = {
  find:          { plain: "Trains the brain to spot a specific shape among distractions — the same skill children need to find letters on a busy page.", otSkill: "Visual discrimination" },
  oddOneOut:     { plain: "Teaches the child to notice what makes things different, which builds the foundation for letter and number recognition.", otSkill: "Visual discrimination · Categorisation" },
  maze:          { plain: "Builds the ability to plan a path and control the pencil to follow it — both critical for writing fluency.", otSkill: "Visual motor integration · Planning" },
  tracingPaths:  { plain: "Practises the exact pencil strokes used in handwriting, from straight lines to curves and loops, in a low-pressure format.", otSkill: "Pre-writing strokes · Fine motor" },
  pattern:       { plain: "Challenges the child to hold a pattern in mind and find its twin — the same skill used when copying from a board or book.", otSkill: "Visual memory · Pattern recognition" },
  count:         { plain: "Trains the child to find a shape hidden inside a busy overlapping scene — directly linked to reading comprehension and visual attention.", otSkill: "Figure-ground perception · Counting" },
  copy:          { plain: "Child looks at a pattern and recreates it from memory — builds the visual memory and hand control needed for copying written work.", otSkill: "Visual motor integration · Spatial relations" },
  sequence:      { plain: "Builds pattern thinking — the foundation for maths, reading sequences, and understanding how the world is organised.", otSkill: "Visual sequential memory · Pattern recognition" },
  mirror:        { plain: "Child draws the reflection of a pattern — directly trains the spatial awareness needed to stop reversing letters like b and d.", otSkill: "Visual spatial relations · Form constancy" },
  figureGround:  { plain: "Child finds and counts overlapping outlined shapes — the hardest visual skill, and the one most directly linked to reading difficulty.", otSkill: "Figure-ground perception" },
  closure:       { plain: "Child identifies an object even when part of it is hidden — trains the brain to complete incomplete information, essential for reading.", otSkill: "Visual closure · Form constancy" },
  visualScanning:{ plain: "Child scans a dense grid to find a target letter — the most direct exercise for children who reverse b, d, p, and q.", otSkill: "Visual scanning · Reversal recognition" },
  connectDots:   { plain: "Following numbered dots in sequence builds number recognition, pencil control, and the reward of revealing a picture at the end.", otSkill: "Visual sequential memory · Fine motor" },
  scissorSkills: { plain: "Cutting along lines trains both hands to work together — one of the most important milestones in early fine motor development.", otSkill: "Bilateral coordination · Hand strength" },
  pixelArt:      { plain: "Colouring each cell by its number key builds colour matching, scanning, and sustained focus — disguised as pure fun.", otSkill: "Fine motor · Visual scanning · Colour matching" },
  handwriting:   { plain: "Structured line guides help children practise letter formation at the right size, with trace-then-copy building independence gradually.", otSkill: "Letter formation · Fine motor" },
};
// ─── Feature 3: Neurodivergent-friendly chips ─────────────────────────────────
type NdColor = 'blue' | 'teal' | 'purple' | 'amber';

const ND_CHIP_COLORS: Record<NdColor, { bg: string; text: string }> = {
  blue:   { bg: '#E6F1FB', text: '#0C447C' },
  teal:   { bg: '#E1F5EE', text: '#085041' },
  purple: { bg: '#EEEDFE', text: '#3C3489' },
  amber:  { bg: '#FAEEDA', text: '#854F0B' },
};

const MODE_ND_TAGS: Partial<Record<WorksheetMode, Array<{ label: string; color: NdColor; reason: string }>>> = {
  pixelArt: [
    { label: "ADHD-friendly",   color: "blue",   reason: "Short repeatable steps with visible progress. Each cell completed gives immediate reward." },
    { label: "Autism-friendly", color: "teal",   reason: "Predictable structured task with clear rules. No ambiguity about what to do next." },
  ],
  connectDots: [
    { label: "ADHD-friendly",   color: "blue",   reason: "Clear sequential goal with a reveal at the end. Sustains attention through curiosity." },
  ],
  tracingPaths: [
    { label: "ADHD-friendly",   color: "blue",   reason: "Short tasks with clear start and end. Low frustration threshold." },
    { label: "Sensory-friendly", color: "purple", reason: "Repetitive motor movement can be calming. Especially effective with thicker pencils or markers." },
  ],
  visualScanning: [
    { label: "ADHD-friendly",   color: "blue",   reason: "Structured left-to-right scanning builds the sustained attention needed for reading." },
    { label: "Dyslexia support", color: "amber",  reason: "Specifically targets b/d/p/q reversal — the most common visual difficulty in dyslexia." },
  ],
  scissorSkills: [
    { label: "Sensory-friendly", color: "purple", reason: "The physical resistance of cutting provides proprioceptive feedback that helps regulate attention." },
  ],
  find: [
    { label: "Autism-friendly", color: "teal",   reason: "Clear single rule task with no social or interpretive demands. Visually predictable layout." },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

const isHandwritingMode = (mode: WorksheetMode) => mode === 'handwriting';

function handwritingLayoutToConfig(layout: HandwritingLayout): Partial<WorksheetConfig> {
  switch (layout) {
    case 'triline':
      return { handwritingSubMode: 'sentence', handwritingPaperStyle: 'triline', handwritingLineMode: '3-line' };
    case 'fourline':
      return { handwritingSubMode: 'sentence', handwritingPaperStyle: 'triline', handwritingLineMode: '4-line' };
    case 'wordbox':
      return { handwritingSubMode: 'wordBoxes', wordBoxDisplayMode: 'boxOnly', handwritingLineMode: '3-line' };
    case 'gridbox':
      return { handwritingSubMode: 'sentence', handwritingPaperStyle: 'gridbox', handwritingLineMode: '3-line' };
    case 'triline-wordbox':
      return { handwritingSubMode: 'wordBoxes', wordBoxDisplayMode: 'both', handwritingLineMode: '3-line' };
    case 'fourline-wordbox':
      return { handwritingSubMode: 'wordBoxes', wordBoxDisplayMode: 'both', handwritingLineMode: '4-line' };
  }
}

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

// Max exercises per grid size for Match Pattern
const PATTERN_MAX_EXERCISES: Record<number, number> = { 2: 6, 3: 4, 4: 3, 5: 2 };

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

export default function WorksheetControls({ config, onChange, onGenerate, onPrint, onDownload, onReset }: Props) {
  const [celebrating, setCelebrating] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(
    () => !PACK_THEME_KEYS.has(config.emojiTheme)
  );

  // Help me choose — guided flow state
  const [guideStep, setGuideStep] = useState<0 | 1 | 2 | 3>(0);
  const [guideAge, setGuideAge] = useState<GuideAge | null>(null);
  const [guideChallenge, setGuideChallenge] = useState<typeof GUIDE_CHALLENGES[number] | null>(null);
  const [guideInterest, setGuideInterest] = useState<typeof GUIDE_INTERESTS[number] | null>(null);
  const [guideApplied, setGuideApplied] = useState<{ mode: string; age: string | null; theme: string } | null>(null);

  const openGuide = () => {
    setGuideAge(null);
    setGuideChallenge(null);
    setGuideInterest(null);
    // Skip age step if age already known
    setGuideStep(config.childAge !== null ? 2 : 1);
  };

  const dismissGuide = () => {
    setGuideStep(0);
    setGuideAge(null);
    setGuideChallenge(null);
    setGuideInterest(null);
  };

  const applyGuide = () => {
    if (!guideChallenge || !guideInterest) return;
    const partial: Partial<WorksheetConfig> = { mode: guideChallenge.mode };

    // Resolve age: guided selection OR existing child age
    const resolvedAgeKey = guideAge ?? (config.childAge !== null ? getAgeKey(config.childAge) : null);
    if (resolvedAgeKey) {
      const d = AGE_DEFAULTS[resolvedAgeKey];
      partial.difficulty    = d.difficulty;
      partial.gridSize      = d.gridSize;
      partial.exerciseCount = snapToExerciseCount(d.exercises);
      partial.handwritingFontSizeMm = d.fontSize;
      if (guideAge) partial.childAge = parseInt(resolvedAgeKey === '7+' ? '7' : resolvedAgeKey);
    }

    if (guideInterest.emojiTheme) {
      const isEligible = (EMOJI_ELIGIBLE_MODES as readonly WorksheetMode[]).includes(guideChallenge.mode);
      partial.useEmoji   = isEligible;
      partial.emojiTheme = guideInterest.emojiTheme;
      if (isEligible) setShowCustomPicker(false);
    } else {
      partial.useEmoji = false;
    }

    update(partial);
    setGuideApplied({
      mode:  guideChallenge.label,
      age:   resolvedAgeKey,
      theme: guideInterest.label,
    });
    setGuideStep(0);
    setGuideAge(null);
    setGuideChallenge(null);
    setGuideInterest(null);
  };

  const handlePrint = () => {
    setCelebrating(true);
    setTimeout(() => {
      onPrint();
      setTimeout(() => setCelebrating(false), 900);
    }, 280);
  };

  // Feature 1: age-derived state
  const ageKey = getAgeKey(config.childAge);
  const ageDefaults = ageKey ? AGE_DEFAULTS[ageKey] : null;
  const recommendedModeValues: WorksheetMode[] = ageDefaults
    ? (ageDefaults.recommendedTypes as readonly string[])
        .map(k => KEBAB_TO_MODE[k])
        .filter((v): v is WorksheetMode => v !== undefined)
    : [];

  const update = (partial: Partial<WorksheetConfig>) => {
    const merged = { ...config, ...partial };
    // For Match Pattern: cap exerciseCount to the grid-size max
    if (merged.mode === 'pattern') {
      const max = PATTERN_MAX_EXERCISES[merged.gridSize] ?? 6;
      if (merged.exerciseCount > max) merged.exerciseCount = max;
    }
    onChange(merged);
  };
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

        {/* About this child */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2.5">
          <p className="font-display font-bold text-xs text-amber-800 uppercase tracking-wide">About this child</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-amber-700 font-medium">Name</Label>
              <Input
                value={config.childName}
                onChange={(e) => update({ childName: e.target.value })}
                placeholder="Optional"
                className="h-8 text-sm bg-white border-amber-200 focus-visible:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-amber-700 font-medium">Age</Label>
              <Select
                value={config.childAge?.toString() ?? ''}
                onValueChange={(v) => {
                  const age = v ? parseInt(v) : null;
                  const key = getAgeKey(age);
                  const defaults = key ? AGE_DEFAULTS[key] : null;
                  const partial: Partial<WorksheetConfig> = { childAge: age };
                  if (defaults) {
                    partial.difficulty          = defaults.difficulty;
                    partial.gridSize            = defaults.gridSize;
                    partial.exerciseCount       = snapToExerciseCount(defaults.exercises);
                    partial.handwritingFontSizeMm = defaults.fontSize;
                  }
                  update(partial);
                }}
              >
                <SelectTrigger className="h-8 text-sm bg-white border-amber-200 focus:ring-amber-400">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 11 }, (_, i) => i + 2).map(age => (
                    <SelectItem key={age} value={age.toString()}>{age} years</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {config.childAge !== null && ageDefaults && (
                <p className="text-[11px] font-semibold" style={{ color: '#1D9E75' }}>
                  ✓ Adjusted for age {config.childAge}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Help me choose */}
        {guideStep === 0 && (
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={openGuide}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all py-2 text-sm font-display font-semibold text-primary"
            >
              ✨ Help me choose
            </button>
            {guideApplied && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E1F5EE] border border-[#A8DDD0]">
                <span style={{ fontSize: '13px' }}>✓</span>
                <p className="text-[11px] font-semibold text-[#085041] leading-tight flex-1">
                  {guideApplied.mode}
                  {guideApplied.age ? ` · age ${guideApplied.age}` : ''}
                  {guideApplied.theme !== 'Just shapes' ? ` · ${guideApplied.theme}` : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setGuideApplied(null)}
                  className="text-[#1D9E75] hover:text-[#085041] text-[11px] font-bold leading-none"
                >✕</button>
              </div>
            )}
          </div>
        )}

        {guideStep > 0 && (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3.5 space-y-3">
            {/* Step dots */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(s => {
                  const skip1 = config.childAge !== null;
                  if (skip1 && s === 3) return null;
                  const activeStep = skip1 ? s + 1 : s;
                  return (
                    <div
                      key={s}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ background: guideStep >= activeStep ? '#1D9E75' : '#CBD5E1' }}
                    />
                  );
                })}
              </div>
              <button
                type="button"
                onClick={dismissGuide}
                className="text-muted-foreground hover:text-foreground text-xs font-medium leading-none"
              >✕ dismiss</button>
            </div>

            {/* Step 1 — Age */}
            {guideStep === 1 && (
              <div className="space-y-2">
                <p className="font-display font-bold text-sm text-foreground">How old is your child?</p>
                <div className="flex flex-wrap gap-1.5">
                  {GUIDE_AGES.map(age => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => { setGuideAge(age); setGuideStep(2); }}
                      className={`px-3 py-1.5 rounded-full border-2 text-sm font-display font-semibold transition-all ${
                        guideAge === age
                          ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041]'
                          : 'border-border bg-background text-foreground hover:border-[#1D9E75]/50'
                      }`}
                    >
                      {age === '7+' ? '7+ yrs' : `${age} yrs`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Challenge */}
            {guideStep === 2 && (
              <div className="space-y-2">
                <p className="font-display font-bold text-sm text-foreground">What does your child find hard?</p>
                <div className="grid grid-cols-1 gap-1">
                  {GUIDE_CHALLENGES.map(ch => (
                    <button
                      key={ch.mode}
                      type="button"
                      onClick={() => { setGuideChallenge(ch); setGuideStep(3); }}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border-2 text-left text-xs font-medium transition-all ${
                        guideChallenge?.mode === ch.mode
                          ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041]'
                          : 'border-border bg-background text-foreground hover:border-[#1D9E75]/50'
                      }`}
                    >
                      <span style={{ fontSize: '16px' }}>{ch.icon}</span>
                      <span className="font-display font-semibold">{ch.label}</span>
                    </button>
                  ))}
                </div>
                {config.childAge === null && (
                  <button
                    type="button"
                    onClick={() => setGuideStep(1)}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium"
                  >← Back</button>
                )}
              </div>
            )}

            {/* Step 3 — Interest + Apply */}
            {guideStep === 3 && (
              <div className="space-y-2">
                <p className="font-display font-bold text-sm text-foreground">What does your child love?</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {GUIDE_INTERESTS.map(int => (
                    <button
                      key={int.label}
                      type="button"
                      onClick={() => setGuideInterest(int)}
                      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border-2 text-left text-xs font-medium transition-all ${
                        guideInterest?.label === int.label
                          ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041]'
                          : 'border-border bg-background text-foreground hover:border-[#1D9E75]/50'
                      }`}
                    >
                      <span style={{ fontSize: '16px' }}>{int.icon}</span>
                      <span className="font-display font-semibold">{int.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setGuideStep(2)}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium"
                  >← Back</button>
                  <button
                    type="button"
                    disabled={!guideInterest}
                    onClick={applyGuide}
                    className="flex-1 py-2 rounded-lg text-sm font-display font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: guideInterest ? '#1D9E75' : undefined }}
                  >Apply settings ✓</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top-level Mode Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={isHandwritingMode(config.mode) ? 'default' : 'outline'}
            className="h-12 font-display font-bold text-sm gap-1.5 relative"
            onClick={() => { if (!isHandwritingMode(config.mode)) update({ mode: 'handwriting' }); }}
          >
            ✏️ Handwriting
            {MODE_EXPLANATIONS.handwriting && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-50 hover:opacity-100 cursor-help"
                    style={{ fontSize: '11px' }}
                  >ⓘ</span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: '8px', padding: '10px 12px', maxWidth: '260px', fontSize: '12px', zIndex: 50 }}
                >
                  <p className="text-foreground leading-snug">{MODE_EXPLANATIONS.handwriting!.plain}</p>
                  <p className="text-muted-foreground mt-1.5" style={{ fontSize: '11px' }}>{MODE_EXPLANATIONS.handwriting!.otSkill}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </Button>
          <Button
            variant={!isHandwritingMode(config.mode) ? 'default' : 'outline'}
            className="h-12 font-display font-bold text-sm gap-1.5"
            onClick={() => { if (isHandwritingMode(config.mode)) update({ mode: 'find' }); }}
          >
            👁️ Visual Perception
          </Button>
        </div>


        {/* Visual Perception sub-mode grid — grouped by category */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-3">
            <Label className="font-display font-semibold text-sm">Worksheet Type</Label>
            {VP_MODE_GROUPS.map(group => (
              <div key={group.label} className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-0.5">
                  {group.emoji} {group.label}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.modes.map(m => {
                    const isRecommended = recommendedModeValues.includes(m.value);
                    const ndChips = (MODE_ND_TAGS[m.value] ?? []).slice(0, 2);
                    return (
                    <button
                      key={m.value}
                      onClick={() => update({ mode: m.value })}
                      className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all text-xs font-medium ${
                        config.mode === m.value
                          ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
                      }${isRecommended ? ' ring-2 ring-[#1D9E75] ring-offset-1' : ''}`}
                    >
                      <span className="text-base leading-none flex-shrink-0 mt-0.5">{m.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-display leading-tight">{m.label}</span>
                          {MODE_EXPLANATIONS[m.value] && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-shrink-0 text-muted-foreground/60 hover:text-muted-foreground cursor-help leading-none"
                                  style={{ fontSize: '11px' }}
                                >ⓘ</span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                style={{
                                  background: '#fff',
                                  border: '1px solid #E7E5E4',
                                  borderRadius: '8px',
                                  padding: '10px 12px',
                                  maxWidth: '260px',
                                  fontSize: '12px',
                                  zIndex: 50,
                                }}
                              >
                                <p className="text-foreground leading-snug">{MODE_EXPLANATIONS[m.value]!.plain}</p>
                                <p className="text-muted-foreground mt-1.5" style={{ fontSize: '11px' }}>{MODE_EXPLANATIONS[m.value]!.otSkill}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {isRecommended && (
                          <span className="text-[9px] font-bold tracking-wide block mt-0.5" style={{ color: '#1D9E75' }}>
                            ✓ Recommended
                          </span>
                        )}
                        {ndChips.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-1">
                            {ndChips.map(chip => {
                              const colors = ND_CHIP_COLORS[chip.color];
                              return (
                                <Tooltip key={chip.label}>
                                  <TooltipTrigger asChild>
                                    <span
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-block rounded px-1 py-px font-semibold cursor-help leading-tight"
                                      style={{ background: colors.bg, color: colors.text, fontSize: '9px' }}
                                    >
                                      {chip.label}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    style={{ background: '#fff', border: '1px solid #E7E5E4', borderRadius: '8px', padding: '10px 12px', maxWidth: '220px', fontSize: '12px', zIndex: 50 }}
                                  >
                                    <p className="text-foreground leading-snug">{chip.reason}</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </button>
                    );
                  })}
                </div>
              </div>
            ))}
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

        {/* Odd One Out — Custom target for Letters / Numbers */}
        {config.mode === 'oddOneOut' && (config.oddOneOutType === 'letters' || config.oddOneOutType === 'numbers') && (
          <div className="space-y-1.5">
            <Label className="font-display font-semibold text-sm">Custom target (optional)</Label>
            <div className="flex items-center gap-3">
              <Input
                value={config.oddOneOutCustomTarget ?? ''}
                onChange={(e) => update({ oddOneOutCustomTarget: e.target.value.slice(0, 1) })}
                maxLength={1}
                className="font-mono text-lg text-center w-14 h-10"
                placeholder="—"
              />
              <p className="text-[10px] text-muted-foreground leading-tight">
                {config.oddOneOutCustomTarget
                  ? `"${config.oddOneOutCustomTarget}" will appear as the odd one out in every row`
                  : 'Leave empty to use auto-generated targets'}
              </p>
            </div>
          </div>
        )}

        {/* Match Pattern — Quick Start presets */}
        {config.mode === 'pattern' && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Quick Start</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Easy', gridSize: 2 as GridSize, exerciseCount: 3 },
                { label: 'Medium', gridSize: 3 as GridSize, exerciseCount: 3 },
                { label: 'Hard', gridSize: 4 as GridSize, exerciseCount: 2 },
              ].map(p => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  onClick={() => update({ gridSize: p.gridSize, exerciseCount: p.exerciseCount })}
                  className="font-display text-xs"
                >
                  {p.label}
                  <span className="ml-1 text-muted-foreground">{p.gridSize}×{p.gridSize}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Find and Count — single grid selector (replaces global grid + exercises) */}
        {config.mode === 'count' && (
          <div className="space-y-2">
            <Label className="font-display font-semibold text-sm">Grid Size</Label>
            <div className="grid grid-cols-4 gap-2">
              {([2, 3, 4, 5] as GridSize[]).map(s => (
                <Button
                  key={s}
                  variant={config.gridSize === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update({ gridSize: s })}
                  className="font-display text-xs"
                >
                  {s}×{s}
                </Button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {config.gridSize} reference shapes · {config.gridSize}×{config.gridSize} grid ({config.gridSize * config.gridSize} cells)
            </p>
          </div>
        )}

        {/* Handwriting Practice Controls */}
        {config.mode === 'handwriting' && (
          <div className="space-y-4">
            {/* Layout picker — 6 options in 2 columns */}
            <div className="space-y-2">
              <Label className="font-display font-semibold text-sm">Layout</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'triline' as HandwritingLayout, label: 'Tri-line', icon: '📝' },
                  { value: 'fourline' as HandwritingLayout, label: '4-line (HK)', icon: '📝' },
                  { value: 'wordbox' as HandwritingLayout, label: 'Word Box', icon: '🔤' },
                  { value: 'gridbox' as HandwritingLayout, label: 'Grid Box', icon: '⬜' },
                  { value: 'triline-wordbox' as HandwritingLayout, label: 'Tri-line + Word', icon: '📋' },
                  { value: 'fourline-wordbox' as HandwritingLayout, label: '4-line + Word', icon: '📋' },
                ]).map(l => (
                  <Button
                    key={l.value}
                    variant={config.handwritingLayout === l.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const derived = handwritingLayoutToConfig(l.value);
                      update({ handwritingLayout: l.value, ...derived });
                    }}
                    className="font-display text-xs h-auto py-2 flex flex-col gap-0.5"
                  >
                    <span>{l.icon}</span>
                    <span>{l.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Text input — for line-based layouts */}
            {(config.handwritingLayout === 'triline' || config.handwritingLayout === 'fourline' || config.handwritingLayout === 'gridbox') && (
              <div className="space-y-2">
                <Label className="font-display font-semibold text-sm">Text to practise</Label>
                <Input
                  value={config.handwritingText}
                  onChange={(e) => update({ handwritingText: e.target.value })}
                  placeholder="e.g. Hello World"
                />
              </div>
            )}

            {/* Words textarea — for word box layouts */}
            {(config.handwritingLayout === 'wordbox' || config.handwritingLayout === 'triline-wordbox' || config.handwritingLayout === 'fourline-wordbox') && (
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
            )}

            {/* Practice Rows Slider — not applicable for word box layouts */}
            {config.handwritingLayout !== 'wordbox' && config.handwritingLayout !== 'triline-wordbox' && config.handwritingLayout !== 'fourline-wordbox' && (
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

            {/* Line colour — for line-based layouts */}
            {config.handwritingLayout !== 'wordbox' && config.handwritingLayout !== 'gridbox' && (
              <div className="space-y-3 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Stroke guides</Label>
                  <Switch checked={config.handwritingShowStartEnd} onCheckedChange={(v) => update({ handwritingShowStartEnd: v })} />
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
            )}
          </div>
        )}

        {/* Grid Size — VP modes only (hidden for count/figureGround/closure: no effect or own selector) */}
        {!isHandwritingMode(config.mode) && config.mode !== 'count' && config.mode !== 'figureGround' && config.mode !== 'closure' && (
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

        {/* Shape / Emoji Picker — VP modes only */}
        {!isHandwritingMode(config.mode) && (
          <div className="space-y-2">
            {EMOJI_ELIGIBLE_MODES.includes(config.mode) ? (
              <>
                <div className="flex items-center gap-1.5 mb-2">
                  <Button
                    variant={!config.useEmoji ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ useEmoji: false })}
                    className="font-display text-xs flex-1"
                  >
                    🔷 Shapes
                  </Button>
                  <Button
                    variant={config.useEmoji ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ useEmoji: true })}
                    className="font-display text-xs flex-1"
                  >
                    😀 Emoji
                  </Button>
                </div>
                {config.useEmoji ? (
                  <div className="space-y-2">
                    <Label className="font-display font-semibold text-sm">Theme Pack</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {THEME_PACKS.map(pack => {
                        const isSelected = !showCustomPicker && config.emojiTheme === pack.key;
                        return (
                          <button
                            key={pack.key}
                            type="button"
                            onClick={() => { setShowCustomPicker(false); update({ emojiTheme: pack.key }); }}
                            className={`flex flex-col gap-1 p-2.5 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#1D9E75] bg-[#E1F5EE]'
                                : 'border-border bg-background hover:border-muted-foreground/40'
                            }`}
                            style={{ minHeight: '44px' }}
                          >
                            <div className="flex gap-px leading-none">
                              {pack.cover.map((e, i) => <span key={i} style={{ fontSize: '17px' }}>{e}</span>)}
                            </div>
                            <p className="font-display font-bold leading-tight" style={{ fontSize: '13px' }}>{pack.name}</p>
                            <p className="text-muted-foreground leading-none" style={{ fontSize: '11px' }}>{pack.description}</p>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setShowCustomPicker(true)}
                        className={`flex flex-col gap-1 p-2.5 rounded-lg border-2 transition-all text-left ${
                          showCustomPicker
                            ? 'border-[#1D9E75] bg-[#E1F5EE]'
                            : 'border-border bg-background hover:border-muted-foreground/40'
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        <div className="leading-none" style={{ fontSize: '17px' }}>✏️</div>
                        <p className="font-display font-bold leading-tight" style={{ fontSize: '13px' }}>Custom</p>
                        <p className="text-muted-foreground leading-none" style={{ fontSize: '11px' }}>Pick your own</p>
                      </button>
                    </div>
                    {showCustomPicker && (
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        {([...THEME_PACKS.map(p => p.key), ...CUSTOM_ONLY_THEMES] as EmojiTheme[]).map(key => {
                          const theme = EMOJI_THEMES[key];
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => update({ emojiTheme: key })}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-left ${
                                config.emojiTheme === key
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border bg-background hover:border-muted-foreground/40'
                              }`}
                            >
                              <span className="text-base">{theme.icon}</span>
                              <span className="font-display font-semibold text-sm">{theme.label}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{theme.emojis.slice(0, 4).join(' ')}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}

        {/* Difficulty — VP modes only (hidden for pattern: Quick Start presets replace it) */}
        {!isHandwritingMode(config.mode) && config.mode !== 'pattern' && (
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


        {/* Exercises per sheet — pattern mode: custom capped buttons */}
        {!isHandwritingMode(config.mode) && config.mode === 'pattern' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-display font-semibold text-sm">Exercises per sheet</Label>
              <span className="text-[10px] text-amber-600 font-semibold">
                Max {PATTERN_MAX_EXERCISES[config.gridSize] ?? 6} for {config.gridSize}×{config.gridSize}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[2, 3, 4, 5, 6]
                .filter(n => n <= (PATTERN_MAX_EXERCISES[config.gridSize] ?? 6))
                .map(n => (
                  <Button
                    key={n}
                    variant={config.exerciseCount === n ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => update({ exerciseCount: n })}
                    className="font-display text-xs flex-1"
                  >
                    {n}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Exercises per sheet — standard slider for all other VP modes except count/figureGround */}
        {!isHandwritingMode(config.mode) && config.mode !== 'pattern' && config.mode !== 'count' && config.mode !== 'figureGround' && (
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

        {/* Action buttons */}
        <div className="space-y-2.5 pt-3 border-t border-border">
          <Button
            onClick={onGenerate}
            className="w-full h-11 font-display font-bold gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            New Worksheet
          </Button>
          <button
            onClick={handlePrint}
            className={`w-full h-11 rounded-lg font-display font-bold text-sm gap-2 flex items-center justify-center text-white transition-all bg-amber-500 hover:bg-amber-600 active:scale-95 ${celebrating ? 'animate-celebrate' : ''}`}
          >
            <Printer className="w-4 h-4" />
            {celebrating ? '✨ Printing!' : 'Print Worksheet'}
          </button>
          <div className="flex items-center justify-between pt-0.5">
            <Button
              onClick={onDownload}
              variant="ghost"
              size="sm"
              className="font-display text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8"
            >
              <Download className="w-3.5 h-3.5" />
              Save SVG
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="font-display text-xs text-muted-foreground hover:text-destructive gap-1.5 h-8"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
