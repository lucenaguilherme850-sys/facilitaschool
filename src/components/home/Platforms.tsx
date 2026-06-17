import { Reveal } from "@/components/Reveal";
import { GraduationCap, BookOpen, Languages, FileText, School, Sparkles } from "lucide-react";

const PLATFORMS = [
  { name: "NetEscola", icon: School, desc: "Atividades, redações e simulados" },
  { name: "Ser Goiás", icon: BookOpen, desc: "Plataforma estadual de ensino" },
  { name: "So-Vem-Enem", icon: GraduationCap, desc: "Trilhas e exercícios do Enem" },
  { name: "GoEnglish / Efekta / Speak", icon: Languages, desc: "Idiomas: tasks, units e provas" },
  { name: "IFA", icon: Sparkles, desc: "Instituto de Formação Acadêmica" },
  { name: "Revisa Goiás", icon: FileText, desc: "Cadernos e revisões oficiais" },
];

export function Platforms() {
  return (
    <section
      id="plataformas"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-border"
    >
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-3">
            Plataformas
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Trabalhamos com <span className="italic text-gold-soft">o que você usa</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Conhecemos cada plataforma por dentro — pegamos a tarefa, entendemos a
            lógica e entregamos certo da primeira vez.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {PLATFORMS.map((p, i) => (
          <Reveal key={p.name} delay={i * 70}>
            <div className="group bento p-5 md:p-6 h-full flex items-start gap-4 hover:border-gold/40 transition-colors">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <p.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg text-foreground truncate">{p.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{p.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="text-center text-xs text-muted-foreground mt-8">
          Não vê sua plataforma aqui? Chama no WhatsApp — provavelmente atendemos.
        </p>
      </Reveal>
    </section>
  );
}
