import { ToggleGroup } from "./ToggleGroup";
import type { Toggles } from "./useDecoder";
import { EXAMPLE_INGREDIENTS } from "./example";

type Props = {
  input: string;
  onInput: (v: string) => void;
  toggles: Toggles;
  onToggles: (t: Toggles) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function InputCard({
  input,
  onInput,
  toggles,
  onToggles,
  onSubmit,
  isLoading,
}: Props) {
  const canSubmit = input.trim().length >= 3 && !isLoading;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-quiet)] sm:p-6">
      <div className="flex items-center justify-between">
        <label
          htmlFor="ingredient-input"
          className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
        >
          Ingredient list
        </label>
        {input.length > 0 ? (
          <button
            type="button"
            onClick={() => onInput("")}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onInput(EXAMPLE_INGREDIENTS)}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Use example
          </button>
        )}
      </div>
      <textarea
        id="ingredient-input"
        value={input}
        onChange={(e) => onInput(e.target.value)}
        rows={7}
        maxLength={4000}
        placeholder="Paste the ingredient list here…"
        className="mt-3 block w-full resize-y rounded-lg border border-input bg-background px-4 py-3 font-sans text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 focus:ring-offset-0"
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <ToggleGroup
          label="Language"
          value={toggles.language}
          onChange={(v) => onToggles({ ...toggles, language: v })}
          options={[
            { value: "en", label: "English" },
            { value: "hinglish", label: "Hinglish" },
          ]}
        />
        <ToggleGroup
          label="Explanation"
          value={toggles.style}
          onChange={(v) => onToggles({ ...toggles, style: v })}
          options={[
            { value: "simple", label: "Simple" },
            { value: "detailed", label: "Detailed" },
          ]}
        />
        <ToggleGroup
          label="Product type"
          value={toggles.productType}
          onChange={(v) => onToggles({ ...toggles, productType: v })}
          options={[
            { value: "food", label: "Food" },
            { value: "skincare", label: "Skincare" },
            { value: "medicine", label: "Medicine" },
          ]}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {input.length}/4000
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="group relative inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-all duration-150 hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="pointer-events-none">
            {isLoading ? "Decoding…" : "Decode ingredients"}
          </span>
          {isLoading ? (
            <span className="pointer-events-none absolute inset-x-4 bottom-1 h-px overflow-hidden">
              <span className="block h-full w-1/3 animate-[slide_1.2s_ease-in-out_infinite] bg-primary-foreground/70" />
            </span>
          ) : null}
        </button>
      </div>
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
