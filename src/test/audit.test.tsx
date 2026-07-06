import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { WorksheetConfig } from '@/lib/shapes';
import { generateWorksheetSeeded } from '@/lib/seededGenerate';
import { defaultConfig } from '@/lib/defaultConfig';
import WorksheetPreview from '@/components/WorksheetPreview';

/**
 * Control-reflection audit. For every control the editor exposes, prove the
 * change actually reaches the worksheet — either in the generated DATA (puzzle
 * content) or in the rendered SVG (visual-only controls). Uses a fixed seed so
 * the only variable between two outputs is the control under test.
 */
const SEED = 987654;
const gen = (o: Partial<WorksheetConfig>) => generateWorksheetSeeded({ ...defaultConfig, ...o }, SEED);
const J = (o: Partial<WorksheetConfig>) => JSON.stringify(gen(o));

/** Render the full preview to its SVG string (visual-only control checks). */
function svg(config: Partial<WorksheetConfig>, data = gen(config)) {
  const { container } = render(<WorksheetPreview config={{ ...defaultConfig, ...config }} data={data} />);
  const html = container.innerHTML;
  cleanup();
  return html;
}

// ---------------------------------------------------------------------------
// DATA-LEVEL controls — changing them must change the generated puzzle.
// ---------------------------------------------------------------------------
describe('data-level controls change the puzzle', () => {
  it('find: selectedShapes restricts the shapes used', () => {
    const data = gen({ mode: 'find', selectedShapes: ['circle', 'square'] });
    const shapes = (data.grid ?? []).flat().map((c) => c.shape);
    expect(shapes.length).toBeGreaterThan(0);
    expect(shapes.every((s) => s === 'circle' || s === 'square')).toBe(true);
  });

  it('find: useEmoji puts emoji on cells', () => {
    const data = gen({ mode: 'find', useEmoji: true, emojiTheme: 'animals' });
    expect((data.grid ?? []).flat().some((c) => !!c.emoji)).toBe(true);
  });

  it('find: gridSize changes grid dimensions', () => {
    expect(gen({ mode: 'find', gridSize: 5 }).grid?.length).toBe(5);
    expect(gen({ mode: 'find', gridSize: 2 }).grid?.length).toBe(2);
  });

  it('find: difficulty changes output', () => {
    expect(J({ mode: 'find', difficulty: 'easy' })).not.toBe(J({ mode: 'find', difficulty: 'hard' }));
  });

  it('sequence: exerciseCount sets number of puzzles', () => {
    expect(gen({ mode: 'sequence', exerciseCount: 8 }).sequencePuzzles?.length).toBe(8);
    expect(gen({ mode: 'sequence', exerciseCount: 3 }).sequencePuzzles?.length).toBe(3);
  });

  it('oddOneOut: item type letters with custom target uses that letter', () => {
    const data = gen({ mode: 'oddOneOut', oddOneOutType: 'letters', oddOneOutCustomTarget: 'b', exerciseCount: 5 });
    const rows = data.oddOneOutRows ?? [];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.oddText === 'b')).toBe(true);
  });

  it('oddOneOut: shapes vs letters produce different data', () => {
    expect(J({ mode: 'oddOneOut', oddOneOutType: 'shapes' })).not.toBe(J({ mode: 'oddOneOut', oddOneOutType: 'numbers' }));
  });

  it('count: gridSize changes the grid', () => {
    expect(J({ mode: 'count', gridSize: 3 })).not.toBe(J({ mode: 'count', gridSize: 5 }));
  });

  it('copy: gridSize and exerciseCount change output', () => {
    expect(J({ mode: 'copy', gridSize: 2 })).not.toBe(J({ mode: 'copy', gridSize: 4 }));
    expect(J({ mode: 'copy', exerciseCount: 3 })).not.toBe(J({ mode: 'copy', exerciseCount: 8 }));
  });

  it('mirror & closure: exerciseCount changes output', () => {
    expect(J({ mode: 'mirror', exerciseCount: 3 })).not.toBe(J({ mode: 'mirror', exerciseCount: 8 }));
    expect(J({ mode: 'closure', exerciseCount: 3 })).not.toBe(J({ mode: 'closure', exerciseCount: 8 }));
  });

  it('pattern: grid-size preset changes output', () => {
    expect(J({ mode: 'pattern', gridSize: 2, exerciseCount: 3 })).not.toBe(J({ mode: 'pattern', gridSize: 4, exerciseCount: 2 }));
  });

  it('figureGround: difficulty changes output', () => {
    expect(J({ mode: 'figureGround', difficulty: 'easy' })).not.toBe(J({ mode: 'figureGround', difficulty: 'hard' }));
  });

  it('maze: size and shape change the maze', () => {
    expect(gen({ mode: 'maze', mazeSize: 'small' }).mazeData?.rows).not.toBe(gen({ mode: 'maze', mazeSize: 'large' }).mazeData?.rows);
    expect(gen({ mode: 'maze', mazeShape: 'square' }).mazeData?.shape).toBe('square');
    expect(gen({ mode: 'maze', mazeShape: 'circle' }).mazeData?.shape).toBe('circle');
  });

  it('connectDots: shape changes the dots', () => {
    expect(J({ mode: 'connectDots', connectDotsShape: 'star' })).not.toBe(J({ mode: 'connectDots', connectDotsShape: 'heart' }));
  });

  it('tracingPaths: stroke type and rows change output', () => {
    expect(J({ mode: 'tracingPaths', tracingStrokeType: 'vertical' })).not.toBe(J({ mode: 'tracingPaths', tracingStrokeType: 'spiral' }));
    expect(J({ mode: 'tracingPaths', tracingRows: 2 })).not.toBe(J({ mode: 'tracingPaths', tracingRows: 6 }));
  });

  it('scissorSkills: line type and count change output', () => {
    expect(J({ mode: 'scissorSkills', scissorLineType: 'straight' })).not.toBe(J({ mode: 'scissorSkills', scissorLineType: 'zigzag' }));
    expect(J({ mode: 'scissorSkills', scissorLineCount: 3 })).not.toBe(J({ mode: 'scissorSkills', scissorLineCount: 10 }));
  });

  it('visualScanning: target, density and frequency change output', () => {
    expect(J({ mode: 'visualScanning', visualScanTarget: 'b' })).not.toBe(J({ mode: 'visualScanning', visualScanTarget: 'p' }));
    expect(J({ mode: 'visualScanning', visualScanDensity: 'small' })).not.toBe(J({ mode: 'visualScanning', visualScanDensity: 'large' }));
    expect(J({ mode: 'visualScanning', visualScanTargetCount: 'few' })).not.toBe(J({ mode: 'visualScanning', visualScanTargetCount: 'many' }));
  });

  it('pixelArt: theme changes the grid', () => {
    expect(J({ mode: 'pixelArt', pixelArtTheme: 'heart' })).not.toBe(J({ mode: 'pixelArt', pixelArtTheme: 'star' }));
  });

  it('handwriting: text, rows, font size and sub-mode change output', () => {
    expect(J({ mode: 'handwriting', handwritingText: 'cat' })).not.toBe(J({ mode: 'handwriting', handwritingText: 'dog' }));
    expect(J({ mode: 'handwriting', handwritingRows: 2 })).not.toBe(J({ mode: 'handwriting', handwritingRows: 8 }));
    expect(J({ mode: 'handwriting', handwritingFontSizeMm: 10 })).not.toBe(J({ mode: 'handwriting', handwritingFontSizeMm: 30 }));
  });

  it('traceName: childName drives the letters', () => {
    expect(gen({ mode: 'traceName', childName: 'Alex' }).traceNameData?.letters).toEqual(['A', 'L', 'E', 'X']);
    expect(J({ mode: 'traceName', childName: 'Alex' })).not.toBe(J({ mode: 'traceName', childName: 'Maya' }));
  });

  it('customInstruction reaches the worksheet instructions', () => {
    expect(gen({ mode: 'find', customInstruction: 'ZZZ-UNIQUE' }).instructions).toContain('ZZZ-UNIQUE');
  });
});

// ---------------------------------------------------------------------------
// RENDER-ONLY controls — changing them must change the rendered SVG.
// ---------------------------------------------------------------------------
describe('render-only controls change the SVG', () => {
  const base = { mode: 'find' as const };
  const data = gen(base);
  const diff = (a: Partial<WorksheetConfig>, b: Partial<WorksheetConfig>) =>
    expect(svg({ ...base, ...a }, data)).not.toBe(svg({ ...base, ...b }, data));

  it('useColor', () => diff({ useColor: true }, { useColor: false }));
  it('borderStyle', () => diff({ borderStyle: 'plain' }, { borderStyle: 'dotted' }));
  it('instructionFontSize', () => diff({ instructionFontSize: 'small' }, { instructionFontSize: 'large' }));
  it('instructionBold', () => diff({ instructionBold: false }, { instructionBold: true }));
  it('headerBold', () => diff({ headerBold: false }, { headerBold: true }));
  it('showAnswerKey', () => diff({ showAnswerKey: false }, { showAnswerKey: true }));

  it('childName appears in the header', () => {
    expect(svg({ mode: 'find', childName: 'Zoe-Test' }, data)).toContain('Zoe-Test');
  });

  it('tracingThickness changes the SVG', () => {
    const d = gen({ mode: 'tracingPaths' });
    expect(svg({ mode: 'tracingPaths', tracingThickness: 'thick' }, d)).not.toBe(svg({ mode: 'tracingPaths', tracingThickness: 'thin' }, d));
  });

  it('visualScan char size & dyslexia font change the SVG', () => {
    const d = gen({ mode: 'visualScanning' });
    expect(svg({ mode: 'visualScanning', visualScanCharSize: 'large' }, d)).not.toBe(svg({ mode: 'visualScanning', visualScanCharSize: 'small' }, d));
    expect(svg({ mode: 'visualScanning', visualScanFontStyle: 'standard' }, d)).not.toBe(svg({ mode: 'visualScanning', visualScanFontStyle: 'dyslexia' }, d));
  });

  it('pixelArt B&W changes the SVG', () => {
    const d = gen({ mode: 'pixelArt' });
    expect(svg({ mode: 'pixelArt', pixelArtBW: false }, d)).not.toBe(svg({ mode: 'pixelArt', pixelArtBW: true }, d));
  });

  it('traceName renders the letter strokes (not an empty body)', () => {
    // Regression: traceName must route to renderTraceNameMode, which draws the
    // reference letters as <polyline>s. A mis-route to handwriting renders nothing.
    const out = svg({ mode: 'traceName', childName: 'Emma' });
    expect(out).toContain('polyline');
    expect(svg({ mode: 'traceName', childName: 'Alex' })).not.toBe(svg({ mode: 'traceName', childName: 'Maya' }));
  });

  it('handwriting coloured lines & line mode change the SVG', () => {
    const d = gen({ mode: 'handwriting', handwritingLayout: 'triline', handwritingText: 'abc' });
    expect(svg({ mode: 'handwriting', handwritingShowColoredLines: true, handwritingLineColor: 'red' }, d))
      .not.toBe(svg({ mode: 'handwriting', handwritingShowColoredLines: true, handwritingLineColor: 'green' }, d));
    expect(svg({ mode: 'handwriting', handwritingLineMode: '3-line' }, d))
      .not.toBe(svg({ mode: 'handwriting', handwritingLineMode: '4-line' }, d));
  });
});

// ---------------------------------------------------------------------------
// SOLVABILITY / CORRECTNESS — puzzles must have exactly one right answer and
// the odd item must be visibly different. Regression tests for the 2026-07-05
// therapeutic-correctness fixes.
// ---------------------------------------------------------------------------
describe('puzzles are solvable and unambiguous', () => {
  it('closure: A/B/C options are always distinct, even with 2 selected shapes', () => {
    for (let seed = 0; seed < 60; seed++) {
      const data = generateWorksheetSeeded(
        { ...defaultConfig, mode: 'closure', selectedShapes: ['circle', 'square'], exerciseCount: 5 },
        seed
      );
      for (const p of data.closurePuzzles ?? []) {
        expect(new Set(p.options).size).toBe(3);
        expect(p.options[p.correctIndex]).toBe(p.shape);
      }
    }
  });

  it('sequence: A/B/C options are always distinct shapes', () => {
    for (let seed = 0; seed < 60; seed++) {
      const data = generateWorksheetSeeded(
        { ...defaultConfig, mode: 'sequence', selectedShapes: ['circle', 'square'], exerciseCount: 5, difficulty: 'easy' },
        seed
      );
      for (const p of data.sequencePuzzles ?? []) {
        const shapes = p.options.map((o) => o.shape);
        expect(new Set(shapes).size).toBe(3);
      }
    }
  });

  it('oddOneOut hard: the odd item is visibly different (no symmetric rotations)', () => {
    // Rotations that leave the shape looking identical.
    const symmetric: Record<string, (d: number) => boolean> = {
      circle: () => true,
      oval: (d) => d % 180 === 0,
      square: (d) => d % 90 === 0,
      rectangle: (d) => d % 180 === 0,
      cross: (d) => d % 90 === 0,
      diamond: (d) => d % 90 === 0,
      hexagon: (d) => d % 60 === 0,
    };
    for (let seed = 0; seed < 80; seed++) {
      const data = generateWorksheetSeeded(
        { ...defaultConfig, mode: 'oddOneOut', difficulty: 'hard', childAge: 8, selectedShapes: ['circle', 'square', 'triangle', 'cross'], exerciseCount: 5 },
        seed
      );
      for (const row of data.oddOneOutRows ?? []) {
        const odd = row.items[row.oddIndex];
        const base = row.items[(row.oddIndex + 1) % row.items.length];
        if (odd.shape === base.shape) {
          const delta = Math.abs((odd.rotation ?? 0) - (base.rotation ?? 0)) % 360;
          const isSame = delta === 0 || (symmetric[odd.shape]?.(delta) ?? false);
          expect(isSame).toBe(false);
        }
      }
    }
  });

  it('find + emoji: instruction no longer names an invisible shape', () => {
    const data = gen({ mode: 'find', useEmoji: true, emojiTheme: 'animals' });
    expect(data.instructions).not.toMatch(/circle|square|triangle|cross|diamond|star|rectangle|oval|heart|arrow|hexagon|pentagon/);
  });
});

// ---------------------------------------------------------------------------
// PHASE 1 — difficulty semantics now produce measurable differences, and
// visual-scan distractors match the target's case.
// ---------------------------------------------------------------------------
describe('phase 1: difficulty is meaningful across modes', () => {
  const seeded = (o: Partial<WorksheetConfig>, seed = 42) =>
    generateWorksheetSeeded({ ...defaultConfig, ...o }, seed);

  it('copy: easy uses a smaller shape palette than hard', () => {
    const palette = (o: Partial<WorksheetConfig>) => {
      const data = seeded({ mode: 'copy', selectedShapes: ['circle', 'square', 'triangle', 'cross', 'star', 'heart'], exerciseCount: 1, ...o });
      return new Set((data.copyPuzzles![0].sourceGrid).flat().map((c) => c.shape)).size;
    };
    expect(palette({ difficulty: 'easy', gridSize: 4 })).toBeLessThanOrEqual(2);
    expect(palette({ difficulty: 'hard', gridSize: 4 })).toBeGreaterThan(2);
  });

  it('mirror: shape count scales with difficulty and never fills the whole grid', () => {
    const count = (d: WorksheetConfig['difficulty']) => {
      const data = seeded({ mode: 'mirror', gridSize: 4, difficulty: d, exerciseCount: 1 });
      return data.mirrorPuzzles![0].sourceGrid.flat().filter(Boolean).length;
    };
    expect(count('easy')).toBeLessThan(count('hard'));
    expect(count('hard')).toBeLessThan(16); // leaves empty cells — still a puzzle
  });

  it('maze: easy has more open passages (fewer walls) than hard', () => {
    const walls = (d: WorksheetConfig['difficulty']) => {
      const g = seeded({ mode: 'maze', mazeSize: 'medium', difficulty: d }).mazeData!.grid;
      let n = 0;
      g.forEach((row) => row.forEach((c) => { n += [c.top, c.right, c.bottom, c.left].filter(Boolean).length; }));
      return n;
    };
    expect(walls('easy')).toBeLessThan(walls('hard'));
  });

  it('scissor: hard cutting lines differ from easy (amplitude/complexity)', () => {
    const easy = JSON.stringify(seeded({ mode: 'scissorSkills', scissorLineType: 'wavy', difficulty: 'easy' }).scissorSkillsData);
    const hard = JSON.stringify(seeded({ mode: 'scissorSkills', scissorLineType: 'wavy', difficulty: 'hard' }).scissorSkillsData);
    expect(easy).not.toBe(hard);
  });

  it('visualScanning: uppercase target gets uppercase distractors', () => {
    const data = gen({ mode: 'visualScanning', visualScanTarget: 'B', visualScanDensity: 'small' });
    const chars = data.visualScanData!.grid.flat();
    expect(chars.every((c) => c === c.toUpperCase())).toBe(true);
  });
});
