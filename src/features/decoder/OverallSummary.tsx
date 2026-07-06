type Props = { summary: string };

export function OverallSummary({ summary }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-quiet)]">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Summary
      </span>
      <p className="mt-3 font-serif text-2xl leading-snug text-foreground sm:text-[1.75rem]">
        {summary}
      </p>
    </div>
  );
}
