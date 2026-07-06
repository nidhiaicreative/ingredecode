export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8 pb-4">
      <a href="/" className="flex items-baseline gap-1 focus-visible:outline-none">
        <span className="font-serif text-2xl leading-none text-foreground">
          Ingre<span className="text-primary">Decode</span>
        </span>
      </a>
      <a
        href="#about"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        About
      </a>
    </header>
  );
}
