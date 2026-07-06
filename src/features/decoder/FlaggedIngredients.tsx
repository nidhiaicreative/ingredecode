type Props = { items: string[] };

export function FlaggedIngredients({ items }: Props) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-quiet)]">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Worth a closer look
      </span>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-[oklch(0.85_0.06_60)] bg-[oklch(0.97_0.03_75)] px-3 py-1 text-sm text-[oklch(0.4_0.1_55)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
