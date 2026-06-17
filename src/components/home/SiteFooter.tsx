export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase font-medium">
          © {new Date().getFullYear()} Facilit. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-1 font-semibold">
              Suporte direto
            </p>
            <p className="text-sm font-medium text-foreground">(64) 99961-1088</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
