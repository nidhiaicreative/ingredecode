type Props = { summary: string; recommendation?: string };

export function OverallSummary({ summary, recommendation }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/40" aria-hidden />
      {recommendation ? (
        <div className="mb-5">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            If I were buying this…
          </span>
          <p className="mt-2 font-serif text-lg leading-snug text-foreground">
            {recommendation}
          </p>
        </div>
      ) : null}
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Summary
      </span>
      <p className="mt-3 font-serif text-2xl leading-snug text-foreground sm:text-[1.75rem]">
        {summary}
      </p>
    </div>
  );
}
