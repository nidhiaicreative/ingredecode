export function SiteFooter() {
  return (
    <footer
      id="about"
      className="mx-auto mt-24 w-full max-w-3xl border-t border-border px-6 py-10 text-sm text-muted-foreground"
    >
      <p className="mb-3 font-serif text-lg text-foreground">
        A quiet tool for informed choices.
      </p>
      <p className="leading-relaxed">
        IngreDecode was built by a former molecular biologist who believes
        label literacy shouldn&rsquo;t require a chemistry degree. Explanations
        are educational and not a substitute for medical, dietary, or
        dermatological advice. When in doubt, ask a qualified professional.
      </p>
      <p className="mt-6 text-xs">&copy; {new Date().getFullYear()} IngreDecode</p>
    </footer>
  );
}
