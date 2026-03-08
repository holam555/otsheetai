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

export type WorksheetMode = 'find' | 'missing' | 'pattern' | 'count' | 'copy' | 'sequence' | 'oddOneOut' | 'mirror' | 'figureGround' | 'closure';
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

// Mode 4: Find and Count
export interface CountPuzzle {
  grid: CellData[][];          // 6x8 grid
  targetShapes: ShapeName[];   // shapes to count
  counts: Record<ShapeName, number>; // correct counts
}

// Mode 5: Copy the Pattern
export interface CopyPuzzle {
  sourceGrid: CellData[][];
}

// Mode 6: What Comes Next
export interface SequencePuzzle {
  sequence: CellData[];  // 4 visible + answer
  answer: CellData;
  options: CellData[];   // 3 options
  correctIndex: number;
}

// Mode 7: Odd One Out
export interface OddOneOutRow {
  items: CellData[];     // 5 items
  oddIndex: number;
}

// Mode 8: Mirror Image
export interface MirrorPuzzle {
  sourceGrid: (CellData | null)[][];
  mirroredGrid: (CellData | null)[][];
}

// Mode 9: Figure Ground
export interface FigureGroundPuzzle {
  shapes: { shape: ShapeName; cx: number; cy: number; r: number; rotation: number }[];
  targetShapes: ShapeName[];
  counts: Record<ShapeName, number>;
}

// Mode 10: Visual Closure
export interface ClosurePuzzle {
  shape: ShapeName;
  dashArray: string;
  options: ShapeName[];
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
  // Mode 4
  countPuzzle?: CountPuzzle;
  // Mode 5
  copyPuzzles?: CopyPuzzle[];
  // Mode 6
  sequencePuzzles?: SequencePuzzle[];
  // Mode 7
  oddOneOutRows?: OddOneOutRow[];
  // Mode 8
  mirrorPuzzles?: MirrorPuzzle[];
  // Mode 9
  figureGroundPuzzle?: FigureGroundPuzzle;
  // Mode 10
  closurePuzzles?: ClosurePuzzle[];
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

// ========== MODE 4: FIND AND COUNT ==========
function generateCountMode(config: WorksheetConfig): WorksheetData {
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const ROWS = 8;
  const COLS = 6;
  const totalCells = ROWS * COLS;

  // Pick target shapes based on difficulty
  const targetCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 4 : Math.min(5, shapes.length);
  const targetShapes = pickN(shapes, targetCount);

  // Fill grid with random shapes from targets (plus extra distractors on hard)
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

  // Count occurrences
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
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const gridSize = config.difficulty === 'easy' ? 3 : 4;

  const puzzles: CopyPuzzle[] = [];
  for (let p = 0; p < 3; p++) {
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
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const puzzles: SequencePuzzle[] = [];

  for (let p = 0; p < 6; p++) {
    let patternLen: number;
    if (config.difficulty === 'easy') {
      patternLen = 2; // AB pattern
    } else if (config.difficulty === 'medium') {
      patternLen = randomFrom([2, 3]); // AB or AAB
    } else {
      patternLen = 3; // ABC
    }

    const patternShapes = pickN(shapes, patternLen);
    // Build repeating sequence of 4 visible items
    const sequence: CellData[] = [];
    for (let i = 0; i < 4; i++) {
      sequence.push({
        shape: patternShapes[i % patternLen],
        rotation: getDifficultyRotation(config.difficulty),
      });
    }
    const answer: CellData = {
      shape: patternShapes[4 % patternLen],
      rotation: getDifficultyRotation(config.difficulty),
    };

    // 3 options: 1 correct + 2 distractors
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
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const rows: OddOneOutRow[] = [];

  for (let r = 0; r < 8; r++) {
    const baseShape = randomFrom(shapes);
    const baseRotation = getDifficultyRotation(config.difficulty);
    const oddIndex = Math.floor(Math.random() * 5);

    const items: CellData[] = [];
    for (let i = 0; i < 5; i++) {
      if (i === oddIndex) {
        if (config.difficulty === 'easy') {
          // Completely different shape
          const diffShape = randomFrom(shapes.filter(s => s !== baseShape));
          items.push({ shape: diffShape, rotation: 0 });
        } else if (config.difficulty === 'medium') {
          // Similar shape
          const similar = getSimilarDistractors(baseShape, shapes, 'hard');
          const diffShape = similar.length > 0 ? randomFrom(similar) : randomFrom(shapes.filter(s => s !== baseShape));
          items.push({ shape: diffShape, rotation: baseRotation });
        } else {
          // Same shape, different rotation or size
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

// ========== MODE 8: MIRROR IMAGE ==========
function generateMirrorMode(config: WorksheetConfig): WorksheetData {
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const gridSize = 4;
  const shapeCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 5 : 7;

  const puzzles: MirrorPuzzle[] = [];
  for (let p = 0; p < 2; p++) {
    const sourceGrid: (CellData | null)[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => null)
    );

    // Place shapes randomly
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

    // Create horizontal mirror
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
  const allShapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const targetCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 4 : 5;
  const shapeTotal = config.difficulty === 'easy' ? 6 : config.difficulty === 'medium' ? 8 : 10;
  const targetShapes = pickN(allShapes, targetCount);

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
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const puzzles: ClosurePuzzle[] = [];

  for (let i = 0; i < 8; i++) {
    const shape = randomFrom(shapes);
    // Determine dash pattern based on difficulty
    const gapRatio = config.difficulty === 'easy' ? 0.15 : config.difficulty === 'medium' ? 0.3 : 0.5;
    const dashLen = 8;
    const gapLen = Math.round(dashLen * gapRatio / (1 - gapRatio));
    const dashArray = `${dashLen},${Math.max(3, gapLen)}`;

    // Options: 1 correct + 2 distractors
    const distractors = pickN(shapes.filter(s => s !== shape), 2);
    const options = [shape, ...distractors];
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

export function generateWorksheet(config: WorksheetConfig): WorksheetData {
  switch (config.mode) {
    case 'find': return generateFindMode(config);
    case 'missing': return generateMissingMode(config);
    case 'pattern': return generatePatternMode(config);
    case 'count': return generateCountMode(config);
    case 'copy': return generateCopyMode(config);
    case 'sequence': return generateSequenceMode(config);
    case 'oddOneOut': return generateOddOneOutMode(config);
    case 'mirror': return generateMirrorMode(config);
    case 'figureGround': return generateFigureGroundMode(config);
    case 'closure': return generateClosureMode(config);
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
