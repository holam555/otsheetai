# OTsheet redesign — handoff notes

_Last updated: 2026-07-05. **Start with [ROADMAP.md](ROADMAP.md)** — it contains the current phased backlog with decisions already made. This file is the historical session log. The app lives in `otsheetai/`._

## 2026-07-06 — Strategy pass 2 (Fable): design + SEO + scroll fix
- **Bug fixed:** SPA navigation kept the gallery scroll offset — opening a
  worksheet landed past the Print/Customize toolbar. `ScrollToTop` on route
  change in App.tsx; verified (scrollY 4221 → 0, toolbar visible).
- **DESIGN_STRATEGY.md:** decided direction "warm paper studio" — site tokens
  (Fredoka display, category palette, taped-paper thumbnails, dotted-path
  motifs) + worksheet redesign (title header, age/level chip, "I did it!"
  reward row, instruction icons, opt-in corner doodles, print-your-own footer
  URL), phased A0–A4 / B1–B4 with acceptance criteria and ink/solvability
  constraints for Opus.
- **seo-content skill:** three intent clusters mapped to page types; /guides
  architecture (G0) speced on the GoalPage pattern; per-article recipe with
  E-E-A-T writing standards for a kids'-health-adjacent site; 20-topic seed
  backlog; llms.txt/JSON-LD rules; one-guide-per-session cadence.

## 2026-07-05 (later) — Fable deferred-items session (D1–D3)

### D3 font licensing decision + print QA
**Licensing:** KG Primary Penmanship 2 / KG Primary Dots (Kimberly Geswein) are
free for *personal use only* — self-hosting (redistribution) and commercial use
require a paid license, and ROADMAP Phase 4 plans monetization. Decision:
replaced with **Edu QLD Beginner** (SIL OFL 1.1, self-hosted at
`public/fonts/EduQLDBeginner.woff2` + license file), an Australian school
beginner-handwriting font. If KG is ever wanted back, buy her commercial/web
license first.

**Dotted trace row is now font-independent:** drawn with SVG paint
(`fill:none` + `stroke-dasharray`) instead of a dotted font. The old failure
mode — CDN down → trace row silently rendered SOLID — is impossible now, and
the cursive option gets a dotted trace row too. Cap-height ratio measured via
canvas TextMetrics: Edu QLD Beginner = 0.772 (was hardcoded 0.72 for KG;
capitals now touch the top line exactly).

**Print QA (all 22 templates × easy + hard, seed 12345):** automated ink-bbox
check of every rendered page against the 595×842 A4 viewBox (tolerance 3px)
via the live app — **0 clipping/overflow issues across all pages**, plus
eyeball checks of tri-line handwriting (caps/baseline alignment, dashed trace),
Chinese grid-box (CJK model chars fall back to a system font — Edu QLD has no
CJK; same behavior as before, acceptable), word-box, trace-name (mixed case,
descenders), pixel-art (8/10/12 grids + legends). Known cosmetic notes, not
defects: dotted row is a dashed-outline style (hollow letters), and UI fonts
(Nunito/Inter) still load from Google Fonts CDN — worksheet-critical fonts are
the self-hosted ones.

### D1 lowercase name tracing
26 manuscript lowercase letterforms authored in `LOWERCASE_PATHS`
(y∈[0,1.4]: 0=ascender line, 0.4=x-height, 1=baseline, 1.4=descender depth),
teaching-correct stroke order/direction. Trace-name preserves mixed case,
normalizes all-one-case to Capitalized form, renders descender-aware rows with
a true x-height guideline. Verified letter-by-letter at high magnification.

### D2 pixel-art difficulty
Easy 8×8 (2–3 colors) and hard 12×12 (4–7 colors) artwork authored for all 10
themes (medium = original 10×10); difficulty wired into generatePixelArtMode
and the control un-hidden. All 20 variants eyeballed as recognizable (easy
rocket reworked with a porthole after failing the first look).

Remaining deferred item: **D4 (OG image)** — see DEFER_TO_FABLE.md.

## 2026-07-05 — Deep strategy pass (Fable session)
- **Engine correctness** (commit `f200934`): closure/sequence duplicate-option bugs fixed (closure printed the correct answer twice in 49% of 2-shape sheets); oddOneOut hard no longer produces unsolvable rotation rows (was 48%); emoji sheets no longer name invisible shapes; M/N/I/J stroke order corrected; trace-name fills the page with numbered per-stroke start dots; 4 solvability regression tests added.
- **Editor stability + persistence**: cosmetic edits (name, instruction, colors) no longer re-roll the puzzle; per-template config + child-name profile persist in localStorage (`src/lib/persistence.ts`); Reset button added; user text XML-escaped before SVG injection.
- **SEO**: accurate metadata + JSON-LD, sitemap.xml (22 routes), llms.txt, per-route titles, honest About copy. Prerendering decided + specced in ROADMAP Phase 2.
- **Decisions recorded in ROADMAP.md**: stay Vite SPA + build-time prerender (no framework migration); profiles client-side until money; freemium via Supabase + Stripe when triggered; LLM = yes but only themed word lists (Haiku via serverless) + later progress notes; no LLM puzzle generation.
- Repo now has git history + GitHub remote (`holam555/otsheetai`) — earlier "no git" notes below are stale.

## TL;DR
Redesigned OTsheet from an "engineer's control panel" into a **gallery-first homepage + preview-first editor**, like Canva. All 17 worksheet modes stay functional; the worksheet generation engine and print output were **not** changed. **34/34 automated tests pass.**

## 2026-06-11 — Visual QA + function-wise control audit (this session)
- **Bug fixed: Trace My Name rendered an empty body.** `traceName` mode was routed to `renderHandwritingMode` (which returns `''` when `handwritingData` is absent — the generator produces `traceNameData`). Re-routed to the existing `renderTraceNameMode` in `WorksheetPreview.tsx`. Added 2 regression tests (data + render-level) in `audit.test.tsx`.
- **Function-wise audit of every control × every mode** (executed against the real generator/renderer, not just code-read). Found ~12 controls that were *shown in the editor but had zero effect for that mode*. **Fix chosen: hide the dead controls** (no engine/output changes) by gating them in `CustomizeControls.tsx`:
  - Removed: find→Exercises slider; sequence/oddOneOut→Grid Size; scissorSkills/pixelArt→Difficulty; Colour switch on maze/connectDots/tracingPaths/scissorSkills/pixelArt/visualScanning; Answer key on copy + the 5 motor/path modes.
  - Gating now uses explicit lists: `SHAPE_MODES` (Colour), `ANSWER_KEY_MODES`, `DIFFICULTY_DEAD_MODES`, trimmed `EXERCISE_SLIDER_MODES`/`GRID_MODES`.
  - Wordbox handwriting layouts no longer render a blank sheet with no words — they show an "Add words…" placeholder (`renderWordBoxesMode`).
- **Dead-code cleanup:** removed `pixelArtGridSize` field/type/default (zero consumers), the unreachable `paperStyle === 'both'` render branch (+ narrowed `HandwritingPaperStyle`), and a duplicated unused `rows[]` build in `generateTracingPathsMode`. tsc + build + 34/34 tests green.
- **Left as-is (intentional):** `showGridLines` is a *functional* field read by 4 renderers but has no UI control (not dead — don't delete). Minor "weak but works" semantics untouched: copy difficulty only rotates; mirror difficulty collapses at 2×2; maze medium≈hard carving; pixelArt B&W only restyles the legend; borderStyle is a no-op on tri-line/4-line handwriting.

## How to run
```bash
npm --prefix otsheetai run dev      # dev server on http://localhost:8080
npm --prefix otsheetai test         # vitest — includes the control-reflection audit
npm --prefix otsheetai run build    # production build (verified passing)
```
`.claude/launch.json` defines two servers: `otsheet-dev` (8080) and `otsheet-preview` (4173).
This copy lives at a normal path (no iCloud/spaces), so the preview MCP screenshot/inspect tools work here — use them for visual QA.

## What was built (Phases 1–5, cores done)
- **Phase 1 – Gallery home** (`src/pages/Gallery.tsx`, `src/components/gallery/`): responsive card grid; each card is a REAL rendered worksheet preview via the existing engine (`TemplateCard` + `WorksheetPreview variant="thumb"`), with stable seeded generation (`src/lib/seededGenerate.ts`). Friendly title + age badge + skill tag. Click → `/edit/:templateId`.
- **Phase 2 – Editor** (`src/pages/Editor.tsx`, `src/components/editor/`): large centered live preview; **Print** + **Regenerate** primary buttons; **Customize** collapsed by default → **Age first** (drives difficulty) → mode essentials → **Advanced** accordion. Core/advanced split per mode lives in `CustomizeControls.tsx`.
- **Phase 3 – Browse**: filter by age / goal (parent-friendly) / language, plus an "All worksheet types" clinical filter. Maps in `src/data/templates.ts`.
- **Phase 4 – Trust**: About strip (placeholder OT copy), footer (About / Contact / Buy Me a Coffee placeholders), **no login wall** — gentle post-3-print nudge via `src/hooks/use-print-count.ts`.
- **Phase 5 – Mobile**: 2-col gallery, Customize as a bottom sheet (vaul Drawer), "print from desktop" note.

## Key files
- `src/data/templates.ts` — 22 templates covering all 17 modes; goal/age/language maps; `templateConfig()`.
- `src/lib/defaultConfig.ts` — shared default config + age-band → difficulty mapping (extracted from old Index.tsx).
- `src/lib/seededGenerate.ts` — deterministic thumbnails (swaps Math.random around one call; engine untouched).
- `src/components/editor/CustomizeControls.tsx` — the core-vs-advanced control classification, per mode.
- `src/test/audit.test.tsx` — proves every control reflects in the worksheet (data-level + render-level).

## Audit result
As of 2026-06-11 (see session note above): every **visible** control now changes the worksheet. The controls that were shown-but-inert have been hidden, and the dead `pixelArtGridSize` field was deleted. Answer keys verified semantically correct for find/count/oddOneOut/closure/mirror/sequence/pattern/figureGround/visualScanning.

## Cleanup done
- Deleted superseded `src/pages/Index.tsx` and `src/components/WorksheetControls.tsx` (replaced by Gallery/Editor + CustomizeControls). Build + tests still green.

## Pending / next steps
1. ~~Visual QA + polish pass~~ — done 2026-06-11 (gallery + editor + mobile bottom sheet + answer-key correctness checked; see session note).
2. ~~Decide pixelArtGridSize~~ — done (field deleted).
3. Replace placeholders: About copy, Contact email, Buy Me a Coffee link.
4. Optional (deferred — would change worksheet output, so left for product call): instead of *hiding* the inert controls, *implement* them — e.g. find generates multiple grids for "exercises per sheet", scissorSkills/pixelArt difficulty changes complexity, Colour affects motor modes. Also consider exposing a `showGridLines` control (functional field, currently no UI).
5. Nothing is committed to git (repo has no `.git`); consider `git init` + first commit.

## Constraints honored (do not regress)
- Don't break worksheet generation logic (`src/lib/shapes.ts`) — UI/IA redesign only.
- Reuse the existing rendering engine for thumbnails.
- Keep print output untouched (`window.print()` + `.no-print` CSS; preview SVG prints as-is).
- Friendly rounded style, generous whitespace, clean enough for clinical professionals.
