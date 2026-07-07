import { cn } from "@/lib/utils";
import type { EvidenceLevel } from "./schema";

type Props = {
  name: string;
  common_name: string;
  purpose: string;
  safety_note: string;
  evidence_level: EvidenceLevel;
};

const EVIDENCE_STYLE: Record<
  EvidenceLevel,
  { card: string; badge: string }
> = {
  strong: {
    card: "bg-tint-safe-bg border-tint-safe-border",
    badge: "bg-tint-safe-bg text-tint-safe-fg border-tint-safe-border",
  },
  moderate: {
    card: "bg-tint-moderate-bg border-tint-moderate-border",
    badge: "bg-tint-moderate-bg text-tint-moderate-fg border-tint-moderate-border",
  },
  limited: {
    card: "bg-tint-caution-bg border-tint-caution-border",
    badge: "bg-tint-caution-bg text-tint-caution-fg border-tint-caution-border",
  },
  unclear: {
    card: "bg-tint-avoid-bg border-tint-avoid-border",
    badge: "bg-tint-avoid-bg text-tint-avoid-fg border-tint-avoid-border",
  },
};

export function IngredientCard({
  name,
  common_name,
  purpose,
  safety_note,
  evidence_level,
}: Props) {
  const style = EVIDENCE_STYLE[evidence_level];
  return (
    <article
      className={cn(
        "group border p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-lifted)] motion-safe:hover:-translate-y-0.5",
        style.card,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-foreground">{name}</h3>
          {common_name && common_name.toLowerCase() !== name.toLowerCase() ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{common_name}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            style.badge,
          )}
        >
          {evidence_level}
        </span>
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">
            Why added?
          </dt>
          <dd className="mt-0.5 leading-relaxed text-foreground">{purpose}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">
            Safety note
          </dt>
          <dd className="mt-0.5 leading-relaxed text-foreground">{safety_note}</dd>
        </div>
      </dl>
    </article>
  );
}
