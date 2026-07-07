import type { ProductType } from "./schema";

type Props = { text: string; productType?: ProductType };

const LABEL: Record<ProductType, string> = {
  food: "Kitchen Language",
  skincare: "Simple Language",
  medicine: "Plain Language",
};

export function PlainLanguageExplanation({ text, productType }: Props) {
  const label = productType ? LABEL[productType] : "In plain language";
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-secondary/60 p-6 shadow-[var(--shadow-quiet)]">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground">
        {text}
      </p>
    </div>
  );
}
