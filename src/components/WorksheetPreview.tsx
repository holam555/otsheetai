import { CellData, ShapeName, WorksheetConfig, SHAPE_COLORS, SHAPE_BW, getShapeSVGPath } from '@/lib/shapes';

interface Props {
  config: WorksheetConfig;
  grid: CellData[][];
  targetShape?: ShapeName;
  instructions: string;
}

// A4 proportions: 210mm x 297mm
const W = 595;
const H = 842;
const MARGIN = 48;
const HEADER_H = 90;
const FOOTER_H = 40;

export default function WorksheetPreview({ config, grid, targetShape, instructions }: Props) {
  const size = config.gridSize;
  const gridAreaW = W - MARGIN * 2;
  const gridAreaH = H - MARGIN * 2 - HEADER_H - FOOTER_H;
  const cellSize = Math.min(gridAreaW / size, gridAreaH / size);
  const gridW = cellSize * size;
  const gridH = cellSize * size;
  const gridX = (W - gridW) / 2;
  const gridY = MARGIN + HEADER_H;

  const getColor = (shape: ShapeName) => config.useColor ? SHAPE_COLORS[shape] : SHAPE_BW;

  const renderCell = (cell: CellData, col: number, row: number) => {
    const cx = gridX + col * cellSize + cellSize / 2;
    const cy = gridY + row * cellSize + cellSize / 2;

    if (cell.isBlank) {
      // Draw a dashed circle placeholder
      return `<circle cx="${cx}" cy="${cy}" r="${cellSize * 0.3}" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="6,4" />`;
    }

    const color = getColor(cell.shape);
    return getShapeSVGPath(cell.shape, cx, cy, cellSize).replace('/>', ` fill="${color}" stroke="${config.useColor ? 'none' : color}" stroke-width="2" />`);
  };

  // Build grid lines
  let gridLines = '';
  if (config.showGridLines) {
    for (let i = 0; i <= size; i++) {
      const x = gridX + i * cellSize;
      const y = gridY + i * cellSize;
      gridLines += `<line x1="${x}" y1="${gridY}" x2="${x}" y2="${gridY + gridH}" stroke="#E2E8F0" stroke-width="1" />`;
      gridLines += `<line x1="${gridX}" y1="${y}" x2="${gridX + gridW}" y2="${y}" stroke="#E2E8F0" stroke-width="1" />`;
    }
  }

  // Build shapes
  let shapes = '';
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      shapes += renderCell(cell, c, r);
    });
  });

  // Target shape indicator for "find" mode
  let targetIndicator = '';
  if (config.mode === 'find' && targetShape) {
    const tColor = getColor(targetShape);
    targetIndicator = `
      <text x="${W / 2}" y="${gridY - 12}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="14" fill="#64748B">Find and circle all the:</text>
      ${getShapeSVGPath(targetShape, W / 2, gridY - 42, 48).replace('/>', ` fill="${tColor}" stroke="${config.useColor ? 'none' : tColor}" stroke-width="2" />`)}
    `;
  }

  // Answer key
  let answerKey = '';
  if (config.showAnswerKey && config.mode === 'find' && targetShape) {
    const answerY = gridY + gridH + 20;
    let answerText = 'Answer: ';
    let count = 0;
    grid.forEach((row) => row.forEach((cell) => { if (cell.isTarget) count++; }));
    answerText += `${count} ${targetShape}${count !== 1 ? 's' : ''}`;
    answerKey = `<text x="${W / 2}" y="${answerY}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#94A3B8">${answerText}</text>`;
  }
  if (config.showAnswerKey && config.mode === 'missing') {
    const answerY = gridY + gridH + 20;
    const blanks: string[] = [];
    grid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell.isBlank) blanks.push(`R${r + 1}C${c + 1}:${cell.shape}`);
    }));
    answerKey = `<text x="${W / 2}" y="${answerY}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#94A3B8">Answers: ${blanks.join(', ')}</text>`;
  }
  if (config.showAnswerKey && config.mode === 'pattern') {
    const answerY = gridY + gridH + 20;
    const lastRow = grid[grid.length - 1];
    const answers = lastRow.map((c, i) => `C${i + 1}:${c.shape}`).join(', ');
    answerKey = `<text x="${W / 2}" y="${answerY}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#94A3B8">Answers: ${answers}</text>`;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">
      <rect width="${W}" height="${H}" fill="white" rx="4" />
      
      <!-- Header -->
      <text x="${W / 2}" y="${MARGIN + 28}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="22" font-weight="800" fill="#0D9488">OTsheet.ai</text>
      <text x="${MARGIN}" y="${MARGIN + 55}" font-family="Nunito, sans-serif" font-size="13" font-weight="600" fill="#334155">Name: ${config.childName || '_______________'}</text>
      <text x="${W - MARGIN}" y="${MARGIN + 55}" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#94A3B8">Date: ___/___/______</text>
      <text x="${W / 2}" y="${MARGIN + 75}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="15" font-weight="700" fill="#1E293B">${instructions}</text>
      
      <!-- Grid border -->
      <rect x="${gridX}" y="${gridY}" width="${gridW}" height="${gridH}" fill="none" stroke="#CBD5E1" stroke-width="2" rx="4" />
      
      ${gridLines}
      ${targetIndicator}
      ${shapes}
      ${answerKey}
      
      <!-- Footer -->
      <text x="${W / 2}" y="${H - MARGIN + 10}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#CBD5E1">Generated by OTsheet.ai</text>
    </svg>
  `;

  return (
    <div
      id="worksheet-preview"
      className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
      style={{ aspectRatio: '210/297', maxHeight: '85vh' }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
