import { WorksheetConfig, WorksheetMode } from '@/lib/shapes';
import { AgeBand } from '@/lib/defaultConfig';

/**
 * Age-band grading presets — the layer that makes the Age buttons (and child
 * profiles, and template age bands) produce VISIBLY different worksheets.
 *
 * Two-layer grading architecture (see .claude/skills/worksheet-grading):
 *
 *  1. AGE → task SCOPE, set here at the config level: how big the search
 *     field is, how many items, how thick the lines, how large the letters.
 *     This is what a parent sees change when they press an age button.
 *  2. DIFFICULTY → task SUBTLETY, applied inside the generators: target
 *     ratios, rotation, distractor similarity, gap sizes, maze shortcuts.
 *     ageBandConfig() maps age → default difficulty separately.
 *
 * Config-level (not generator-level) on purpose: the user's explicit controls
 * (Grid Size, Rows, …) keep working — pressing an age button re-grades those
 * fields, but the user can still fine-tune afterwards. Template overrides win
 * over these presets (a curated template is a deliberate choice).
 *
 * Values are clinical judgment calls, tuned so each step is a real step:
 * roughly +30–70% more cells/items per band for search tasks.
 */
export function agePresetForMode(mode: WorksheetMode, band: AgeBand): Partial<WorksheetConfig> {
  const i = band === '3-4' ? 0 : band === '5-6' ? 1 : 2;
  const pick = <T,>(a: T, b: T, c: T): T => [a, b, c][i];

  switch (mode) {
    // Search field grows with age: 9 → 16 → 25 cells.
    case 'find':
      return { gridSize: pick(3, 4, 5) };
    // count = N reference shapes + N×N cells; 2 → 3 → 4 kinds to tally.
    case 'count':
      return { gridSize: pick(2, 3, 4) };
    // Visual-motor copying: grid grows, exercise count stays printable.
    case 'copy':
      return { gridSize: pick(2, 3, 4), exerciseCount: 3 };
    case 'mirror':
      return { gridSize: pick(2, 3, 4), exerciseCount: 3 };
    // Pattern matching: bigger pattern per age (its own max-exercise clamp
    // in CustomizeControls keeps the layout printable).
    case 'pattern':
      return { gridSize: pick(2, 3, 4), exerciseCount: 3 };
    // Row-based puzzles: more rows for older children (values must exist on
    // the exercises slider: 3 | 5 | 8).
    case 'sequence':
    case 'oddOneOut':
    case 'closure':
      return { exerciseCount: pick(3, 5, 8) };
    // Maze: physical size is the age lever; difficulty adds/removes shortcuts.
    case 'maze':
      return { mazeSize: pick('small', 'medium', 'large') };
    // Pre-writing: more rows and thinner guide lines as control matures.
    case 'tracingPaths':
      return { tracingRows: pick(3, 4, 5), tracingThickness: pick('thick', 'medium', 'thin') };
    case 'scissorSkills':
      return { scissorLineCount: pick(4, 6, 8) };
    // Cancellation: denser grids and smaller characters with age.
    case 'visualScanning':
      return { visualScanDensity: pick('small', 'medium', 'large'), visualScanCharSize: pick('large', 'medium', 'small') };
    // Handwriting: letter height in mm shrinks as control matures.
    case 'handwriting':
      return { handwritingFontSizeMm: pick(20, 15, 12) };
    // These grade fully through difficulty (connectDots: dot count; pixelArt:
    // artwork tier; figureGround: shape count/size; traceName: letter height),
    // which the age band already sets via ageBandConfig().
    case 'connectDots':
    case 'figureGround':
    case 'pixelArt':
    case 'traceName':
      return {};
  }
}
