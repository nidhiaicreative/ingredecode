import { AlertCircle } from "lucide-react";

type Props = { items: string[] };

export function FlaggedIngredients({ items }: Props) {
  if (!items.length) return null;
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Worth a closer look
      </span>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-1.5 rounded-full border border-tint-caution-border bg-tint-caution-bg px-3 py-1 text-sm text-tint-caution-fg shadow-[var(--shadow-quiet)] transition-transform duration-200 motion-safe:hover:scale-[1.04]"
          >
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
