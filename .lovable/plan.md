# Visual Polish Plan — Results Section

Pure styling pass. No changes to `useDecoder`, `mesh.functions.ts`, `mesh.server.ts`, `schema.ts`, toggle logic, or API flow. Brand tokens in `src/styles.css` (forest green primary, cream background, Instrument Serif) stay intact — we only *add* new tokens and tune existing component classes.

## 1. Design tokens (`src/styles.css`)

Add, don't replace:

- **Severity tints** (soft, low-chroma backgrounds + borders + text):
  - `--tint-safe-bg`, `--tint-safe-border`, `--tint-safe-fg` (soft green, from primary hue)
  - `--tint-moderate-bg / border / fg` (neutral cream-tan)
  - `--tint-caution-bg / border / fg` (soft amber)
  - `--tint-avoid-bg / border / fg` (soft red-orange, from destructive hue)
- **Elevation**: keep `--shadow-quiet`, add `--shadow-soft` (larger blur, lower opacity) and `--shadow-pop` (tight shadow under numerals).
- **Radii**: introduce `--radius-card: 1.125rem` (18px) for result cards.
- **Meter gradient**: `--gradient-meter: linear-gradient(90deg, var(--primary), oklch(0.75 0.13 90), oklch(0.6 0.16 40))`.
- Register the new colors in `@theme inline` so utility classes (`bg-tint-safe`, etc.) work.

## 2. Component changes

### `ResultsView.tsx`
- Increase vertical rhythm: `space-y-3` → `space-y-6` (sm) / `space-y-8` (md+).
- Group Summary + HealthMeter in a subtly warmer surface (`bg-card`), Ingredients on `bg-background`, PlainLanguage on `bg-secondary/60` — so blocks feel distinct.
- Add staggered entrance: each child gets `motion-safe:animate-fade-in` with incremental `style={{ animationDelay }}` (0, 60, 120, 180, 240ms).

### `IngredientCard.tsx`
- Radius `rounded-xl` → `rounded-[var(--radius-card)]`.
- Background driven by `evidence_level` → severity tint (strong=safe, moderate=moderate, limited=caution, unclear=muted).
- Shadow: `shadow-[var(--shadow-soft)]`, hover lifts to `--shadow-lifted` with `-translate-y-0.5` transition.
- Badge keeps evidence label but adopts the same tint palette for coherence.

### `HealthMeter.tsx`
- Bar height `h-1.5` → `h-3`, rounded-full, inner track `bg-muted/70`.
- Fill uses `--gradient-meter`, width animates from 0 → `pct` on mount (CSS transition + mount effect flipping width) over 900ms `cubic-bezier(0.22, 1, 0.36, 1)`.
- Score numeral: larger (`text-4xl`), add `text-shadow`-style glow via a stacked `drop-shadow` using `--shadow-pop` in the score's tone.
- Category label chip below bar with matching tint.

### `FlaggedIngredients.tsx`
- Chips: pill shape (already round), swap hard amber palette for severity-mapped tint tokens.
- Add a small leading dot/icon (`AlertCircle` from `lucide-react`, `h-3.5 w-3.5`) before text.
- Hover: `transition-transform hover:scale-[1.04]` (motion-safe).

### `OverallSummary.tsx` & `PlainLanguageExplanation.tsx`
- Bump radius to `--radius-card`, use `--shadow-soft`.
- Summary card: slightly warmer `bg-card` with a hairline top accent bar (2px, `bg-primary/40`).
- PlainLanguage: keep `bg-secondary/60`, add `shadow-quiet`.

### `IngredientList.tsx`
- Gap `gap-3` → `gap-4 sm:gap-5`.
- Section label spacing bumped, add a thin `border-t border-border/60` divider above list on md+.

## 3. Motion

- Rely on existing `tw-animate-css` (`animate-fade-in`, `animate-scale-in`) already imported in `src/styles.css`.
- All animations wrapped in `motion-safe:` (existing `prefers-reduced-motion` reset in `styles.css` still guards).
- Health meter uses `useEffect` + `useState` to trigger width transition after mount — purely presentational, no data logic touched.

## 4. Out of scope (unchanged)

- `useDecoder.ts`, `mesh.*`, `schema.ts`, `prompt.ts`, `InputCard`, `ToggleGroup`, `Hero`, `SiteHeader`, `SiteFooter`, routes, SEO metadata.
- Brand hues (primary green, cream bg, destructive red, serif font).
- Copy, layout structure, component API.

## Files touched

- `src/styles.css` (add tokens only)
- `src/features/decoder/ResultsView.tsx`
- `src/features/decoder/IngredientCard.tsx`
- `src/features/decoder/HealthMeter.tsx`
- `src/features/decoder/FlaggedIngredients.tsx`
- `src/features/decoder/OverallSummary.tsx`
- `src/features/decoder/PlainLanguageExplanation.tsx`
- `src/features/decoder/IngredientList.tsx`
