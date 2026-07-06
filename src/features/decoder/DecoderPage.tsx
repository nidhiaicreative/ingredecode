import { Hero } from "./Hero";
import { InputCard } from "./InputCard";
import { ResultsRegion } from "./ResultsRegion";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { EXAMPLE_INGREDIENTS } from "./example";
import { useDecoder } from "./useDecoder";

export function DecoderPage() {
  const { input, setInput, toggles, setToggles, state, submit, retry } = useDecoder();

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <section className="mx-auto w-full max-w-3xl px-6">
          <InputCard
            input={input}
            onInput={setInput}
            toggles={toggles}
            onToggles={setToggles}
            onSubmit={submit}
            isLoading={state.kind === "loading"}
          />
          <ResultsRegion
            state={state}
            onExample={() => setInput(EXAMPLE_INGREDIENTS)}
            onRetry={retry}
          />
        </section>
        <SiteFooter />
      </main>
    </div>
  );
}
