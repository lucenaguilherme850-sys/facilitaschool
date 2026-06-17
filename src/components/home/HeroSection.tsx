import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Main hero cell */}
        <div className="lg:col-span-8 bento p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden min-h-[480px] lg:min-h-[560px]">
          <div className="orb h-[420px] w-[420px] -top-32 -right-32 opacity-100" />

          <div className="relative z-10">
            <div
              className="flex items-center gap-3 mb-8 animate-fade-in"
              style={{ animationDelay: "80ms" }}
            >
              <span className="h-px w-8 bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold">
                Soluções Acadêmicas
              </span>
            </div>

            <h1
              className="fluid-display mb-8 text-balance"
              style={{ animation: "var(--animate-blur-in)" }}
            >
              Chega de professor<br />
              <em className="italic text-gold-soft not-italic" style={{ fontStyle: "italic" }}>
                no seu pé.
              </em>
            </h1>

            <p
              className="fluid-lead text-muted-foreground max-w-md mb-10 leading-relaxed"
              style={{ animation: "var(--animate-blur-in)", animationDelay: "180ms" }}
            >
              A Facilit faz suas atividades de GoEnglish, Netescola e Revisa Goiás{" "}
              <strong className="text-foreground font-medium">no prazo</strong>, com sigilo total.
              Você paga via Pix e a gente entrega.
            </p>

            <div
              className="flex flex-wrap gap-3 sm:gap-4"
              style={{ animation: "var(--animate-fade-up)", animationDelay: "320ms" }}
            >
              <Link
                to="/"
                hash="servicos"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold text-primary-foreground font-semibold tracking-tight px-7 py-3.5 shadow-gold hover:bg-gold-soft hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Ver serviços
              </Link>
              <Link
                to="/"
                hash="como-funciona"
                className="inline-flex items-center justify-center rounded-full border border-border text-foreground font-medium px-7 py-3.5 hover:bg-white/5 transition-colors duration-300"
              >
                Como funciona →
              </Link>
            </div>
          </div>
        </div>

        {/* Right bento stack */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
          {/* Social proof cell */}
          <div
            className="bento flex-1 p-6 md:p-8 flex flex-col justify-between min-h-[200px]"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "260ms" }}
          >
            <div className="flex -space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-card bg-neutral-700" />
              <div className="w-10 h-10 rounded-full border-2 border-card bg-neutral-600" />
              <div className="w-10 h-10 rounded-full border-2 border-card bg-neutral-500" />
              <div className="w-10 h-10 rounded-full border-2 border-card bg-gold flex items-center justify-center text-[11px] text-primary-foreground font-bold">
                +47
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] mb-2 font-semibold">
                Confiança
              </p>
              <p className="text-lg font-display leading-tight text-foreground">
                Alunos atendidos esta semana
              </p>
            </div>
          </div>

          {/* Privacy cell */}
          <div
            className="bento flex-1 p-6 md:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[200px]"
            style={{
              animation: "var(--animate-fade-up)",
              animationDelay: "380ms",
              background: "linear-gradient(135deg, var(--card) 0%, var(--background) 100%)",
              borderColor: "oklch(0.78 0.12 82 / 0.22)",
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <p className="text-xl font-display italic text-gold-soft">Sigilo Absoluto</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] mt-2 font-semibold">
              Identidade Protegida
            </p>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div
        className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-border opacity-70"
        style={{ animation: "var(--animate-fade-up)", animationDelay: "500ms" }}
      >
        {["Entrega no prazo", "Pagamento via Pix", "100% Sigilo"].map((label) => (
          <div key={label} className="flex items-center justify-center gap-3">
            <span className="h-1 w-1 rounded-full bg-gold shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
