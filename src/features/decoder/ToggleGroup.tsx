import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  id?: string;
};

export function ToggleGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  id,
}: Props<T>) {
  const groupId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-2">
      <span
        id={`${groupId}-label`}
        className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
        className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-secondary/60 p-1"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "min-h-9 rounded-full px-4 text-sm transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "bg-background text-foreground shadow-[var(--shadow-quiet)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
