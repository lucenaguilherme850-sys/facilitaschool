import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { ArrowRight, Lock, Zap, ShieldCheck } from "lucide-react";
import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { listServices } from "@/lib/orders.functions";

const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => listServices(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executa — Serviços educacionais via Pix" },
      { name: "description", content: "Atividades GoEnglish, Netescola/Ser Goiás e Revisa Goiás executadas com atenção. Pagamento via Pix, entrega no prazo." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: Index,
});

function priceLabel(cents: number, unit: string) {
  const v = (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  return `R$ ${v} / ${unit}`;
}

function Index() {
  const { data: services } = useSuspenseQuery(servicesQuery);

  return (
    <>
      <Background />
      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-6">
            <span className="h-px w-8 bg-gold" /> Serviços
          </div>
          <h1 className="text-5xl md:text-7xl leading-[1.05]">
            Qual serviço <em className="not-italic text-gold">você precisa?</em>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Escolha abaixo e preencha um formulário rápido. Pagamento via Pix, entrega no prazo combinado.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="servicos" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Link
              key={s.id}
              to="/servico/$slug"
              params={{ slug: s.slug }}
              className="group relative rounded-2xl bg-card shadow-card border border-border/60 p-6 hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold animate-fade-up"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="aspect-[16/9] rounded-xl bg-secondary/60 border border-border/40 mb-5 grid place-items-center overflow-hidden">
                <div className="h-14 w-14 rounded-xl bg-gold-gradient grid place-items-center shadow-gold animate-float">
                  <span className="font-display text-2xl text-primary-foreground">
                    {s.name.charAt(0)}
                  </span>
                </div>
              </div>
              <h3 className="font-display text-2xl mb-2">{s.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{s.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-gold text-sm font-medium">{priceLabel(s.price_cents, s.unit)}</span>
                <span className="h-9 w-9 rounded-full border border-border/60 grid place-items-center group-hover:bg-gold group-hover:border-gold group-hover:text-primary-foreground transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-10 tracking-wide">
          100% automático · Feito com atenção · Sem risco de detecção
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24 border-t border-border/40">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Como funciona</div>
        <h2 className="text-4xl md:text-5xl mb-12 max-w-2xl">Três passos. Sem complicação.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { i: Zap, t: "Escolha e preencha", d: "Selecione o serviço e preencha os dados em menos de 1 minuto." },
            { i: Lock, t: "Pague via Pix", d: "Você recebe um código único, faz o Pix e envia o comprovante." },
            { i: ShieldCheck, t: "Receba no prazo", d: "Executamos o serviço com cuidado e te avisamos quando estiver pronto." },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-6 bg-card/60 border border-border/40 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border/60 grid place-items-center text-gold mb-4">
                <s.i className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground flex flex-wrap justify-between gap-4">
          <span>© {new Date().getFullYear()} Executa.</span>
          <span>Atendimento: (64) 99961-1088</span>
        </div>
      </footer>
    </>
  );
}
