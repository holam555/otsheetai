# OTsheet.ai — CLAUDE.md

## Project Purpose

OTsheet.ai is a client-side web app that lets parents and occupational therapists (OTs) generate print-ready worksheets for children aged 2–12. It covers three therapeutic areas:

- **Handwriting** — guided letter/word practice on triline, 4-line, word-box, or grid paper
- **Fine motor** — tracing paths, scissor skills, connect-the-dots, mazes
- **Visual perception** — find-the-shape, pattern matching, odd one out, figure-ground, visual closure, pixel art, and more

All worksheet generation is client-side (no backend). Output is SVG-based and sized for A4 print.

---

## Tech Stack

| Layer | Library / Tool |
|-------|----------------|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Routing | React Router DOM 6 |
| UI Components | shadcn/ui (Radix UI + Tailwind CSS 3) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Notifications | Sonner |
| Testing | Vitest + Testing Library |
| Package manager | Bun (preferred) or npm |

---

## Repository Structure

```
src/
├── pages/
│   ├── Index.tsx             # Main page — state, layout, print trigger
│   └── NotFound.tsx          # 404 fallback
├── components/
│   ├── WorksheetControls.tsx # Left sidebar: all user-facing settings (~950 lines)
│   ├── WorksheetPreview.tsx  # SVG renderer for all 15+ exercise modes (~1627 lines)
│   ├── NavLink.tsx           # Router NavLink wrapper
│   └── ui/                   # shadcn/ui primitives (do not edit manually)
├── lib/
│   ├── shapes.ts             # Core generation engine — all puzzle/data generators (~1836 lines)
│   ├── letterPaths.ts        # Letter/number stroke data for handwriting modes
│   └── utils.ts              # cn() Tailwind merge helper
├── hooks/
│   ├── use-mobile.tsx        # Mobile breakpoint
│   └── use-toast.ts          # Toast hook
└── test/
    ├── example.test.ts       # Placeholder
    └── setup.ts              # Vitest setup
```

---

## Core Data Flow

```
WorksheetConfig (state in Index.tsx)
        │
        ▼  (on any config change)
generateWorksheet(config)  ←─── lib/shapes.ts
        │
        ▼
WorksheetData (passed as prop)
        │
        ▼
WorksheetPreview.tsx  ──renders──▶  SVG (A4, 595×842px)
        │
        ▼
window.print()  (browser print dialog → PDF)
```

Key types live in `src/lib/shapes.ts`:
- `WorksheetConfig` — all user settings (50+ fields)
- `WorksheetData` — generated puzzle data for any mode
- `WorksheetMode` — union of all 15+ mode string literals

---

## Exercise Modes

### Visual Perception (14 modes)
| Mode | Key in config |
|------|---------------|
| Find the Shape | `find` |
| Match Pattern | `pattern` |
| Find & Count | `count` |
| Copy Pattern | `copy` |
| Sequence | `sequence` |
| Odd One Out | `oddOneOut` |
| Mirror Image | `mirror` |
| Figure Ground | `figureGround` |
| Visual Closure | `closure` |
| Maze | `maze` |
| Connect the Dots | `connectDots` |
| Tracing Paths | `tracing` |
| Scissor Skills | `scissor` |
| Visual Scanning | `visualScanning` |
| Pixel Art | `pixelArt` |

### Handwriting (1 mode, multiple layouts)
Mode key: `handwriting`. Layout variants: `triline`, `fourline`, `wordBoxes`, `gridBox`, `combined`.

---

## Adding a New Exercise Mode

1. **Add the mode string** to `WorksheetMode` union in `shapes.ts`
2. **Add a generator function** `generateXxxMode(config): XxxData` in `shapes.ts`
3. **Call the generator** in the `generateWorksheet()` switch in `shapes.ts`
4. **Add a renderer** `renderXxxMode()` in `WorksheetPreview.tsx` and call it from the main render switch
5. **Add UI controls** in `WorksheetControls.tsx` — typically under a new conditional block inside the correct tab
6. **Add any new config fields** to `WorksheetConfig` in `shapes.ts` and initialise them in `Index.tsx`

---

## Shapes & SVG

- 12 base shapes: `circle`, `square`, `triangle`, `cross`, `diamond`, `star`, `rectangle`, `oval`, `heart`, `arrow`, `hexagon`, `pentagon`
- Emoji mode maps each shape to a themed emoji (animals, food, transport, nature, faces)
- SVG paths for each shape are in `getShapeRawSVG()` at the bottom of `shapes.ts`
- `getShapeSVG(shape, x, y, size, fill, stroke, rotation)` is the main drawing helper used in `WorksheetPreview.tsx`

---

## Print / PDF Output

- Worksheet is rendered as an `<svg>` element at 595×842px (A4 portrait)
- `window.print()` is called from the Print button in `Index.tsx`
- `@media print` CSS hides everything except the SVG preview
- Multi-page worksheets (e.g. pattern mode with answer key) render two SVG elements stacked

---

## Known Issues & Improvement Opportunities

### High priority
- **No data persistence** — settings are lost on page refresh; add `localStorage` save/load
- **Effect dependency array in Index.tsx** is exhaustive (~50 individual fields); simplify to `[config]` or `useMemo`
- **Missing features that are partially wired up:** `handwritingShowStartEnd` (start/end arrows on letter strokes) is parsed but never rendered

### Medium priority
- **Accessibility** — SVG worksheets have no ARIA labels; preview is not keyboard-navigable
- **No tests** — the generation functions in `shapes.ts` have zero test coverage; add unit tests for `generateMazeMode`, `generatePatternMode`, etc.
- **Mobile preview** — worksheet preview on small screens is hard to use; consider a zoom/pan control
- **Unused dependencies** — `next-themes`, `TanStack React Query` are installed but not used

### Low priority
- Magic numbers in `WorksheetPreview.tsx` (cell sizes, margins, font sizes) should be extracted as named constants
- Add word lists / phonics sentences for handwriting mode
- Batch generation (multiple worksheet variants at once)

---

## Commands

```bash
# Install dependencies
bun install          # preferred
npm install          # fallback

# Dev server (http://localhost:5173)
bun run dev
npm run dev

# Type check
bun run build        # runs tsc then vite build
npx tsc --noEmit     # type-check only

# Lint
bun run lint

# Tests
bun run test
bun run test:ui      # Vitest UI
```

---

## Design Conventions

- Worksheet dimensions: **595 × 842px** (A4 portrait, 1px ≈ 0.265mm)
- Worksheet content area: `x=40, y=80` to `x=555, y=800` (40px margin all sides)
- Header height: ~70px (name/date fields + custom instruction)
- Footer height: ~30px (skill label + attribution)
- Fonts embedded via Google Fonts CDN: **Nunito** (headers/labels) and **Inter** (body/instructions)
- Difficulty → visual complexity: easy = larger shapes, no rotation; hard = smaller shapes, rotated, more distractors

---

## Out of Scope (not planned)

- User accounts or cloud sync
- Server-side rendering
- Real-time collaboration
- Direct PDF export (browser print covers this)
