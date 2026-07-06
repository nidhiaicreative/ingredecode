export function Hero() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 pt-10 pb-8 sm:pt-16 sm:pb-12">
      <p className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Built by a molecular biologist
      </p>
      <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
        Know what&rsquo;s inside,
        <br />
        <span className="italic text-primary">before it&rsquo;s inside you.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        Paste any confusing ingredient list &mdash; food, skincare, or medicine &mdash;
        and get a calm, evidence-based breakdown in seconds.
      </p>
    </section>
  );
}
