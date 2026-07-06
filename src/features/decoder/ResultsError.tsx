type Props = { code: string; message: string; onRetry: () => void };

const FRIENDLY: Record<string, string> = {
  config: "The decoder isn't configured yet. Add the Mesh API credentials and try again.",
  network: "We couldn't reach the decoder. Please try again.",
  rate_limited: "Too many requests right now. Give it a moment.",
  upstream: "The decoder had trouble responding. Please try again.",
  parse: "The decoder returned an unexpected response. Retrying often fixes this.",
};

export function ResultsError({ code, message, onRetry }: Props) {
  const friendly = FRIENDLY[code] ?? "Something went wrong. Please try again.";
  return (
    <div
      role="alert"
      className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6"
    >
      <p className="font-serif text-lg text-foreground">{friendly}</p>
      {code === "config" ? (
        <p className="mt-2 text-xs text-muted-foreground">{message}</p>
      ) : null}
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex min-h-9 items-center rounded-full bg-foreground px-4 text-sm text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Try again
      </button>
    </div>
  );
}
