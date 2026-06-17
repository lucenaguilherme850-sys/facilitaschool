import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HeroMockup } from "./HeroMockup";
import { TrustStrip } from "./TrustStrip";

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
      <div className="orb h-[300px] w-[300px] sm:h-[420px] sm:w-[420px] -top-32 -left-24 opacity-70" />
      <div
        className="orb orb-blue h-[260px] w-[260px] sm:h-[360px] sm:w-[360px] top-10 right-0 opacity-60"
        style={{ animationDelay: "-6s" }}
      />

      <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-6 sm:mb-8 animate-fade-in">
            <span className="h-px w-8 bg-gold" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold">Serviços</span>
          </div>

          <h1 className="fluid-display text-balance mb-6 sm:mb-8" style={{ animation: "var(--animate-blur-in)" }}>
            Chega de professor <em className="not-italic italic text-gold">no seu pé.</em>
          </h1>

          <p
            className="fluid-lead text-muted-foreground max-w-xl mb-8 sm:mb-10"
            style={{ animation: "var(--animate-blur-in)", animationDelay: "180ms" }}
          >
            A Facilit faz suas atividades de GoEnglish, Netescola e Revisa Goiás{" "}
            <strong className="text-foreground">no prazo</strong>, com sigilo total. Você paga via Pix e a gente entrega — simples assim.
          </p>

          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 sm:mb-14 w-full sm:w-auto"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "320ms" }}
          >
            <Link
              to="/"
              hash="servicos"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-medium tracking-wide px-6 sm:px-8 py-3.5 sm:py-4 shadow-xl shadow-primary/15 hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              Ver serviços
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/"
              hash="como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors sweep text-center sm:text-left"
            >
              Como funciona →
            </Link>
          </div>

          <TrustStrip />
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}
