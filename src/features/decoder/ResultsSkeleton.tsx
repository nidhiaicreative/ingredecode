function Bar({ className = "" }: { className?: string }) {
  return <div className={`h-3 animate-pulse rounded bg-muted ${className}`} />;
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-quiet)]">
        <Bar className="w-24" />
        <Bar className="mt-4 w-3/4 h-5" />
        <Bar className="mt-2 w-2/3 h-5" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-quiet)]">
        <Bar className="w-16" />
        <Bar className="mt-4 w-full h-2" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-quiet)]">
        <Bar className="w-20" />
        <div className="mt-3 flex gap-2">
          <Bar className="h-6 w-16 rounded-full" />
          <Bar className="h-6 w-20 rounded-full" />
          <Bar className="h-6 w-14 rounded-full" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-quiet)]">
            <Bar className="w-1/2 h-5" />
            <Bar className="mt-3 w-full" />
            <Bar className="mt-2 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
