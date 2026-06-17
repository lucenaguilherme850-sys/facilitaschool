import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "./ServiceCard";
import type { Service } from "./types";

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section id="servicos" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
      <div className="grid md:grid-cols-3 gap-5">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 110}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
      <Reveal variant="soft" delay={200}>
        <p className="text-center text-xs text-muted-foreground mt-10 tracking-wide">
          100% automático · Feito com atenção · Sem risco de detecção
        </p>
      </Reveal>
    </section>
  );
}
