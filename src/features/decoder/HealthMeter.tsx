import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { HealthCategory } from "./schema";

const CATEGORY_META: Record<
  HealthCategory,
  { label: string; tone: string; chip: string }
> = {
  safe: {
    label: "Generally safe",
    tone: "text-tint-safe-fg",
    chip: "bg-tint-safe-bg text-tint-safe-fg border-tint-safe-border",
  },
  moderate: {
    label: "Mostly fine",
    tone: "text-tint-moderate-fg",
    chip: "bg-tint-moderate-bg text-tint-moderate-fg border-tint-moderate-border",
  },
  caution: {
    label: "Use with care",
    tone: "text-tint-caution-fg",
    chip: "bg-tint-caution-bg text-tint-caution-fg border-tint-caution-border",
  },
  avoid: {
    label: "Consider avoiding",
    tone: "text-tint-avoid-fg",
    chip: "bg-tint-avoid-bg text-tint-avoid-fg border-tint-avoid-border",
  },
};

type Props = { score: number; category: HealthCategory };

export function HealthMeter({ score, category }: Props) {
  const meta = CATEGORY_META[category];
  const pct = Math.max(0, Math.min(100, score));
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFill(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Health meter
        </span>
        <span
          className={cn("font-serif text-5xl leading-none", meta.tone)}
          style={{ filter: "drop-shadow(var(--shadow-pop))" }}
        >
          {pct}
        </span>
      </div>
      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-muted/70 shadow-inner">
        <div
          className="h-full rounded-full"
          style={{
            width: `${fill}%`,
            background: "var(--gradient-meter)",
            transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
      <div className="mt-4">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            meta.chip,
          )}
        >
          {meta.label}
        </span>
      </div>
    </div>
  );
}
