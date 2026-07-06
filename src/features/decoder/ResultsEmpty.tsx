type Props = { onExample: () => void };

export function ResultsEmpty({ onExample }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-transparent p-8 text-center">
      <p className="text-base text-muted-foreground">
        Your decoded breakdown will appear here.
      </p>
      <button
        type="button"
        onClick={onExample}
        className="mt-4 inline-flex min-h-9 items-center rounded-full border border-border bg-card px-4 text-sm text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Try an example
      </button>
    </div>
  );
}
