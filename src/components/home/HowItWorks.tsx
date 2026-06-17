import { Reveal } from "@/components/Reveal";
import { HOW_STEPS } from "./home.data";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 border-t border-border/40">
      <Reveal>
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Como funciona</div>
        <h2 className="fluid-h2 mb-10 sm:mb-12 max-w-2xl">Três passos. Sem complicação.</h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6">
        {HOW_STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 140}>
            <div className="rounded-2xl p-6 bg-card/60 border border-border/40 lift hover:border-gold/50 hover:shadow-card">
              <div className="h-10 w-10 rounded-lg bg-secondary border border-border/60 grid place-items-center text-gold mb-4">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
