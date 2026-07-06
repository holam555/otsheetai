# Grading audit — full matrix sweep (2026-07-05)

Audit of whether Age and Challenge produce real, clinically sensible grading in
every mode. Method: for all **17 modes × 3 age bands × 3 challenge levels**,
generate seeded worksheets through the real `applyGrading()` path and extract
the *measurable task parameters* (grid dims, item counts, rotation counts,
palette sizes, contour gaps, wall counts, letter heights…), then spot-check the
actual buttons in the browser. Re-run the matrix with the snippet in
`.claude/skills/worksheet-grading` (verification recipe) after any grading
change.

## Verdict per mode (age-band steps at standard challenge)

| Mode | What changes 3-4 → 5-6 → 7-8 | Verdict |
|---|---|---|
| find | grid 3×3→4×4→5×5, rotated distractors 0→3→17, similar-shape pool at hard | **STRONG** |
| pattern | pattern dim 2→3→4, distractor subtlety (2-cell swap → similar 1-cell) | **STRONG** |
| count | 2 kinds/2×2 → 3/3×3 → 4/4×4, hard adds non-target distractors | **STRONG** |
| copy | dim 2→3→4, palette 2→3→4, rotation 0→2→12 cells | **STRONG** |
| sequence | rows 3→5→8, period 2→~2.8→3 | OK (see F5) |
| oddOneOut | rows 3→5→8; odd goes different-shape → similar-shape → rotation-only | **STRONG** |
| mirror | dim 2→3→4, filled cells 2→5→13 | **STRONG** |
| figureGround | shapes 6→8→10, size 62→46→35 avg r (fixed this pass) | OK (see F1) |
| closure | rows 3→5→8, contour present ~80%→62%→50% (fixed this pass) | **STRONG** |
| traceName | letter height 60→50→40px (renderer) | WEAK-OK (see F2) |
| handwriting | letter height 20→15→12 mm | **STRONG** |
| maze | 8×8→12×12→16×16 + shortcuts 25%→10%→0% | **STRONG** |
| connectDots | dots ~16→~31→~62 | **STRONG** |
| tracingPaths | rows 3→4→5, thickness thick→thin, row height ↓, curve segments ↑ | **STRONG** |
| scissorSkills | lines 4→6→8, curve amplitude/turns ↑ (path length 257→446→1265) | **STRONG** |
| visualScanning | grid 6×8→8×10→10×12, char large→small, targets 10→16→24 | **STRONG** |
| pixelArt | artwork 8×8→10×10→12×12, colors ↑ | **STRONG** |

Challenge (Easier/Just right/Harder) shifts the same ladder ±1 level in every
mode; ages 3–4 are capped at medium difficulty. Edge bands have one dead
direction by construction — the UI now disables that button (see fixes).

## Fixed in this pass

1. **Closure easy == medium contour gap.** The computed dash formula had a
   `max(3,…)` floor that collapsed 15% and 30% missing-contour to the same
   `8,3` pattern — the *core clinical lever* of closure didn't grade. Now
   explicit: `12,3` / `8,5` / `6,6` (~80/62/50% contour). Regression test.
2. **figureGround hard shared medium's size pool** (avg r 48 vs 49) — only the
   count changed. Now easy [50-70] / medium [38-55] / hard [28-42]. Test.
3. **Challenge dead buttons at edge bands.** At 3–4 "Easier" and at 7–8
   "Harder" silently did nothing (level clamp). Now disabled with an
   explanatory tooltip, and the selection snaps back to "Just right" when an
   age switch would strand it. Verified via real clicks.

## Follow-ups for Opus (each self-contained; use the worksheet-grading +
## worksheet-audit skills)

- **F1 — figureGround: enforce overlap.** Shapes are placed at random and may
  not overlap at all — without embedded/overlapping contours this degenerates
  into find-and-count, which weakens its clinical claim (figure-ground =
  distinguishing a figure from a competing background). Make medium/hard
  guarantee overlap (e.g. place each shape within r of an existing one until
  ≥60% of shapes intersect another; easy can stay sparse). Files:
  `generateFigureGroundMode` in `src/lib/shapes.ts`. Acceptance: computed
  pairwise intersections ≥60% of shapes at medium+, visually verified; counts
  in the answer key still correct.
- **F2 — traceName: a second age lever.** Age currently only changes letter
  height (via difficulty). Clinically, younger children also need fewer
  repetitions and a thicker reference. Suggest: 3–4 = 2 trace/write pairs with
  extra-thick reference strokes; 7–8 = more repetitions (fills page) and
  thinner guides. Files: `renderTraceNameMode` in `WorksheetPreview.tsx`
  (+ a preset entry in `grading.ts` if a config field is added). Acceptance:
  band change visibly alters rows/stroke weight, arm's-length test passes.
- **F3 — copy hard "memory" variant** (ROADMAP 1.1 leftover, product call):
  hard could blank 1 cell of the model ("remember and skip") for visual-memory
  load. Only if the user wants it — mark in the sheet's instructions clearly.
- **F4 — visualScanning target ratio.** Fixed at 20% ('few') across levels;
  consider 25%→20%→15% by level so older kids scan more field per hit. Minor.
- **F5 — sequence medium determinism.** Medium rows draw period from
  randomFrom([2,3]) — an unlucky sheet can be all period-2 (indistinguishable
  from easy rows). Guarantee ≥1 period-3 row per medium sheet. Files:
  `generateSequenceMode`. Acceptance: 100 seeded medium sheets each contain a
  period-3 row.
- **F6 — template override hygiene.** Overrides bypass age presets at load (by
  design), but some are now redundant or stale (e.g. `find-shapes` sets
  `exerciseCount: 5`, which find ignores). Audit the 22 templates: keep only
  overrides that intentionally deviate from the preset. Acceptance: every
  remaining override changes the generated sheet vs. the preset default.

## Re-audit rule

Any change to `grading.ts`, `ageBandConfig`, or a generator's difficulty
branches → re-run the matrix sweep and the arm's-length screenshot test
(worksheet-grading skill), and re-run solvability checks at whatever
difficulty becomes a band default (worksheet-audit skill).
