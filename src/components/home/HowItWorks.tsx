import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";

const STEPS = [
  { title: "Envie a tarefa", description: "Mande o link ou PDF pelo WhatsApp em menos de 1 minuto." },
  { title: "Efetue o Pix", description: "Preço fixo por atividade. Confirmação imediata, sem surpresas." },
  { title: "Receba pronto", description: "A gente entrega direto na plataforma, antes do prazo final." },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border"
    >
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">
            Processo
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Três passos. <span className="italic text-gold-soft">Sem complicação.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Otimizamos cada etapa para você não perder tempo nem energia.
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-5xl mx-auto">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 140}>
            <motion.div
              className="relative px-4 pt-12 text-center md:text-left group"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <motion.span
                className="absolute -top-2 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 font-display text-6xl text-gold/20 leading-none select-none group-hover:text-gold/40 transition-colors duration-500"
                aria-hidden="true"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
              <h3 className="font-display text-2xl mb-3 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
