import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DecodeResult } from "./schema";

type Props = { items: DecodeResult["ingredients"] };

export function GrandmaTest({ items }: Props) {
  const total = items.length;
  if (!total) return null;
  const common = items.filter((i) => i.kitchen_familiarity === "common_kitchen").length;
  const stars = Math.round((common / total) * 5);

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Grandma Understandability
        </span>
        <span className="text-2xl leading-none" aria-hidden>
          👵
        </span>
      </div>
      <div
        className="mt-3 flex items-center gap-1"
        role="img"
        aria-label={`${stars} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-6 w-6 transition-transform duration-200",
              i < stars
                ? "fill-tint-caution-fg text-tint-caution-fg"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        Only {common} of {total} ingredients are commonly found in a traditional kitchen.
      </p>
    </div>
  );
}
