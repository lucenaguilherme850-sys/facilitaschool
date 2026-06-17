export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-sm text-muted-foreground flex flex-wrap justify-between gap-3">
        <span>© {new Date().getFullYear()} Facilit.</span>
        <span>Atendimento: (64) 99961-1088</span>
      </div>
    </footer>
  );
}
