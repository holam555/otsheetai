export type ShapeName = 'circle' | 'square' | 'triangle' | 'cross' | 'diamond' | 'star' | 'rectangle' | 'oval';

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
};

export type WorksheetMode = 'find' | 'missing' | 'pattern' | 'count';
export type GridSize = 2 | 3 | 4 | 5;
export type ShapeSet = 'basic' | 'extended';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WorksheetConfig {
  mode: WorksheetMode;
  gridSize: GridSize;
  shapeSet: ShapeSet;
  difficulty: Difficulty;
  childName: string;
  showGridLines: boolean;
  useColor: boolean;
  showAnswerKey: boolean;
}

export interface CellData {
  shape: ShapeName;
  isTarget?: boolean;
  isBlank?: boolean;
  rotation?: number;
}

// Mode 2: each sub-puzzle is a small grid with one blank
export interface MissingPuzzle {
  grid: CellData[][];
  blankRow: number;
  blankCol: number;
  answer: ShapeName;
}

// Mode 3: a 2x2 pattern with 3 options (1 correct, 2 distractors)
export interface PatternPuzzle {
  pattern: CellData[][];       // 2x2
  options: CellData[][][];     // 3 options, each 2x2
  correctIndex: number;
}

export interface WorksheetData {
  mode: WorksheetMode;
  instructions: string;
  skillLabel: string;
  // Mode 1
  targetShape?: ShapeName;
  grid?: CellData[][];
  // Mode 2
  referenceShapes?: ShapeName[];
  missingPuzzles?: MissingPuzzle[];
  // Mode 3
  patternPuzzles?: PatternPuzzle[];
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

// Similar shapes for hard distractors
const SIMILAR_SHAPES: Partial<Record<ShapeName, ShapeName[]>> = {
  circle: ['oval'],
  oval: ['circle'],
  square: ['rectangle', 'diamond'],
  rectangle: ['square'],
  diamond: ['square'],
  triangle: ['diamond'],
  star: ['cross'],
  cross: ['star'],
};

function getSimilarDistractors(target: ShapeName, shapes: ShapeName[], difficulty: Difficulty): ShapeName[] {
  if (difficulty === 'hard') {
    const similar = SIMILAR_SHAPES[target] ?? [];
    const available = similar.filter(s => shapes.includes(s));
    if (available.length > 0) return available;
  }
  return shapes.filter(s => s !== target);
}

// ========== MODE 1: FIND THE SHAPE ==========
function generateFindMode(config: WorksheetConfig): WorksheetData {
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
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
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const refShapes = shapes.slice(0, 4); // Always show 4 reference shapes
  const puzzleSize = config.gridSize <= 3 ? 2 : 3; // sub-grid size

  const puzzleCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 4 : 6;

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
    // Pick one cell to blank
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
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const puzzleCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 4 : 5;

  const puzzles: PatternPuzzle[] = [];
  for (let p = 0; p < puzzleCount; p++) {
    // Generate a random 2x2 pattern
    const patternShapes = pickN(shapes, 4);
    const pattern: CellData[][] = [
      [
        { shape: patternShapes[0], rotation: getDifficultyRotation(config.difficulty) },
        { shape: patternShapes[1], rotation: getDifficultyRotation(config.difficulty) },
      ],
      [
        { shape: patternShapes[2], rotation: getDifficultyRotation(config.difficulty) },
        { shape: patternShapes[3], rotation: getDifficultyRotation(config.difficulty) },
      ],
    ];

    // Correct option is the same pattern
    const correct: CellData[][] = pattern.map(row => row.map(c => ({ ...c })));

    // Generate 2 distractor options
    const distractors: CellData[][][] = [];
    for (let d = 0; d < 2; d++) {
      if (config.difficulty === 'hard') {
        // Swap just 1 shape for a similar one
        const dr = Math.floor(Math.random() * 2);
        const dc = Math.floor(Math.random() * 2);
        const origShape = pattern[dr][dc].shape;
        const similar = getSimilarDistractors(origShape, shapes, 'hard');
        const replacement = similar.length > 0 ? randomFrom(similar) : randomFrom(shapes.filter(s => s !== origShape));
        const distractor: CellData[][] = pattern.map(row => row.map(c => ({ ...c })));
        distractor[dr][dc] = { shape: replacement, rotation: getDifficultyRotation('hard') };
        distractors.push(distractor);
      } else {
        // Swap 1-2 shapes randomly
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
    const correctIndex = 0;
    // Shuffle options but track correct
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

export function generateWorksheet(config: WorksheetConfig): WorksheetData {
  switch (config.mode) {
    case 'find': return generateFindMode(config);
    case 'missing': return generateMissingMode(config);
    case 'pattern': return generatePatternMode(config);
  }
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
    default:
      return '';
  }
}
