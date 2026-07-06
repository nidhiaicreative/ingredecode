import { cn } from "@/lib/utils";
import type { HealthCategory } from "./schema";

const CATEGORY_META: Record<
  HealthCategory,
  { label: string; tone: string; bar: string }
> = {
  safe: {
    label: "Generally safe",
    tone: "text-primary",
    bar: "bg-primary",
  },
  moderate: {
    label: "Mostly fine",
    tone: "text-foreground",
    bar: "bg-primary/70",
  },
  caution: {
    label: "Use with care",
    tone: "text-[oklch(0.55_0.13_60)]",
    bar: "bg-[oklch(0.65_0.14_60)]",
  },
  avoid: {
    label: "Consider avoiding",
    tone: "text-destructive",
    bar: "bg-destructive/80",
  },
};

type Props = { score: number; category: HealthCategory };

export function HealthMeter({ score, category }: Props) {
  const meta = CATEGORY_META[category];
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-quiet)]">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Health meter
        </span>
        <span className={cn("font-serif text-3xl", meta.tone)}>{pct}</span>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", meta.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={cn("mt-3 text-sm", meta.tone)}>{meta.label}</p>
    </div>
  );
}
