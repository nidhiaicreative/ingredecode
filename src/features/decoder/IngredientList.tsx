import { IngredientCard } from "./IngredientCard";
import type { DecodeResult } from "./schema";

type Props = { items: DecodeResult["ingredients"] };

export function IngredientList({ items }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Ingredients &middot; {items.length}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <IngredientCard key={`${item.name}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}
