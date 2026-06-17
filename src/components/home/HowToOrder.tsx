import { Reveal } from "@/components/Reveal";
import { MessageCircle, Link2, CalendarClock, CheckCheck } from "lucide-react";

const WHATS_NUMBER = "5564999611088";
const WHATS_DISPLAY = "+55 (64) 99961-1088";
const WHATS_MSG = encodeURIComponent(
  "Oi! Quero fazer um pedido na Facilit.\n\n• Plataforma: \n• Matéria/atividade: \n• Prazo de entrega: \n• Link ou print da tarefa: ",
);
const WHATS_LINK = `https://wa.me/${WHATS_NUMBER}?text=${WHATS_MSG}`;

const ITEMS = [
  {
    icon: Link2,
    title: "1. Link ou print",
    desc: "Cole o link da atividade ou manda um print/PDF. Quanto mais claro, mais rápido a gente responde.",
  },
  {
    icon: CalendarClock,
    title: "2. Prazo",
    desc: "Eu analiso sua tarefa e a demanda do momento e te passo o prazo real de entrega. Pedidos de maior valor entram na frente da fila. Só fecho se conseguir cumprir.",
  },
  {
    icon: CheckCheck,
    title: "3. Confirma e relaxa",
    desc: "Mandamos o valor, você paga no Pix e te avisamos quando estiver entregue na plataforma.",
  },
];

export function HowToOrder() {
  return (
    <section
      id="pedir"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">
              Pedir é simples
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-5">
              Manda no <span className="italic text-gold-soft">WhatsApp</span> em 1 minuto
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              Sem cadastro, sem formulário gigante. Cola a tarefa, diz o prazo
              e a gente cuida do resto. Atendimento humano, resposta rápida.
            </p>
            <a
              href={WHATS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white font-semibold px-5 py-3 text-sm md:text-base hover:brightness-110 transition"
            >
              <MessageCircle className="h-5 w-5" />
              Abrir WhatsApp
            </a>
            <p className="text-xs text-muted-foreground mt-3 font-mono">{WHATS_DISPLAY}</p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <div className="bento p-5 md:p-6 flex items-start gap-4">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
