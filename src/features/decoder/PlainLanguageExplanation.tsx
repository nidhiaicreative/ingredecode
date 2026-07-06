type Props = { text: string };

export function PlainLanguageExplanation({ text }: Props) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-secondary/60 p-6 shadow-[var(--shadow-quiet)]">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        In plain language
      </span>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground">
        {text}
      </p>
    </div>
  );
}
