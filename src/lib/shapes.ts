export type ShapeName = 'circle' | 'square' | 'triangle' | 'cross' | 'diamond' | 'star' | 'rectangle' | 'oval' | 'heart' | 'arrow' | 'hexagon' | 'pentagon';

export const ALL_SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'cross', 'diamond', 'star', 'rectangle', 'oval', 'heart', 'arrow', 'hexagon', 'pentagon'];
export const BASIC_SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'cross'];
export const EXTENDED_SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'cross', 'diamond', 'star', 'rectangle', 'oval'];

export const SHAPE_COLORS: Record<ShapeName, string> = {
  circle: '#3B82F6',
  square: '#EF4444',
  triangle: '#22C55E',
  cross: '#F59E0B',
  diamond: '#8B5CF6',
  star: '#EC4899',
  rectangle: '#06B6D4',
  oval: '#F97316',
  heart: '#F43F5E',
  arrow: '#6366F1',
  hexagon: '#14B8A6',
  pentagon: '#A855F7',
};

export type WorksheetMode = 'find' | 'missing' | 'pattern' | 'count' | 'copy' | 'sequence' | 'oddOneOut' | 'mirror' | 'figureGround' | 'closure' | 'traceName' | 'handwriting' | 'maze' | 'connectDots' | 'tracingPaths' | 'scissorSkills' | 'colorByNumber' | 'gridDesigns';
export type MazeSize = 'small' | 'medium' | 'large';
export type MazeShape = 'square' | 'rectangle' | 'circle';
export type ConnectDotsShape = 'star' | 'heart' | 'house' | 'fish' | 'sun' | 'butterfly' | 'rocket' | 'tree' | 'catFace' | 'flower';
export type OddOneOutType = 'shapes' | 'letters' | 'numbers';
export type TracingStrokeType = 'vertical' | 'horizontal' | 'diagonal' | 'curved' | 'waves' | 'zigzag' | 'spiral' | 'loops' | 'mixed';
export type TracingThickness = 'thick' | 'medium' | 'thin';
export type ScissorLineType = 'straight' | 'wavy' | 'zigzag' | 'mixed';
export type ColorByNumberTheme = 'shapes' | 'animal' | 'pattern';
export type GridDesignSize = 3 | 4 | 5;
export type GridDesignPattern = 'shapes' | 'colors' | 'lines';
export type GridSize = 2 | 3 | 4 | 5;
export type ShapeSet = 'basic' | 'extended' | 'custom';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type BorderStyle = 'plain' | 'dotted' | 'rounded';
export type HeaderFontSize = 'small' | 'medium' | 'large';
export type HandwritingPaperStyle = 'triline' | 'gridbox' | 'both';
export type HandwritingFontSize = 'large' | 'medium' | 'small';
export type HandwritingFont = 'print' | 'cursive' | 'manuscript' | 'dotted';
export type HandwritingSubMode = 'sentence' | 'wordBoxes';
export type HandwritingLineColor = 'red' | 'blue' | 'green' | 'purple' | 'black';
export type HandwritingHighlightColor = 'blue' | 'yellow' | 'green' | 'pink' | 'none';

export interface WorksheetConfig {
  mode: WorksheetMode;
  gridSize: GridSize;
  shapeSet: ShapeSet;
  selectedShapes: ShapeName[];
  difficulty: Difficulty;
  childName: string;
  childAge: number | null;
  showGridLines: boolean;
  useColor: boolean;
  showAnswerKey: boolean;
  exerciseCount: number;
  customInstruction: string;
  borderStyle: BorderStyle;
  headerFontSize: HeaderFontSize;
  headerBold: boolean;
  oddOneOutType: OddOneOutType;
  handwritingText: string;
  handwritingRows: number;
  handwritingPaperStyle: HandwritingPaperStyle;
  handwritingFontSize: HandwritingFontSize;
  handwritingFontSizeMm: number;
  handwritingFont: HandwritingFont;
  handwritingSubMode: HandwritingSubMode;
  handwritingWords: string;
  handwritingShowHighlight: boolean;
  handwritingShowColoredLines: boolean;
  handwritingLineColor: HandwritingLineColor;
  handwritingHighlightColor: HandwritingHighlightColor;
  mazeSize: MazeSize;
  mazeShape: MazeShape;
  mazeShowSolution: boolean;
  connectDotsShape: ConnectDotsShape;
}

export interface CellData {
  shape: ShapeName;
  isTarget?: boolean;
  isBlank?: boolean;
  rotation?: number;
}

export interface MissingPuzzle {
  grid: CellData[][];
  blankRow: number;
  blankCol: number;
  answer: ShapeName;
}

export interface PatternPuzzle {
  pattern: CellData[][];
  options: CellData[][][];
  correctIndex: number;
}

export interface CountPuzzle {
  grid: CellData[][];
  targetShapes: ShapeName[];
  counts: Record<ShapeName, number>;
}

export interface CopyPuzzle {
  sourceGrid: CellData[][];
}

export interface SequencePuzzle {
  sequence: CellData[];
  answer: CellData;
  options: CellData[];
  correctIndex: number;
}

export interface OddOneOutRow {
  items: CellData[];
  oddIndex: number;
  textItems?: string[];
  oddText?: string;
}

export interface TraceNameData {
  letters: string[];
  sections: string[][];
}

export interface MirrorPuzzle {
  sourceGrid: (CellData | null)[][];
  mirroredGrid: (CellData | null)[][];
}

export interface FigureGroundPuzzle {
  shapes: { shape: ShapeName; cx: number; cy: number; r: number; rotation: number }[];
  targetShapes: ShapeName[];
  counts: Record<ShapeName, number>;
}

export interface ClosurePuzzle {
  shape: ShapeName;
  dashArray: string;
  options: ShapeName[];
  correctIndex: number;
}

export interface MazeCell {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

export interface MazeData {
  grid: MazeCell[][];
  rows: number;
  cols: number;
  shape: MazeShape;
  solution: [number, number][];
}

export interface ConnectDotsData {
  dots: { x: number; y: number; index: number }[];
  shapeName: ConnectDotsShape;
  completedPath: string;
}

export interface WorksheetData {
  mode: WorksheetMode;
  instructions: string;
  skillLabel: string;
  targetShape?: ShapeName;
  grid?: CellData[][];
  referenceShapes?: ShapeName[];
  missingPuzzles?: MissingPuzzle[];
  patternPuzzles?: PatternPuzzle[];
  countPuzzle?: CountPuzzle;
  copyPuzzles?: CopyPuzzle[];
  sequencePuzzles?: SequencePuzzle[];
  oddOneOutRows?: OddOneOutRow[];
  mirrorPuzzles?: MirrorPuzzle[];
  figureGroundPuzzle?: FigureGroundPuzzle;
  closurePuzzles?: ClosurePuzzle[];
  traceNameData?: TraceNameData;
  handwritingData?: HandwritingData;
  mazeData?: MazeData;
  connectDotsData?: ConnectDotsData;
}

export interface HandwritingData {
  text: string;
  rows: number;
  paperStyle: HandwritingPaperStyle;
  fontSize: HandwritingFontSize;
  fontSizeMm: number;
  font: HandwritingFont;
  subMode: HandwritingSubMode;
  words: string[];
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function getDifficultyRotation(difficulty: Difficulty): number {
  if (difficulty === 'hard') return [0, 15, 30, 45, 90, 180][Math.floor(Math.random() * 6)];
  if (difficulty === 'medium') return [0, 0, 0, 45][Math.floor(Math.random() * 4)];
  return 0;
}

const SIMILAR_SHAPES: Partial<Record<ShapeName, ShapeName[]>> = {
  circle: ['oval'],
  oval: ['circle'],
  square: ['rectangle', 'diamond'],
  rectangle: ['square'],
  diamond: ['square'],
  triangle: ['diamond', 'pentagon'],
  star: ['cross'],
  cross: ['star'],
  heart: ['diamond'],
  arrow: ['triangle'],
  hexagon: ['pentagon'],
  pentagon: ['hexagon', 'triangle'],
};

function getSimilarDistractors(target: ShapeName, shapes: ShapeName[], difficulty: Difficulty): ShapeName[] {
  if (difficulty === 'hard') {
    const similar = SIMILAR_SHAPES[target] ?? [];
    const available = similar.filter(s => shapes.includes(s));
    if (available.length > 0) return available;
  }
  return shapes.filter(s => s !== target);
}

function getActiveShapes(config: WorksheetConfig): ShapeName[] {
  return config.selectedShapes.length >= 2 ? config.selectedShapes : BASIC_SHAPES;
}

// ========== MODE 1: FIND THE SHAPE ==========
function generateFindMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const size = config.gridSize;
  const totalCells = size * size;

  const targetShape = randomFrom(shapes);
  const targetRatio = config.difficulty === 'easy' ? 0.4 : config.difficulty === 'medium' ? 0.25 : 0.15;
  const targetCount = Math.max(2, Math.round(totalCells * targetRatio));

  const distractorPool = config.difficulty === 'hard'
    ? getSimilarDistractors(targetShape, shapes, 'hard').concat(shapes.filter(s => s !== targetShape))
    : shapes.filter(s => s !== targetShape);

  const cells: CellData[] = [];
  for (let i = 0; i < targetCount; i++) {
    cells.push({ shape: targetShape, isTarget: true, rotation: 0 });
  }
  for (let i = targetCount; i < totalCells; i++) {
    cells.push({
      shape: randomFrom(distractorPool),
      isTarget: false,
      rotation: getDifficultyRotation(config.difficulty),
    });
  }

  const shuffled = shuffle(cells);
  const grid: CellData[][] = [];
  for (let r = 0; r < size; r++) {
    grid.push(shuffled.slice(r * size, (r + 1) * size));
  }

  return {
    mode: 'find',
    instructions: `Find and circle all the ${targetShape}s!`,
    skillLabel: 'Visual Discrimination',
    targetShape,
    grid,
  };
}

// ========== MODE 2: MISSING SHAPE ==========
function generateMissingMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const refShapes = shapes.slice(0, 4);
  const puzzleSize = config.gridSize <= 3 ? 2 : 3;
  const puzzleCount = config.exerciseCount;

  const puzzles: MissingPuzzle[] = [];
  for (let p = 0; p < puzzleCount; p++) {
    const totalCells = puzzleSize * puzzleSize;
    const cells: CellData[] = [];
    for (let i = 0; i < totalCells; i++) {
      cells.push({
        shape: refShapes[i % refShapes.length],
        isBlank: false,
        rotation: getDifficultyRotation(config.difficulty),
      });
    }
    const blankIdx = Math.floor(Math.random() * totalCells);
    const answer = cells[blankIdx].shape;
    cells[blankIdx] = { shape: answer, isBlank: true };

    const grid: CellData[][] = [];
    for (let r = 0; r < puzzleSize; r++) {
      grid.push(cells.slice(r * puzzleSize, (r + 1) * puzzleSize));
    }

    puzzles.push({
      grid,
      blankRow: Math.floor(blankIdx / puzzleSize),
      blankCol: blankIdx % puzzleSize,
      answer,
    });
  }

  return {
    mode: 'missing',
    instructions: 'Draw the missing shape in each grid!',
    skillLabel: 'Shape Recognition',
    referenceShapes: refShapes,
    missingPuzzles: puzzles,
  };
}

// ========== MODE 3: MATCH PATTERN ==========
function generatePatternMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const puzzleCount = config.exerciseCount;

  const puzzles: PatternPuzzle[] = [];
  for (let p = 0; p < puzzleCount; p++) {
    const patternShapes = pickN(shapes, Math.min(4, shapes.length));
    const pattern: CellData[][] = [
      [
        { shape: patternShapes[0], rotation: getDifficultyRotation(config.difficulty) },
        { shape: patternShapes[1 % patternShapes.length], rotation: getDifficultyRotation(config.difficulty) },
      ],
      [
        { shape: patternShapes[2 % patternShapes.length], rotation: getDifficultyRotation(config.difficulty) },
        { shape: patternShapes[3 % patternShapes.length], rotation: getDifficultyRotation(config.difficulty) },
      ],
    ];

    const correct: CellData[][] = pattern.map(row => row.map(c => ({ ...c })));

    const distractors: CellData[][][] = [];
    for (let d = 0; d < 2; d++) {
      if (config.difficulty === 'hard') {
        const dr = Math.floor(Math.random() * 2);
        const dc = Math.floor(Math.random() * 2);
        const origShape = pattern[dr][dc].shape;
        const similar = getSimilarDistractors(origShape, shapes, 'hard');
        const replacement = similar.length > 0 ? randomFrom(similar) : randomFrom(shapes.filter(s => s !== origShape));
        const distractor: CellData[][] = pattern.map(row => row.map(c => ({ ...c })));
        distractor[dr][dc] = { shape: replacement, rotation: getDifficultyRotation('hard') };
        distractors.push(distractor);
      } else {
        const distractor: CellData[][] = pattern.map(row => row.map(c => ({ ...c })));
        const swapCount = config.difficulty === 'easy' ? 2 : 1;
        for (let s = 0; s < swapCount; s++) {
          const dr = Math.floor(Math.random() * 2);
          const dc = Math.floor(Math.random() * 2);
          distractor[dr][dc] = { shape: randomFrom(shapes.filter(sh => sh !== distractor[dr][dc].shape)) };
        }
        distractors.push(distractor);
      }
    }

    const options = [correct, ...distractors];
    const indices = shuffle([0, 1, 2]);
    const shuffledOptions = indices.map(i => options[i]);
    const newCorrectIndex = indices.indexOf(0);

    puzzles.push({
      pattern,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
    });
  }

  return {
    mode: 'pattern',
    instructions: 'Draw a line from each pattern to its match!',
    skillLabel: 'Pattern Recognition',
    patternPuzzles: puzzles,
  };
}

// ========== MODE 4: FIND AND COUNT ==========
function generateCountMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  // Scale grid density based on exerciseCount
  const densityScale = config.exerciseCount / 5;
  const ROWS = Math.min(12, Math.max(6, Math.round(8 * densityScale)));
  const COLS = 6;
  const totalCells = ROWS * COLS;

  const targetCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 4 : Math.min(5, shapes.length);
  const targetShapes = pickN(shapes, targetCount);

  const pool = config.difficulty === 'hard'
    ? [...targetShapes, ...shapes.filter(s => !targetShapes.includes(s))]
    : targetShapes;

  const cells: CellData[] = [];
  for (let i = 0; i < totalCells; i++) {
    cells.push({
      shape: randomFrom(pool),
      rotation: getDifficultyRotation(config.difficulty),
    });
  }

  const shuffled = shuffle(cells);
  const grid: CellData[][] = [];
  for (let r = 0; r < ROWS; r++) {
    grid.push(shuffled.slice(r * COLS, (r + 1) * COLS));
  }

  const counts: Record<string, number> = {};
  targetShapes.forEach(s => counts[s] = 0);
  grid.forEach(row => row.forEach(cell => {
    if (counts[cell.shape] !== undefined) counts[cell.shape]++;
  }));

  return {
    mode: 'count',
    instructions: 'Count how many of each shape you can find!',
    skillLabel: 'Visual Scanning · Figure-Ground',
    countPuzzle: {
      grid,
      targetShapes,
      counts: counts as Record<ShapeName, number>,
    },
  };
}

// ========== MODE 5: COPY THE PATTERN ==========
function generateCopyMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const gridSize = config.difficulty === 'easy' ? 3 : 4;
  const puzzleCount = Math.min(config.exerciseCount, 5);

  const puzzles: CopyPuzzle[] = [];
  for (let p = 0; p < puzzleCount; p++) {
    const cells: CellData[][] = [];
    for (let r = 0; r < gridSize; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < gridSize; c++) {
        row.push({
          shape: randomFrom(shapes),
          rotation: getDifficultyRotation(config.difficulty),
        });
      }
      cells.push(row);
    }
    puzzles.push({ sourceGrid: cells });
  }

  return {
    mode: 'copy',
    instructions: 'Copy each pattern into the empty grid!',
    skillLabel: 'Visual Motor Integration · Spatial Relations',
    copyPuzzles: puzzles,
  };
}

// ========== MODE 6: WHAT COMES NEXT ==========
function generateSequenceMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const puzzles: SequencePuzzle[] = [];
  const puzzleCount = config.exerciseCount;

  for (let p = 0; p < puzzleCount; p++) {
    let patternLen: number;
    if (config.difficulty === 'easy') {
      patternLen = 2;
    } else if (config.difficulty === 'medium') {
      patternLen = randomFrom([2, 3]);
    } else {
      patternLen = 3;
    }

    const patternShapes = pickN(shapes, Math.min(patternLen, shapes.length));
    const sequence: CellData[] = [];
    for (let i = 0; i < 4; i++) {
      sequence.push({
        shape: patternShapes[i % patternShapes.length],
        rotation: getDifficultyRotation(config.difficulty),
      });
    }
    const answer: CellData = {
      shape: patternShapes[4 % patternShapes.length],
      rotation: getDifficultyRotation(config.difficulty),
    };

    const distractorShapes = shapes.filter(s => s !== answer.shape);
    const options: CellData[] = [
      answer,
      { shape: randomFrom(distractorShapes) },
      { shape: randomFrom(distractorShapes.filter(s => s !== answer.shape)) },
    ];
    const indices = shuffle([0, 1, 2]);
    const shuffledOptions = indices.map(i => options[i]);
    const correctIndex = indices.indexOf(0);

    puzzles.push({ sequence, answer, options: shuffledOptions, correctIndex });
  }

  return {
    mode: 'sequence',
    instructions: 'What comes next? Circle the correct shape!',
    skillLabel: 'Visual Sequential Memory · Pattern Recognition',
    sequencePuzzles: puzzles,
  };
}

// ========== MODE 7: ODD ONE OUT ==========
function generateOddOneOutMode(config: WorksheetConfig): WorksheetData {
  if (config.oddOneOutType === 'letters') return generateOddOneOutLetters(config);
  if (config.oddOneOutType === 'numbers') return generateOddOneOutNumbers(config);
  return generateOddOneOutShapes(config);
}

function generateOddOneOutShapes(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const rows: OddOneOutRow[] = [];
  const rowCount = config.exerciseCount;

  for (let r = 0; r < rowCount; r++) {
    const baseShape = randomFrom(shapes);
    const baseRotation = getDifficultyRotation(config.difficulty);
    const oddIndex = Math.floor(Math.random() * 5);

    const items: CellData[] = [];
    for (let i = 0; i < 5; i++) {
      if (i === oddIndex) {
        if (config.difficulty === 'easy') {
          const diffShape = randomFrom(shapes.filter(s => s !== baseShape));
          items.push({ shape: diffShape, rotation: 0 });
        } else if (config.difficulty === 'medium') {
          const similar = getSimilarDistractors(baseShape, shapes, 'hard');
          const diffShape = similar.length > 0 ? randomFrom(similar) : randomFrom(shapes.filter(s => s !== baseShape));
          items.push({ shape: diffShape, rotation: baseRotation });
        } else {
          const rotDiff = baseRotation === 0 ? randomFrom([15, 30, 45, 90, 180]) : 0;
          items.push({ shape: baseShape, rotation: rotDiff });
        }
      } else {
        items.push({ shape: baseShape, rotation: baseRotation });
      }
    }
    rows.push({ items, oddIndex });
  }

  return {
    mode: 'oddOneOut',
    instructions: 'Circle the odd one out in each row!',
    skillLabel: 'Visual Discrimination',
    oddOneOutRows: rows,
  };
}

function generateOddOneOutLetters(config: WorksheetConfig): WorksheetData {
  const SIMILAR_LETTERS: Record<string, string[]> = {
    b: ['d', 'p', 'q'], d: ['b', 'p', 'q'], p: ['b', 'd', 'q'], q: ['b', 'd', 'p'],
    E: ['F'], F: ['E'], m: ['n'], n: ['m'], M: ['N', 'W'], N: ['M'], C: ['G'], G: ['C'],
  };
  const CASE_VARIANTS: Record<string, string> = {
    a: 'A', A: 'a', b: 'B', B: 'b', c: 'C', C: 'c', d: 'D', D: 'd', e: 'E', E: 'e',
    f: 'F', F: 'f', g: 'G', G: 'g', h: 'H', H: 'h', i: 'I', I: 'i', j: 'J', J: 'j',
    k: 'K', K: 'k', l: 'L', L: 'l', m: 'M', M: 'm', n: 'N', N: 'n', o: 'O', O: 'o',
    p: 'P', P: 'p', q: 'Q', Q: 'q', r: 'R', R: 'r', s: 'S', S: 's', t: 'T', T: 't',
    u: 'U', U: 'u', v: 'V', V: 'v', w: 'W', W: 'w', x: 'X', X: 'x', y: 'Y', Y: 'y', z: 'Z', Z: 'z',
  };
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const easyPairs = [
    ['A', 'B'], ['C', 'M'], ['O', 'X'], ['P', 'W'], ['H', 'S'], ['D', 'K'], ['E', 'Z'], ['G', 'T'],
  ];
  const mediumBase = ['b', 'd', 'E', 'F', 'M', 'N', 'C', 'G'];
  const hardBase = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const rows: OddOneOutRow[] = [];
  const rowCount = config.exerciseCount;

  for (let r = 0; r < rowCount; r++) {
    const oddIndex = Math.floor(Math.random() * 5);
    let baseLetter: string;
    let oddLetter: string;

    if (config.difficulty === 'easy') {
      const pair = easyPairs[r % easyPairs.length];
      baseLetter = pair[0];
      oddLetter = pair[1];
    } else if (config.difficulty === 'medium') {
      baseLetter = mediumBase[r % mediumBase.length];
      const similar = SIMILAR_LETTERS[baseLetter] || [];
      oddLetter = similar.length > 0 ? randomFrom(similar) : randomFrom(allLetters.filter(l => l !== baseLetter));
    } else {
      baseLetter = hardBase[r % hardBase.length];
      oddLetter = CASE_VARIANTS[baseLetter] || baseLetter.toUpperCase();
    }

    const textItems: string[] = [];
    const items: CellData[] = [];
    for (let i = 0; i < 5; i++) {
      textItems.push(i === oddIndex ? oddLetter : baseLetter);
      items.push({ shape: 'circle' }); // placeholder
    }
    rows.push({ items, oddIndex, textItems, oddText: oddLetter });
  }

  return {
    mode: 'oddOneOut',
    instructions: 'Circle the odd letter in each row!',
    skillLabel: 'Visual Discrimination · Letter Recognition',
    oddOneOutRows: rows,
  };
}

function generateOddOneOutNumbers(config: WorksheetConfig): WorksheetData {
  const SIMILAR_NUMBERS: Record<string, string[]> = {
    '6': ['9'], '9': ['6'], '1': ['7', 'l'], '7': ['1'], '2': ['Z'], '5': ['S'], '0': ['O'], '3': ['8'], '8': ['3'],
  };
  const easyPairs = [
    ['3', '7'], ['1', '4'], ['2', '5'], ['6', '8'], ['0', '9'], ['4', '7'], ['1', '2'], ['5', '8'],
  ];
  const mediumBase = ['6', '9', '1', '7', '2', '5', '0', '3'];
  const hardPairs = [
    ['2', 'Z'], ['5', 'S'], ['0', 'O'], ['1', 'l'], ['8', 'B'], ['6', 'b'], ['9', 'q'], ['3', 'E'],
  ];

  const rows: OddOneOutRow[] = [];
  const rowCount = config.exerciseCount;

  for (let r = 0; r < rowCount; r++) {
    const oddIndex = Math.floor(Math.random() * 5);
    let baseChar: string;
    let oddChar: string;

    if (config.difficulty === 'easy') {
      const pair = easyPairs[r % easyPairs.length];
      baseChar = pair[0];
      oddChar = pair[1];
    } else if (config.difficulty === 'medium') {
      baseChar = mediumBase[r % mediumBase.length];
      const similar = SIMILAR_NUMBERS[baseChar] || [];
      oddChar = similar.length > 0 ? randomFrom(similar) : String((parseInt(baseChar) + 3) % 10);
    } else {
      const pair = hardPairs[r % hardPairs.length];
      baseChar = pair[0];
      oddChar = pair[1];
    }

    const textItems: string[] = [];
    const items: CellData[] = [];
    for (let i = 0; i < 5; i++) {
      textItems.push(i === oddIndex ? oddChar : baseChar);
      items.push({ shape: 'circle' }); // placeholder
    }
    rows.push({ items, oddIndex, textItems, oddText: oddChar });
  }

  return {
    mode: 'oddOneOut',
    instructions: 'Circle the odd number in each row!',
    skillLabel: 'Visual Discrimination · Number Recognition',
    oddOneOutRows: rows,
  };
}

// ========== MODE 8: MIRROR IMAGE ==========
function generateMirrorMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const gridSize = 4;
  const shapeCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 5 : 7;
  const puzzleCount = Math.min(config.exerciseCount, 4);

  const puzzles: MirrorPuzzle[] = [];
  for (let p = 0; p < puzzleCount; p++) {
    const sourceGrid: (CellData | null)[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => null)
    );

    const positions = shuffle(
      Array.from({ length: gridSize * gridSize }, (_, i) => i)
    ).slice(0, shapeCount);

    positions.forEach(pos => {
      const r = Math.floor(pos / gridSize);
      const c = pos % gridSize;
      sourceGrid[r][c] = {
        shape: randomFrom(shapes),
        rotation: getDifficultyRotation(config.difficulty),
      };
    });

    const mirroredGrid: (CellData | null)[][] = sourceGrid.map(row =>
      [...row].reverse().map(cell =>
        cell ? { ...cell } : null
      )
    );

    puzzles.push({ sourceGrid, mirroredGrid });
  }

  return {
    mode: 'mirror',
    instructions: 'Draw the mirror image on the right side!',
    skillLabel: 'Visual Spatial Relations · Form Constancy',
    mirrorPuzzles: puzzles,
  };
}

// ========== MODE 9: FIGURE GROUND ==========
function generateFigureGroundMode(config: WorksheetConfig): WorksheetData {
  const allShapes = getActiveShapes(config);
  const targetCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 4 : 5;
  const shapeTotal = config.difficulty === 'easy' ? 6 : config.difficulty === 'medium' ? 8 : 10;
  const targetShapes = pickN(allShapes, Math.min(targetCount, allShapes.length));

  const placed: { shape: ShapeName; cx: number; cy: number; r: number; rotation: number }[] = [];
  const counts: Record<string, number> = {};
  targetShapes.forEach(s => (counts[s] = 0));

  const areaW = 400;
  const areaH = 400;

  for (let i = 0; i < shapeTotal; i++) {
    const shape = randomFrom(targetShapes);
    counts[shape]++;
    const r = config.difficulty === 'easy' ? randomFrom([50, 60, 70]) : randomFrom([35, 45, 55]);
    placed.push({
      shape,
      cx: 80 + Math.random() * (areaW - 160),
      cy: 80 + Math.random() * (areaH - 160),
      r,
      rotation: getDifficultyRotation(config.difficulty),
    });
  }

  return {
    mode: 'figureGround',
    instructions: 'Find and count each shape in the overlapping picture!',
    skillLabel: 'Figure-Ground Perception',
    figureGroundPuzzle: {
      shapes: placed,
      targetShapes,
      counts: counts as Record<ShapeName, number>,
    },
  };
}

// ========== MODE 10: VISUAL CLOSURE ==========
function generateClosureMode(config: WorksheetConfig): WorksheetData {
  const shapes = getActiveShapes(config);
  const puzzleCount = config.exerciseCount;
  const puzzles: ClosurePuzzle[] = [];

  for (let i = 0; i < puzzleCount; i++) {
    const shape = randomFrom(shapes);
    const gapRatio = config.difficulty === 'easy' ? 0.15 : config.difficulty === 'medium' ? 0.3 : 0.5;
    const dashLen = 8;
    const gapLen = Math.round(dashLen * gapRatio / (1 - gapRatio));
    const dashArray = `${dashLen},${Math.max(3, gapLen)}`;

    const distractors = pickN(shapes.filter(s => s !== shape), Math.min(2, shapes.filter(s => s !== shape).length));
    const options = [shape, ...distractors];
    while (options.length < 3) options.push(randomFrom(shapes));
    const indices = shuffle([0, 1, 2]);
    const shuffledOptions = indices.map(i => options[i]);
    const correctIndex = indices.indexOf(0);

    puzzles.push({ shape, dashArray, options: shuffledOptions, correctIndex });
  }

  return {
    mode: 'closure',
    instructions: 'What shape is it? Circle the correct answer!',
    skillLabel: 'Visual Closure',
    closurePuzzles: puzzles,
  };
}

// ========== MODE 11: TRACE YOUR NAME ==========
function generateTraceNameMode(config: WorksheetConfig): WorksheetData {
  const name = (config.childName || 'NAME').toUpperCase().replace(/[^A-Z]/g, '');
  const letters = name.split('');
  const sections: string[][] = [];
  for (let i = 0; i < letters.length; i += 5) {
    sections.push(letters.slice(i, i + 5));
  }

  return {
    mode: 'traceName',
    instructions: `Trace the letters of your name!`,
    skillLabel: 'Handwriting · Fine Motor',
    traceNameData: { letters, sections },
  };
}

// ========== MODE 12: HANDWRITING PRACTICE ==========
function generateHandwritingMode(config: WorksheetConfig): WorksheetData {
  const text = config.handwritingText || config.childName || 'Hello';
  return {
    mode: 'handwriting',
    instructions: 'Practise your handwriting! Trace the grey letters, then write on your own.',
    skillLabel: 'Handwriting · Fine Motor',
    handwritingData: {
      text,
      rows: config.handwritingRows,
      paperStyle: config.handwritingPaperStyle,
      fontSize: config.handwritingFontSize,
      fontSizeMm: config.handwritingFontSizeMm,
      font: config.handwritingFont,
      subMode: config.handwritingSubMode,
      words: config.handwritingWords ? config.handwritingWords.split('\n').filter(w => w.trim()).slice(0, 8) : [],
    },
  };
}

// ========== MODE 13: MAZE ==========
function generateMazeMode(config: WorksheetConfig): WorksheetData {
  const sizeMap: Record<MazeSize, number> = { small: 8, medium: 12, large: 16 };
  const dim = sizeMap[config.mazeSize];
  const rows = dim;
  const cols = config.mazeShape === 'rectangle' ? Math.round(dim * 1.4) : dim;

  // Initialize grid
  const grid: MazeCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      top: true, right: true, bottom: true, left: true, visited: false,
    }))
  );

  // Recursive backtracking
  const stack: [number, number][] = [];
  const start: [number, number] = [0, 0];
  grid[0][0].visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    const neighbors: [number, number, string, string][] = [];
    if (cr > 0 && !grid[cr - 1][cc].visited) neighbors.push([cr - 1, cc, 'top', 'bottom']);
    if (cr < rows - 1 && !grid[cr + 1][cc].visited) neighbors.push([cr + 1, cc, 'bottom', 'top']);
    if (cc > 0 && !grid[cr][cc - 1].visited) neighbors.push([cr, cc - 1, 'left', 'right']);
    if (cc < cols - 1 && !grid[cr][cc + 1].visited) neighbors.push([cr, cc + 1, 'right', 'left']);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nr, nc, wall1, wall2] = neighbors[Math.floor(Math.random() * neighbors.length)];
      (grid[cr][cc] as any)[wall1] = false;
      (grid[nr][nc] as any)[wall2] = false;
      grid[nr][nc].visited = true;
      stack.push([nr, nc]);
    }
  }

  // Add dead ends for hard difficulty or remove some for easy
  if (config.difficulty === 'easy') {
    // Remove extra walls to create wider paths
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        if (Math.random() < 0.25 && grid[r][c].right) {
          grid[r][c].right = false;
          grid[r][c + 1].left = false;
        }
      }
    }
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.25 && grid[r][c].bottom) {
          grid[r][c].bottom = false;
          grid[r + 1][c].top = false;
        }
      }
    }
  }

  // Solve maze with BFS for solution path
  const solution: [number, number][] = [];
  const endR = rows - 1;
  const endC = cols - 1;
  const visited2: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent: ([number, number] | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const queue: [number, number][] = [[0, 0]];
  visited2[0][0] = true;

  while (queue.length > 0) {
    const [cr, cc] = queue.shift()!;
    if (cr === endR && cc === endC) break;
    const moves: [number, number, string][] = [
      [cr - 1, cc, 'top'], [cr + 1, cc, 'bottom'], [cr, cc - 1, 'left'], [cr, cc + 1, 'right'],
    ];
    for (const [nr, nc, wall] of moves) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited2[nr][nc] && !(grid[cr][cc] as any)[wall]) {
        visited2[nr][nc] = true;
        parent[nr][nc] = [cr, cc];
        queue.push([nr, nc]);
      }
    }
  }

  let cur: [number, number] | null = [endR, endC];
  while (cur) {
    solution.unshift(cur);
    cur = parent[cur[0]][cur[1]];
  }

  // Circle mask: mark cells outside the circle as fully walled
  if (config.mazeShape === 'circle') {
    const centerR = (rows - 1) / 2;
    const centerC = (cols - 1) / 2;
    const radius = Math.min(rows, cols) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dist = Math.sqrt((r - centerR) ** 2 + (c - centerC) ** 2);
        if (dist > radius) {
          grid[r][c].top = true;
          grid[r][c].right = true;
          grid[r][c].bottom = true;
          grid[r][c].left = true;
        }
      }
    }
  }

  return {
    mode: 'maze',
    instructions: 'Find your way from START to END!',
    skillLabel: 'Visual Motor Integration · Planning',
    mazeData: { grid, rows, cols, shape: config.mazeShape, solution },
  };
}

// ========== MODE 14: CONNECT THE DOTS ==========
const DOT_SHAPE_PATHS: Record<ConnectDotsShape, (s: number) => { x: number; y: number }[]> = {
  star: (s) => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 2) + (2 * Math.PI * i) / 10;
      const r = i % 2 === 0 ? s * 0.48 : s * 0.2;
      pts.push({ x: s / 2 + Math.cos(angle) * r, y: s / 2 - Math.sin(angle) * r });
    }
    return pts;
  },
  heart: (s) => {
    const pts: { x: number; y: number }[] = [];
    const cx = s / 2, cy = s * 0.45;
    for (let i = 0; i <= 30; i++) {
      const t = (i / 30) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push({ x: cx + x * s * 0.025, y: cy + y * s * 0.025 });
    }
    return pts;
  },
  house: (s) => {
    const m = s * 0.1;
    return [
      { x: s / 2, y: m }, { x: s - m, y: s * 0.4 }, { x: s - m, y: s - m },
      { x: s * 0.65, y: s - m }, { x: s * 0.65, y: s * 0.65 }, { x: s * 0.35, y: s * 0.65 },
      { x: s * 0.35, y: s - m }, { x: m, y: s - m }, { x: m, y: s * 0.4 },
    ];
  },
  fish: (s) => {
    const pts: { x: number; y: number }[] = [];
    const cx = s * 0.4, cy = s / 2;
    for (let i = 0; i <= 20; i++) {
      const t = (i / 20) * Math.PI * 2;
      const rx = s * 0.32, ry = s * 0.22;
      pts.push({ x: cx + Math.cos(t) * rx, y: cy + Math.sin(t) * ry });
    }
    // tail
    pts.splice(10, 0, { x: s * 0.85, y: s * 0.25 }, { x: s * 0.9, y: s / 2 }, { x: s * 0.85, y: s * 0.75 });
    return pts;
  },
  sun: (s) => {
    const pts: { x: number; y: number }[] = [];
    const cx = s / 2, cy = s / 2;
    for (let i = 0; i < 16; i++) {
      const angle = (2 * Math.PI * i) / 16;
      const r = i % 2 === 0 ? s * 0.44 : s * 0.28;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return pts;
  },
  butterfly: (s) => {
    const pts: { x: number; y: number }[] = [];
    const cx = s / 2, cy = s / 2;
    // Left wing
    for (let i = 0; i <= 12; i++) {
      const t = Math.PI / 2 + (i / 12) * Math.PI;
      pts.push({ x: cx + Math.cos(t) * s * 0.38, y: cy + Math.sin(t) * s * 0.35 });
    }
    // Body
    pts.push({ x: cx, y: s * 0.9 });
    // Right wing
    for (let i = 0; i <= 12; i++) {
      const t = -Math.PI / 2 + (i / 12) * Math.PI;
      pts.push({ x: cx + Math.cos(t) * s * 0.38, y: cy + Math.sin(t) * s * 0.35 });
    }
    pts.push({ x: cx, y: s * 0.1 });
    return pts;
  },
  rocket: (s) => {
    const m = s * 0.15;
    return [
      { x: s / 2, y: m }, { x: s * 0.65, y: s * 0.3 }, { x: s * 0.65, y: s * 0.65 },
      { x: s * 0.8, y: s * 0.85 }, { x: s * 0.65, y: s * 0.75 }, { x: s * 0.65, y: s - m },
      { x: s * 0.35, y: s - m }, { x: s * 0.35, y: s * 0.75 }, { x: s * 0.2, y: s * 0.85 },
      { x: s * 0.35, y: s * 0.65 }, { x: s * 0.35, y: s * 0.3 },
    ];
  },
  tree: (s) => {
    const m = s * 0.08;
    return [
      { x: s / 2, y: m }, { x: s * 0.75, y: s * 0.35 }, { x: s * 0.62, y: s * 0.35 },
      { x: s * 0.82, y: s * 0.58 }, { x: s * 0.68, y: s * 0.58 }, { x: s * 0.88, y: s * 0.78 },
      { x: s * 0.58, y: s * 0.78 }, { x: s * 0.58, y: s - m }, { x: s * 0.42, y: s - m },
      { x: s * 0.42, y: s * 0.78 }, { x: s * 0.12, y: s * 0.78 }, { x: s * 0.32, y: s * 0.58 },
      { x: s * 0.18, y: s * 0.58 }, { x: s * 0.38, y: s * 0.35 }, { x: s * 0.25, y: s * 0.35 },
    ];
  },
  catFace: (s) => {
    const pts: { x: number; y: number }[] = [];
    const cx = s / 2, cy = s * 0.55;
    // Ears
    pts.push({ x: s * 0.2, y: s * 0.12 }, { x: s * 0.15, y: s * 0.35 });
    // Left face
    for (let i = 0; i <= 8; i++) {
      const t = Math.PI * 0.7 + (i / 8) * Math.PI * 0.6;
      pts.push({ x: cx + Math.cos(t) * s * 0.38, y: cy + Math.sin(t) * s * 0.32 });
    }
    // Chin
    for (let i = 0; i <= 6; i++) {
      const t = Math.PI * 1.3 + (i / 6) * Math.PI * 0.4;
      pts.push({ x: cx + Math.cos(t) * s * 0.38, y: cy + Math.sin(t) * s * 0.32 });
    }
    // Right face
    for (let i = 0; i <= 8; i++) {
      const t = -Math.PI * 0.3 + (i / 8) * Math.PI * 0.6;
      pts.push({ x: cx + Math.cos(t) * s * 0.38, y: cy + Math.sin(t) * s * 0.32 });
    }
    // Right ear
    pts.push({ x: s * 0.85, y: s * 0.35 }, { x: s * 0.8, y: s * 0.12 });
    return pts;
  },
  flower: (s) => {
    const pts: { x: number; y: number }[] = [];
    const cx = s / 2, cy = s * 0.4;
    // Petals
    for (let i = 0; i < 24; i++) {
      const angle = (2 * Math.PI * i) / 24;
      const r = s * (0.28 + 0.1 * Math.cos(6 * angle));
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    // Stem
    pts.push({ x: cx + s * 0.02, y: cy + s * 0.28 }, { x: cx + s * 0.02, y: s * 0.92 },
      { x: cx - s * 0.02, y: s * 0.92 }, { x: cx - s * 0.02, y: cy + s * 0.28 });
    return pts;
  },
};

function generateConnectDotsMode(config: WorksheetConfig): WorksheetData {
  const shapeName = config.connectDotsShape;
  const dotCountRange: Record<Difficulty, [number, number]> = {
    easy: [10, 20], medium: [20, 40], hard: [40, 80],
  };
  const [minDots, maxDots] = dotCountRange[config.difficulty];
  const targetDots = Math.round(minDots + Math.random() * (maxDots - minDots));

  const shapeSize = 400;
  const rawPts = DOT_SHAPE_PATHS[shapeName](shapeSize);

  // Resample to target number of dots
  const dots: { x: number; y: number; index: number }[] = [];
  const totalPts = rawPts.length;

  if (targetDots >= totalPts) {
    // Interpolate between points
    const totalLen = rawPts.reduce((sum, p, i) => {
      if (i === 0) return 0;
      const prev = rawPts[i - 1];
      return sum + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
    }, 0);
    const segLen = totalLen / targetDots;
    let accum = 0;
    let ptIdx = 0;
    dots.push({ x: rawPts[0].x, y: rawPts[0].y, index: 1 });
    for (let i = 1; i < rawPts.length && dots.length < targetDots; i++) {
      const dx = rawPts[i].x - rawPts[i - 1].x;
      const dy = rawPts[i].y - rawPts[i - 1].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      accum += d;
      while (accum >= segLen && dots.length < targetDots) {
        accum -= segLen;
        const t = 1 - accum / d;
        dots.push({
          x: rawPts[i - 1].x + dx * t,
          y: rawPts[i - 1].y + dy * t,
          index: dots.length + 1,
        });
      }
    }
  } else {
    // Subsample
    for (let i = 0; i < targetDots; i++) {
      const srcIdx = Math.round((i / targetDots) * (totalPts - 1));
      dots.push({ x: rawPts[srcIdx].x, y: rawPts[srcIdx].y, index: i + 1 });
    }
  }

  // Build completed path
  const completedPath = dots.map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x} ${d.y}`).join(' ') + ' Z';

  return {
    mode: 'connectDots',
    instructions: `Connect the dots from 1 to ${dots.length} to reveal the picture!`,
    skillLabel: 'Visual Sequential Memory · Fine Motor',
    connectDotsData: { dots, shapeName, completedPath },
  };
}

export function generateWorksheet(config: WorksheetConfig): WorksheetData {
  let result: WorksheetData;
  switch (config.mode) {
    case 'find': result = generateFindMode(config); break;
    case 'missing': result = generateMissingMode(config); break;
    case 'pattern': result = generatePatternMode(config); break;
    case 'count': result = generateCountMode(config); break;
    case 'copy': result = generateCopyMode(config); break;
    case 'sequence': result = generateSequenceMode(config); break;
    case 'oddOneOut': result = generateOddOneOutMode(config); break;
    case 'mirror': result = generateMirrorMode(config); break;
    case 'figureGround': result = generateFigureGroundMode(config); break;
    case 'closure': result = generateClosureMode(config); break;
    case 'traceName': result = generateTraceNameMode(config); break;
    case 'handwriting': result = generateHandwritingMode(config); break;
    case 'maze': result = generateMazeMode(config); break;
    case 'connectDots': result = generateConnectDotsMode(config); break;
  }
  // Apply custom instruction override
  if (config.customInstruction.trim()) {
    result.instructions = config.customInstruction.trim();
  }
  return result;
}

export function getShapeSVG(shape: ShapeName, cx: number, cy: number, r: number, fill: string, stroke: string, strokeWidth: number, rotation?: number): string {
  const raw = getShapeRawSVG(shape, cx, cy, r);
  const transform = rotation ? ` transform="rotate(${rotation}, ${cx}, ${cy})"` : '';
  return raw.replace('/>', ` fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${transform} />`);
}

export function getShapeRawSVG(shape: ShapeName, cx: number, cy: number, r: number): string {
  switch (shape) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${r * 0.42}" />`;
    case 'square':
      return `<rect x="${cx - r * 0.38}" y="${cy - r * 0.38}" width="${r * 0.76}" height="${r * 0.76}" />`;
    case 'triangle': {
      const h = r * 0.42;
      return `<polygon points="${cx},${cy - h} ${cx - h},${cy + h * 0.7} ${cx + h},${cy + h * 0.7}" />`;
    }
    case 'cross': {
      const w = r * 0.18;
      const l = r * 0.42;
      return `<polygon points="${cx - w},${cy - l} ${cx + w},${cy - l} ${cx + w},${cy - w} ${cx + l},${cy - w} ${cx + l},${cy + w} ${cx + w},${cy + w} ${cx + w},${cy + l} ${cx - w},${cy + l} ${cx - w},${cy + w} ${cx - l},${cy + w} ${cx - l},${cy - w} ${cx - w},${cy - w}" />`;
    }
    case 'diamond': {
      const d = r * 0.42;
      return `<polygon points="${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}" />`;
    }
    case 'star': {
      const outer = r * 0.42;
      const inner = r * 0.18;
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) {
        const aOuter = (Math.PI / 2 + (2 * Math.PI * i) / 5) * -1 + Math.PI;
        const aInner = aOuter + Math.PI / 5;
        pts.push(`${cx + Math.cos(aOuter) * outer},${cy + Math.sin(aOuter) * outer}`);
        pts.push(`${cx + Math.cos(aInner) * inner},${cy + Math.sin(aInner) * inner}`);
      }
      return `<polygon points="${pts.join(' ')}" />`;
    }
    case 'rectangle':
      return `<rect x="${cx - r * 0.42}" y="${cy - r * 0.26}" width="${r * 0.84}" height="${r * 0.52}" rx="2" />`;
    case 'oval':
      return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.42}" ry="${r * 0.28}" />`;
    case 'heart': {
      const s = r * 0.32;
      return `<path d="M ${cx} ${cy + s * 0.9} Q ${cx - s * 0.4} ${cy + s * 0.5} ${cx - s * 0.9} ${cy - s * 0.1} A ${s * 0.55} ${s * 0.55} 0 0 1 ${cx} ${cy - s * 0.7} A ${s * 0.55} ${s * 0.55} 0 0 1 ${cx + s * 0.9} ${cy - s * 0.1} Q ${cx + s * 0.4} ${cy + s * 0.5} ${cx} ${cy + s * 0.9} Z" />`;
    }
    case 'arrow': {
      const w = r * 0.2;
      const l = r * 0.42;
      const headW = r * 0.36;
      return `<polygon points="${cx},${cy - l} ${cx + headW},${cy - l * 0.2} ${cx + w},${cy - l * 0.2} ${cx + w},${cy + l} ${cx - w},${cy + l} ${cx - w},${cy - l * 0.2} ${cx - headW},${cy - l * 0.2}" />`;
    }
    case 'hexagon': {
      const s = r * 0.4;
      const pts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        pts.push(`${cx + Math.cos(angle) * s},${cy + Math.sin(angle) * s}`);
      }
      return `<polygon points="${pts.join(' ')}" />`;
    }
    case 'pentagon': {
      const s = r * 0.4;
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (2 * Math.PI / 5) * i - Math.PI / 2;
        pts.push(`${cx + Math.cos(angle) * s},${cy + Math.sin(angle) * s}`);
      }
      return `<polygon points="${pts.join(' ')}" />`;
    }
    default:
      return '';
  }
}
