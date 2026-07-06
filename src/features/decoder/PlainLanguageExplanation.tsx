type Props = { text: string };

export function PlainLanguageExplanation({ text }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/50 p-6">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        In plain language
      </span>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground">
        {text}
      </p>
    </div>
  );
}
