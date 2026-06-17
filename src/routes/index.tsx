import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { ArrowRight, Lock, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { ScrollIntro } from "@/components/ScrollIntro";
import { listServices } from "@/lib/orders.functions";
import { formatPriceUnit } from "@/lib/format";

const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => listServices(),
  staleTime: 5 * 60_000,
});

function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-2">Não foi possível carregar</h1>
      <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
      <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary text-primary-foreground px-6 py-2.5">Tentar novamente</button>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Facilit — Suas atividades feitas, sem cobrança de professor" },
      { name: "description", content: "Cansado de professor te enchendo o saco pra entregar atividade? A Facilit resolve por você: GoEnglish, Netescola e Revisa Goiás entregues no prazo, pagamento via Pix, 100% sigilo." },
      { property: "og:title", content: "Facilit — Suas atividades feitas, sem dor de cabeça" },
      { property: "og:description", content: "Pare de adiar atividade escolar. A gente executa por você — entrega no prazo, Pix e sigilo total." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Index,
  errorComponent: RouteError,
  notFoundComponent: () => <div className="p-10 text-center">Página não encontrada.</div>,
});

function priceLabel(cents: number, unit: string) {
  return formatPriceUnit(cents, unit);
}


function Index() {
  const { data: services } = useSuspenseQuery(servicesQuery);

  return (
    <>
      <Background />
      <ScrollIntro name="FACILIT" />
      <Header />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <div className="orb h-[300px] w-[300px] sm:h-[420px] sm:w-[420px] -top-32 -left-24 opacity-70" />
        <div className="orb orb-blue h-[260px] w-[260px] sm:h-[360px] sm:w-[360px] top-10 right-0 opacity-60" style={{ animationDelay: "-6s" }} />

        <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT — copy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6 sm:mb-8 animate-fade-in">
              <span className="h-px w-8 bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold">Serviços</span>
            </div>

            <h1 className="fluid-display text-balance mb-6 sm:mb-8" style={{ animation: "var(--animate-blur-in)" }}>
              Chega de professor <em className="not-italic italic text-gold">no seu pé.</em>
            </h1>


            <p className="fluid-lead text-muted-foreground max-w-xl mb-8 sm:mb-10" style={{ animation: "var(--animate-blur-in)", animationDelay: "180ms" }}>
              A Facilit faz suas atividades de GoEnglish, Netescola e Revisa Goiás <strong className="text-foreground">no prazo</strong>, com sigilo total. Você paga via Pix e a gente entrega — simples assim.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 sm:mb-14 w-full sm:w-auto" style={{ animation: "var(--animate-fade-up)", animationDelay: "320ms" }}>
              <Link
                to="/"
                hash="servicos"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-medium tracking-wide px-6 sm:px-8 py-3.5 sm:py-4 shadow-xl shadow-primary/15 hover:shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                Ver serviços
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/" hash="como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors sweep text-center sm:text-left">

                Como funciona →
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8 border-t border-border/40 w-full max-w-xl" style={{ animation: "var(--animate-fade-up)", animationDelay: "460ms" }}>
              {["Entrega no prazo", "Pagamento via Pix", "100% Sigilo"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — glass mockup */}
          <div className="hidden lg:flex lg:col-span-5 relative" style={{ animation: "var(--animate-fade-up)", animationDelay: "260ms" }}>
            <div className="relative w-full aspect-square flex items-center justify-center">
              {/* back card */}
              <div className="absolute z-10 top-4 right-4 w-4/5 h-full rounded-2xl border border-border/40 bg-primary/[0.03] rotate-[4deg]" />

              {/* main glass card */}
              <div className="relative z-20 w-4/5 p-7 rounded-2xl border border-white/50 bg-white/60 shadow-2xl rotate-[-2deg] animate-float" style={{ backdropFilter: "blur(20px) saturate(140%)" }}>
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

              {/* floating proof card */}
              <div className="absolute -bottom-2 -left-4 z-30 p-4 pr-5 rounded-xl border border-white/60 bg-white/85 shadow-xl flex items-center gap-3" style={{ backdropFilter: "blur(14px)" }}>
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
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="servicos" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 110}>
              <Link
                to="/servico/$slug"
                params={{ slug: s.slug }}
                className="group relative block rounded-2xl bg-card shadow-card border border-border/60 p-6 hover:border-gold/60 transition-all duration-500 lift hover:shadow-gold"
              >
                <div className="aspect-[16/9] rounded-xl bg-secondary/60 border border-border/40 mb-5 grid place-items-center overflow-hidden">
                  <div className="h-14 w-14 rounded-xl bg-gold-gradient grid place-items-center shadow-gold animate-float group-hover:scale-110 transition-transform duration-500">
                    <span className="font-display text-2xl text-primary-foreground">
                      {s.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-2xl mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{s.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-gold text-sm font-medium">{priceLabel(s.price_cents, s.unit)}</span>
                  <span className="h-9 w-9 rounded-full border border-border/60 grid place-items-center group-hover:bg-gold group-hover:border-gold group-hover:text-primary-foreground transition-all duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal variant="soft" delay={200}>
          <p className="text-center text-xs text-muted-foreground mt-10 tracking-wide">
            100% automático · Feito com atenção · Sem risco de detecção
          </p>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 border-t border-border/40">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Como funciona</div>
          <h2 className="fluid-h2 mb-10 sm:mb-12 max-w-2xl">Três passos. Sem complicação.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { i: Zap, t: "Escolha e preencha", d: "Selecione o serviço e preencha os dados em menos de 1 minuto." },
            { i: Lock, t: "Pague via Pix", d: "Você recebe um código único, faz o Pix e envia o comprovante." },
            { i: ShieldCheck, t: "Receba no prazo", d: "Executamos o serviço com cuidado e te avisamos quando estiver pronto." },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 140}>
              <div className="rounded-2xl p-6 bg-card/60 border border-border/40 lift hover:border-gold/50 hover:shadow-card">
                <div className="h-10 w-10 rounded-lg bg-secondary border border-border/60 grid place-items-center text-gold mb-4">
                  <s.i className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-sm text-muted-foreground flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Facilit.</span>
          <span>Atendimento: (64) 99961-1088</span>
        </div>
      </footer>
    </>
  );
}
