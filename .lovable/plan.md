# IngreDecode — Implementation Plan

## 1. Product Overview

IngreDecode is a single-page interactive tool that takes a pasted ingredient list (food, skincare, or medicine) and returns a calm, scientifically grounded, plain-language breakdown. It targets everyday Indian consumers — especially parents and health-conscious buyers — who see terms like "INS322" or "E150d" and want clarity, not fear.

- **Name:** IngreDecode
- **Tagline:** Know what's inside, before it's inside you.
- **Subheading:** Translate confusing ingredient labels into clear, evidence-based explanations in seconds.
- **Scope:** One page. No auth, no database, no accounts, no pricing. Hero → Input → Results.
- **Voice:** Editorial, trustworthy, quiet. Inspired by Apple Health, Perplexity, Linear, Notion, Stripe.

## 2. User Journey

1. User lands on the page → reads hero (what this is, in one line).
2. Scrolls (or is anchored) to the input card.
3. Pastes an ingredient list.
4. Selects three toggles: **Language** (English / Hinglish), **Explanation style** (Simple / Detailed), **Product type** (Food / Skincare / Medicine).
5. Clicks "Decode ingredients."
6. Sees a loading state (calm, not spinny) while the Mesh API returns structured JSON.
7. Results render in place, below the input: overall summary, health meter, flagged ingredients, per-ingredient cards, plain-language explanation.
8. User can edit input and re-decode, or clear and start over. Optionally copy/share the summary.

## 3. Page Hierarchy

Single route: `/` (`src/routes/index.tsx`).

Vertical sections on that one page:

```text
┌─ Header (wordmark + tiny "about" link that scrolls to footer note)
├─ Hero (title, subhead, one-line credibility from the founder)
├─ Decoder
│   ├─ Input card (textarea + toggles + primary button)
│   └─ Results region (empty | loading | error | data)
└─ Footer (about the founder, disclaimer, no ads)
```

No separate About/Contact/Pricing routes — this is a tool, not a marketing site.

## 4. Component Hierarchy

```text
routes/index.tsx
└─ <DecoderPage/>
   ├─ <SiteHeader/>
   ├─ <Hero/>
   ├─ <DecoderSection/>
   │  ├─ <InputCard/>
   │  │  ├─ <IngredientTextarea/>
   │  │  ├─ <ToggleGroup label="Language"/>
   │  │  ├─ <ToggleGroup label="Explanation"/>
   │  │  ├─ <ToggleGroup label="Product type"/>
   │  │  └─ <DecodeButton/>
   │  └─ <ResultsRegion state=…>
   │     ├─ <ResultsEmpty/>       (initial)
   │     ├─ <ResultsSkeleton/>    (loading)
   │     ├─ <ResultsError/>       (error, with retry)
   │     └─ <ResultsView data=…>  (success)
   │        ├─ <OverallSummary/>
   │        ├─ <HealthMeter score category/>
   │        ├─ <FlaggedIngredients items/>
   │        ├─ <IngredientList items/>
   │        │  └─ <IngredientCard/> (name, common_name, purpose, safety_note, evidence badge)
   │        └─ <PlainLanguageExplanation/>
   └─ <SiteFooter/>
```

All primitives (Button, Textarea, Card, Badge, RadioGroup/Toggle, Skeleton, Alert) come from the existing shadcn/ui set.

## 5. Folder Structure

```text
src/
├─ routes/
│  ├─ __root.tsx            (update <head>: title, description, og:*)
│  └─ index.tsx             (renders <DecoderPage/>)
├─ features/decoder/
│  ├─ DecoderPage.tsx
│  ├─ Hero.tsx
│  ├─ SiteHeader.tsx
│  ├─ SiteFooter.tsx
│  ├─ InputCard.tsx
│  ├─ IngredientTextarea.tsx
│  ├─ ToggleGroup.tsx
│  ├─ DecodeButton.tsx
│  ├─ ResultsRegion.tsx
│  ├─ ResultsEmpty.tsx
│  ├─ ResultsSkeleton.tsx
│  ├─ ResultsError.tsx
│  ├─ ResultsView.tsx
│  ├─ OverallSummary.tsx
│  ├─ HealthMeter.tsx
│  ├─ FlaggedIngredients.tsx
│  ├─ IngredientList.tsx
│  ├─ IngredientCard.tsx
│  ├─ PlainLanguageExplanation.tsx
│  ├─ schema.ts             (Zod schema for the Mesh JSON response)
│  ├─ types.ts              (TS types derived from schema)
│  ├─ prompt.ts             (buildPrompt(input, toggles) → string)
│  └─ useDecoder.ts         (client hook: state machine + calls server fn)
├─ lib/
│  ├─ mesh.functions.ts     (createServerFn: decodeIngredients)
│  └─ mesh.server.ts        (Mesh API client, reads process.env.MESH_API_KEY)
└─ styles.css               (add warm cream bg + forest-green accent tokens)
```

Rationale: `features/decoder/` keeps every decoder-specific piece colocated; `lib/mesh.*` is the only server surface.

## 6. State Management

Local React state inside `useDecoder.ts`. No global store, no TanStack Query cache (single one-shot call per submit is fine, but we'll still use TanStack Query's `useMutation` for retry/error ergonomics since it's already in the project).

State machine:

```text
idle → submitting → success
              ↘ error → (retry) submitting
```

Tracked state:
- `input: string`
- `toggles: { language: 'en'|'hinglish'; style: 'simple'|'detailed'; productType: 'food'|'skincare'|'medicine' }`
- `mutation` from `useMutation` → `status`, `data`, `error`

Persisting the last successful result in `sessionStorage` is a nice-to-have; skipped in v1 to keep scope tight.

## 7. Mesh API Flow

```text
Client (useDecoder)
  → useMutation(decodeIngredients)
     → createServerFn 'decodeIngredients' (src/lib/mesh.functions.ts)
        - Zod-validates { input, toggles }
        - Builds prompt via prompt.ts
        - Calls Mesh API (mesh.server.ts) with MESH_API_KEY from process.env
        - Instructs Mesh to return STRICT JSON matching schema.ts
        - Zod-parses the model's JSON; on parse failure, one retry with
          a stricter "return only JSON" reminder, then throw a typed error
        - Returns parsed object to client
Client
  → renders <ResultsView data=…>
```

Details:
- Secret `MESH_API_KEY` stored via `add_secret` (never hardcoded, never `VITE_`).
- Server function reads `process.env.MESH_API_KEY` inside the handler.
- If Mesh is OpenAI-compatible, we use `fetch` directly against its endpoint — no AI SDK dependency, since the user has explicitly named Mesh as the required provider.
- Rate-limit / non-2xx responses surface as typed errors → `<ResultsError/>`.

## 8. JSON Response Structure (contract)

Exact shape we validate with Zod and render:

```ts
{
  overall_summary: string,
  health_meter: { score: number /* 0–100 */, category: 'safe'|'moderate'|'caution'|'avoid' },
  flagged_ingredients: string[],
  ingredients: Array<{
    name: string,
    common_name: string,
    purpose: string,
    safety_note: string,
    evidence_level: 'strong'|'moderate'|'limited'|'unclear'
  }>,
  plain_language_explanation: string,
  mode_used: {
    language: 'en'|'hinglish',
    explanation_style: 'simple'|'detailed',
    product_type: 'food'|'skincare'|'medicine'
  }
}
```

The prompt sent to Mesh will embed this schema verbatim and instruct: "Respond with ONLY a JSON object matching this shape. No prose, no code fences."

## 9. Animation Plan

Restrained, editorial. All animations wrapped in a `useReducedMotion` check; when reduced motion is on, they become instant opacity swaps with no transform.

- Hero: 400ms fade + 8px rise on mount.
- Input card: focus ring transitions 150ms ease-out.
- Decode button: subtle scale 0.98 on press; label crossfades to "Decoding…" with a thin 1px progress underline (not a spinner).
- Results appear: staggered 60ms fade-in per card (summary → meter → flagged → ingredients → explanation).
- Health meter: bar fills from 0 to score over 700ms cubic-bezier(0.2, 0.8, 0.2, 1).
- Ingredient cards: hover raises shadow from `--shadow-quiet` to `--shadow-quiet-lifted` (very subtle, 4→8px blur).

No page-scroll parallax, no gradients, no glass.

## 10. Responsive Design Strategy

Mobile-first, single column always. Breakpoints:
- **< 640px:** everything stacks; textarea is 10 rows; toggle groups become full-width segmented controls; ingredient cards are 1 column.
- **640–1024px:** container maxes at 680px; ingredient cards 1 column (readability > density).
- **≥ 1024px:** container maxes at 760px; ingredient cards optionally 2 columns; hero copy caps at 640px measure.

Uses `min-h-dvh` (not `h-screen`) for full-height sections. Tap targets ≥ 44px. Textarea autosize with a sensible max height + internal scroll.

## 11. Error States

Handled in `<ResultsError/>`:
- **Network / 5xx:** "We couldn't reach the decoder. Please try again." + Retry button.
- **Rate-limited (429):** "Too many requests right now. Give it a moment."
- **Invalid/empty input:** blocked client-side before submit; textarea shows helper text.
- **Schema parse failure (Mesh returned non-JSON):** "The decoder returned an unexpected response. Retrying often fixes this." + Retry.
- **Missing API key (dev only):** developer-visible message; production shows the generic network error.

All errors are calm, sentence-case, no exclamation marks, no emoji.

## 12. Loading States

- Submit button: label swaps to "Decoding…"; button disabled; 1px progress underline animates.
- Results region: `<ResultsSkeleton/>` renders 5 muted blocks matching the eventual layout (summary bar, meter bar, chip row, three ingredient rows, paragraph). No spinners.
- Skeleton uses `bg-muted` with a very slow (2s) opacity pulse; respects `prefers-reduced-motion`.

## 13. Empty States

- Before first submit: `<ResultsEmpty/>` shows a soft, one-line prompt: "Your decoded breakdown will appear here." plus a tiny example chip ("Try: water, sugar, INS 322, E150d…") that, when clicked, pre-fills the textarea.
- After clearing input: returns to the same empty state.

## 14. Future Extension Architecture

Designed so v2 is additive, not a rewrite:
- **History / saved decodes:** the `useDecoder` result shape is already serializable; drop it into Lovable Cloud + a `decodes` table later without touching UI components.
- **OCR from photo:** add an `<ImageDropzone/>` that produces the same `input: string`; the rest of the pipeline is untouched.
- **Multiple languages:** `toggles.language` is already an enum; adding `'ta' | 'hi' | 'mr'` requires only prompt updates.
- **Share links:** results are pure JSON; a `/d/:id` route can render `<ResultsView/>` from stored JSON.
- **Auth + personal flags** (e.g., "I'm allergic to X"): wraps the current page in `_authenticated/` and injects user preferences into the prompt builder — no component changes.

## 15. Technical Details

- **Stack:** existing TanStack Start + shadcn/ui + Tailwind v4 tokens in `src/styles.css`. No new frameworks.
- **New deps:** none required beyond what's installed (Zod is already available via shadcn form patterns; if missing we'll `bun add zod`).
- **Design tokens (added to `src/styles.css`):**
  - `--background: oklch(0.985 0.01 85)` (warm cream)
  - `--foreground: oklch(0.22 0.02 150)` (deep ink with a green whisper)
  - `--accent / --primary: oklch(0.42 0.07 155)` (forest green)
  - `--muted`, `--border`, `--card` shifted to warm neutrals
  - Two shadow tokens: `--shadow-quiet`, `--shadow-quiet-lifted` (very small y-offset, low alpha)
  - Dark mode tokens omitted for v1 (single warm-light theme, matching the brief).
- **Typography:** one distinctive serif for display (e.g. Instrument Serif) + one calm sans for body (e.g. Inter Tight or Söhne-like via a free alternative). Installed via `@fontsource/*` packages and imported in `src/start.ts` (never `<link>` or CSS `@import`).
- **Head metadata** set in `src/routes/index.tsx` `head()`: real title "IngreDecode — Know what's inside", real description, og:title, og:description, og:type, twitter:card. No og:image in v1 unless a hero image is generated.
- **A11y:** semantic `<main>`, single `<h1>`, labeled controls (`<label htmlFor>` + `aria-describedby` for helper text), `aria-live="polite"` on `<ResultsRegion/>`, focus-visible rings on all interactives, all animations gated on `useReducedMotion`.
- **Server function shape:** `createServerFn({ method: 'POST' }).inputValidator(zodParse).handler(async ({ data }) => …)`. `MESH_API_KEY` read inside the handler.

## Open Questions (please confirm before I build)

1. **Mesh API endpoint & auth:** what's the base URL, the auth header name (e.g. `Authorization: Bearer …` or a custom header), and the request/response shape? OpenAI-compatible `/chat/completions`, or something custom? This decides `mesh.server.ts` in one line.
2. **Fonts:** OK with **Instrument Serif** (display) + **Inter Tight** (body)? Or do you want a different pairing?
3. **Accent color:** forest green (`oklch(0.42 0.07 155)`) vs muted teal (`oklch(0.48 0.06 195)`) — which?
4. **Example prefill chip:** should I include a real example ingredient list (helpful for first-time users), or leave the textarea completely blank?
5. **Founder credibility line:** may I include a small "Built by a molecular biologist" line in the hero/footer, or keep the founder story off the page entirely?
