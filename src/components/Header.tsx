import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gold-gradient grid place-items-center shadow-gold">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl tracking-tight">
            Executa<span className="text-gold">.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" hash="servicos" className="hover:text-foreground transition-colors">Serviços</Link>
          <Link to="/" hash="como-funciona" className="hover:text-foreground transition-colors">Como funciona</Link>
          <Link to="/auth" className="hover:text-foreground transition-colors">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
