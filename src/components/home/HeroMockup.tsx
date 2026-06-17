import { CheckCircle2 } from "lucide-react";

export function HeroMockup() {
  return (
    <div
      className="hidden lg:flex lg:col-span-5 relative"
      style={{ animation: "var(--animate-fade-up)", animationDelay: "260ms" }}
    >
      <div className="relative w-full aspect-square flex items-center justify-center">
        <div className="absolute z-10 top-4 right-4 w-4/5 h-full rounded-2xl border border-border/40 bg-primary/[0.03] rotate-[4deg]" />

        <div
          className="relative z-20 w-4/5 p-7 rounded-2xl border border-white/50 bg-white/60 shadow-2xl rotate-[-2deg] animate-float"
          style={{ backdropFilter: "blur(20px) saturate(140%)" }}
        >
          <div className="h-12 w-12 rounded-full mb-6 grid place-items-center bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-3 mb-7">
            <div className="h-2 w-3/4 rounded-full bg-primary/10" />
            <div className="h-2 w-full rounded-full bg-primary/10" />
            <div className="h-2 w-1/2 rounded-full bg-primary/10" />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-1">Status</p>
              <p className="text-sm font-semibold text-primary">Execução Premium</p>
            </div>
            <p className="font-display text-3xl text-gold leading-none">99%</p>
          </div>
        </div>

        <div
          className="absolute -bottom-2 -left-4 z-30 p-4 pr-5 rounded-xl border border-white/60 bg-white/85 shadow-xl flex items-center gap-3"
          style={{ backdropFilter: "blur(14px)" }}
        >
          <div className="flex -space-x-2">
            <span className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-gold to-gold-soft" />
            <span className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary to-primary/60" />
            <span className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-secondary to-accent" />
          </div>
          <div className="text-xs leading-tight">
            <p className="font-bold text-primary">+47 alunos</p>
            <p className="text-muted-foreground">atendidos com sigilo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
