import { Reveal } from "@/components/Reveal";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = [
  {
    q: "Quanto tempo demora pra entregar?",
    a: "Quem define o prazo sou eu, com base na sua tarefa e na demanda do momento. Pedidos de maior valor são priorizados e entram na frente da fila. Você manda no WhatsApp, eu analiso e te respondo com o prazo real — só fecho o pedido se conseguir cumprir.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Pix. Você recebe o valor fechado, paga, e a gente começa. Sem mensalidade, sem assinatura — paga só o que pedir.",
  },
  {
    q: "É seguro? Vão saber que foi vocês?",
    a: "Não. A entrega vai direto pela sua conta na plataforma. A gente não compartilha login com terceiros e apaga os dados depois da entrega.",
  },
  {
    q: "E se a nota vier baixa?",
    a: "Se a atividade aceita revisão e a correção dependeu de algo que erramos, refazemos sem custo. Provas presenciais e correções subjetivas do professor estão fora do nosso controle — somos honestos sobre isso.",
  },
  {
    q: "Vocês fazem prova presencial ou simulado ao vivo?",
    a: "Não. Trabalhamos só com atividades assíncronas em plataforma (tasks, questionários, redações, listas).",
  },
  {
    q: "Preciso passar minha senha?",
    a: "Na maioria dos casos sim, pra acessar a plataforma e entregar. A senha é usada só pra essa entrega — recomendamos que você troque depois se quiser.",
  },
  {
    q: "Qual o valor?",
    a: "Cada serviço tem preço fixo por unidade (atividade, unit, redação) — confira na seção Serviços. Sem taxa extra, sem surpresa.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border"
    >
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">
            Dúvidas
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Perguntas <span className="italic text-gold-soft">frequentes</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Resposta direta, sem enrolação. Se ficar com dúvida, chama no WhatsApp.
          </p>
        </div>
      </Reveal>

      <div className="space-y-2">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 60}>
              <div className="bento overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left hover:bg-secondary/40 transition-colors"
                >
                  <span className="font-display text-base md:text-lg text-foreground">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
