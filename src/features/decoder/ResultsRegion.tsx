import { ResultsEmpty } from "./ResultsEmpty";
import { ResultsError } from "./ResultsError";
import { ResultsSkeleton } from "./ResultsSkeleton";
import { ResultsView } from "./ResultsView";
import type { DecoderState } from "./useDecoder";

type Props = {
  state: DecoderState;
  onExample: () => void;
  onRetry: () => void;
};

export function ResultsRegion({ state, onExample, onRetry }: Props) {
  return (
    <section aria-live="polite" aria-atomic="false" className="mt-6">
      {state.kind === "idle" ? <ResultsEmpty onExample={onExample} /> : null}
      {state.kind === "loading" ? <ResultsSkeleton /> : null}
      {state.kind === "error" ? (
        <ResultsError code={state.code} message={state.message} onRetry={onRetry} />
      ) : null}
      {state.kind === "success" ? <ResultsView data={state.data} /> : null}
    </section>
  );
}
