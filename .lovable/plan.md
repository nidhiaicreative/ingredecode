## Scope
Pure content + small UI additions to the results view. No changes to Mesh calls, toggle logic, or component wiring for input.

## 1. Schema + prompt (extend AI response)
`src/features/decoder/schema.ts`: extend `decodeResultSchema`:
- `buying_recommendation: string` (one sentence)
- Per ingredient: `kitchen_familiarity: "common_kitchen" | "processed"` (optional, default `"processed"` when absent so older responses still parse)

`src/features/decoder/prompt.ts`: update `SCHEMA_HINT` and instructions:
- Ask model to always include `buying_recommendation` (context-aware: adult/parent framing for food; skin-type framing for skincare; usage-caution framing for medicine).
- Ask model to tag each ingredient's `kitchen_familiarity` as `"common_kitchen"` (would be recognized in a traditional Indian kitchen — e.g. sugar, salt, atta, ghee, haldi, jeera) or `"processed"` (additives, E-numbers, INS codes, synthetic actives).

Zod `.catch()` / `.default()` used so partial older responses don't hard-fail.

## 2. New component: Grandma Test card
`src/features/decoder/GrandmaTest.tsx` — food-only card:
- Header: `👵 Grandma Understandability`
- 5-star rating: `stars = round((common / total) * 5)`, rendered with filled/empty star glyphs (lucide `Star`), reusing existing card styling (`rounded-[var(--radius-card)] border bg-card shadow-[var(--shadow-soft)]`)
- Line: `Only {common} of {total} ingredients are commonly found in a traditional kitchen.`

Rendered in `ResultsView.tsx` between `HealthMeter` and `FlaggedIngredients`, wrapped in `<Reveal delay={120}>`, only when `data.mode_used.product_type === "food"`. Remaining Reveal delays shifted slightly for cadence.

## 3. Dynamic label renames
All label-only, product_type-aware via `data.mode_used.product_type`:

- **PlainLanguageExplanation** (`PlainLanguageExplanation.tsx`): accept optional `productType` prop; label map — food → `Kitchen Language`, skincare → `Simple Language`, medicine → `Plain Language`.
- **FlaggedIngredients** (`FlaggedIngredients.tsx`): header → `Ingredients Worth Understanding`.
- **IngredientCard** (`IngredientCard.tsx`): `Purpose` → `Why added?`.
- **HealthMeter** (`HealthMeter.tsx`): score display → `{pct}/100` (keep animation, keep font size — append `/100` in a smaller muted span so the big numeral still dominates).

`ResultsView` passes `data.mode_used.product_type` into `PlainLanguageExplanation`.

## 4. Summary "If I were buying this…"
`OverallSummary.tsx`: accept optional `recommendation?: string` prop. Above the existing summary text, render:
- Small uppercase label: `If I were buying this…`
- One line: `{recommendation}` in the existing serif style but smaller (e.g. `text-lg`) so the main summary stays the visual anchor.
Hide the block entirely when `recommendation` is missing (older responses).
`ResultsView` passes `data.buying_recommendation`.

## Out of scope
`useDecoder`, `mesh.functions.ts`, `mesh.server.ts`, input/toggle components, brand colors, shadows, radii, existing animations.

## Files touched
- `src/features/decoder/schema.ts`
- `src/features/decoder/prompt.ts`
- `src/features/decoder/GrandmaTest.tsx` (new)
- `src/features/decoder/ResultsView.tsx`
- `src/features/decoder/OverallSummary.tsx`
- `src/features/decoder/HealthMeter.tsx`
- `src/features/decoder/FlaggedIngredients.tsx`
- `src/features/decoder/IngredientCard.tsx`
- `src/features/decoder/PlainLanguageExplanation.tsx`
