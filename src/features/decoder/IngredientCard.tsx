import { cn } from "@/lib/utils";
import type { EvidenceLevel } from "./schema";

type Props = {
  name: string;
  common_name: string;
  purpose: string;
  safety_note: string;
  evidence_level: EvidenceLevel;
};

const EVIDENCE_TONE: Record<EvidenceLevel, string> = {
  strong: "text-primary border-primary/30 bg-primary/5",
  moderate: "text-foreground border-border bg-secondary",
  limited: "text-[oklch(0.5_0.1_60)] border-[oklch(0.85_0.06_60)] bg-[oklch(0.97_0.03_75)]",
  unclear: "text-muted-foreground border-border bg-muted",
};

export function IngredientCard({
  name,
  common_name,
  purpose,
  safety_note,
  evidence_level,
}: Props) {
  return (
    <article className="group rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-quiet)] transition-shadow duration-200 hover:shadow-[var(--shadow-lifted)]">
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
            EVIDENCE_TONE[evidence_level],
          )}
        >
          {evidence_level}
        </span>
      </div>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">
            Purpose
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
