import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 group min-w-0 tap-target -ml-2 px-2 rounded-lg"
          aria-label="Página inicial Facilit"
        >
          <div className="h-8 w-8 rounded-lg bg-gold flex items-center justify-center shrink-0">
            <div className="h-3 w-3 border-2 border-background rotate-45" />
          </div>
          <span className="font-display text-xl sm:text-2xl tracking-tight truncate text-foreground">
            Facilit<span className="text-gold">.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-0 sm:gap-2 text-[11px] sm:text-sm font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em] text-muted-foreground shrink-0">
          <Link
            to="/"
            hash="servicos"
            className="tap-target inline-flex items-center px-2 sm:px-3 rounded-lg hover:text-gold transition-colors"
          >
            Serviços
          </Link>
          <Link
            to="/"
            hash="como-funciona"
            className="hidden sm:inline-flex tap-target items-center px-3 rounded-lg hover:text-gold transition-colors"
          >
            Como funciona
          </Link>
        </nav>
      </div>
    </header>
  );
}
