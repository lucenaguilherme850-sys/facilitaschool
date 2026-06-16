import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gold-gradient grid place-items-center shadow-gold shrink-0">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg sm:text-xl tracking-tight truncate">
            Facilit<span className="text-gold">.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground shrink-0">
          <Link to="/" hash="servicos" className="hover:text-foreground transition-colors">Serviços</Link>
          <Link to="/" hash="como-funciona" className="hidden xs:inline hover:text-foreground transition-colors sm:inline">Como funciona</Link>
        </nav>
      </div>
    </header>
  );
}
