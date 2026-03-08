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

export const SHAPE_BW: string = '#374151';

export type WorksheetMode = 'find' | 'missing' | 'pattern';
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

export function generateWorksheet(config: WorksheetConfig): { grid: CellData[][]; targetShape?: ShapeName; instructions: string } {
  const shapes = config.shapeSet === 'basic' ? BASIC_SHAPES : EXTENDED_SHAPES;
  const size = config.gridSize;
  const totalCells = size * size;

  // Determine target count based on difficulty
  const targetRatio = config.difficulty === 'easy' ? 0.4 : config.difficulty === 'medium' ? 0.25 : 0.15;

  if (config.mode === 'find') {
    const targetShape = randomFrom(shapes);
    const targetCount = Math.max(2, Math.round(totalCells * targetRatio));
    const otherShapes = shapes.filter(s => s !== targetShape);

    const cells: CellData[] = [];
    for (let i = 0; i < targetCount; i++) {
      cells.push({ shape: targetShape, isTarget: true });
    }
    for (let i = targetCount; i < totalCells; i++) {
      cells.push({ shape: randomFrom(otherShapes), isTarget: false });
    }
    const shuffled = shuffle(cells);
    const grid: CellData[][] = [];
    for (let r = 0; r < size; r++) {
      grid.push(shuffled.slice(r * size, (r + 1) * size));
    }
    return { grid, targetShape, instructions: `Find and circle all the ${targetShape}s!` };
  }

  if (config.mode === 'missing') {
    const blankCount = config.difficulty === 'easy' ? Math.max(1, Math.floor(totalCells * 0.15)) : config.difficulty === 'medium' ? Math.max(2, Math.floor(totalCells * 0.25)) : Math.max(3, Math.floor(totalCells * 0.35));

    const cells: CellData[] = [];
    // Create a pattern by repeating shapes
    for (let i = 0; i < totalCells; i++) {
      cells.push({ shape: shapes[i % shapes.length], isBlank: false });
    }
    // Randomly blank some
    const indices = shuffle(Array.from({ length: totalCells }, (_, i) => i));
    for (let i = 0; i < blankCount; i++) {
      cells[indices[i]].isBlank = true;
    }
    const grid: CellData[][] = [];
    for (let r = 0; r < size; r++) {
      grid.push(cells.slice(r * size, (r + 1) * size));
    }
    return { grid, instructions: 'Draw the missing shapes to complete the grid!' };
  }

  // Pattern mode
  const patternLength = config.difficulty === 'easy' ? 2 : config.difficulty === 'medium' ? 3 : 4;
  const pattern = shapes.slice(0, patternLength);

  const cells: CellData[] = [];
  for (let i = 0; i < totalCells; i++) {
    cells.push({ shape: pattern[i % patternLength], isBlank: false });
  }
  // Blank the last row
  for (let i = (size - 1) * size; i < totalCells; i++) {
    cells[i].isBlank = true;
  }
  const grid: CellData[][] = [];
  for (let r = 0; r < size; r++) {
    grid.push(cells.slice(r * size, (r + 1) * size));
  }
  return { grid, instructions: 'Continue the pattern! Fill in the missing shapes.' };
}

export function getShapeSVGPath(shape: ShapeName, cx: number, cy: number, r: number): string {
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
